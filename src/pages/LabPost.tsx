import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ThumbsUp, Share2, MessageSquare, Clock, User, Eye } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import '../styles/blog.css';

function CaixaDeComentario({ user, postId, loginGoogle, onCommentSuccess }: any) {
  const [novoComentario, setNovoComentario] = useState('');

  const handleComentar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return loginGoogle();
    if (!novoComentario.trim()) return;

    try {
      await api.post(`/blog/posts/${postId}/comentarios`, { comentario: novoComentario });
      setNovoComentario('');
      onCommentSuccess(); 
    } catch (e) { 
      alert("Erro ao publicar comentário."); 
    }
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.6)', padding: '24px', borderRadius: '16px', marginBottom: '32px', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }}>
      {user ? (
        <form onSubmit={handleComentar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={user.imagem} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
            <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-body)' }}>{user.nome}</span>
          </div>
          <textarea 
            placeholder="O que você achou deste artigo?" 
            value={novoComentario}
            onChange={e => setNovoComentario(e.target.value)}
            style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: '#000', resize: 'vertical', minHeight: '100px', fontFamily: 'var(--font-body)' }}
          />
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>Publicar Comentário</button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Faça login para participar da discussão.</p>
          <button type="button" onClick={() => loginGoogle()} className="btn btn-primary">Entrar com o Google</button>
        </div>
      )}
    </div>
  );
}

export default function LabPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [interacoes, setInteracoes] = useState({ likes: 0, compartilhamentos: 0, userLiked: false });
  const [comentarios, setComentarios] = useState([]);
  const [user, setUser] = useState<any>(null);

  const fetchUser = () => {
    api.get('/users')
      .then(res => setUser(res.data.returnObj || res.data))
      .catch(() => setUser(null));
  };

  useEffect(() => {
    fetchUser();
    window.addEventListener('authChange', fetchUser);
    return () => window.removeEventListener('authChange', fetchUser);
  }, []);

  useEffect(() => {
    api.get(`/blog/posts/${slug}`).then(res => {
      const p = res.data.returnObj || res.data;
      setPost(p);
      
      api.get(`/blog/posts/${p.id}/interacoes`).then(r => setInteracoes(r.data.returnObj || r.data));
      api.get(`/blog/posts/${p.id}/comentarios`).then(r => setComentarios(r.data.returnObj || r.data));
    }).catch(err => {
      console.error("Post não encontrado", err);
      window.location.href = '/lab';
    });
  }, [slug]);

  useEffect(() => {
    if (post) {
       api.get(`/blog/posts/${post.id}/interacoes`).then(r => setInteracoes(r.data.returnObj || r.data));
    }
  }, [user, post]);

  const loginGoogle = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        await api.post('/users/google-login', { token: codeResponse.code });
        
        window.dispatchEvent(new Event('authChange'));
      } catch (error) {
        alert('Erro ao fazer login.');
      }
    },
    flow: 'auth-code',
    scope: 'openid email profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read',
    prompt: 'consent'
  });

  const handleLike = async () => {
    if (!user) return loginGoogle();
    try {
      const res = await api.post(`/blog/posts/${post.id}/like`);
      const { status } = res.data.returnObj || res.data;
      
      setInteracoes(prev => ({
        ...prev,
        likes: status === 'adicionado' ? prev.likes + 1 : prev.likes - 1,
        userLiked: status === 'adicionado'
      }));
    } catch (e) { 
      alert("Erro ao processar like."); 
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({ 
          title: post.titulo, 
          text: post.descricao, 
          url: url 
        });
        
        registrarCompartilhamento();

      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Erro no compartilhamento nativo:", error);
        }
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copiado para a área de transferência!');
      registrarCompartilhamento();
    }
  };

  const registrarCompartilhamento = () => {
    api.post(`/blog/posts/${post.id}/share`).then(() => {
      setInteracoes(prev => ({ ...prev, compartilhamentos: prev.compartilhamentos + 1 }));
    }).catch(console.error);
  };

  const recarregarComentarios = () => {
    api.get(`/blog/posts/${post.id}/comentarios`).then(r => setComentarios(r.data.returnObj || r.data));
  };

  if (!post) return <div className="blog-container text-center" style={{ paddingTop: '20vh' }}>Carregando artigo...</div>;

  return (
    <div className="blog-container post-detail-wrapper">
      
      <Helmet>
        <title>{post.titulo} | KSI LAB</title>
        <meta name="description" content={post.descricao} />
      </Helmet>

      <Link to="/lab" className="back-link">
        <ArrowLeft size={16} /> Voltar para o Lab
      </Link>

      <div className="post-header-meta">
        <span className="post-category" style={{ fontSize: '1rem', marginBottom: '16px' }}>{post.categoria_nome}</span>
        <h1 className="blog-title" style={{ fontSize: '3rem', marginBottom: '24px', textTransform: 'none' }}>{post.titulo}</h1>
        
        <div className="post-meta-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16} /> {post.autor_nome}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> {new Date(post.data_publicacao).toLocaleDateString('pt-BR')}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={16} /> {post.visualizacoes} views</span>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleLike} className="btn" style={{ background: interacoes.userLiked ? '#3b82f6' : 'rgba(0,0,0,0.05)', color: interacoes.userLiked ? '#fff' : 'var(--text-primary)', border: '1px solid var(--glass-border)', padding: '8px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <ThumbsUp size={16} fill={interacoes.userLiked ? '#fff' : 'none'} /> {interacoes.likes}
            </button>
            <button onClick={handleShare} className="btn" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', padding: '8px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Share2 size={16} /> {interacoes.compartilhamentos}
            </button>
          </div>
        </div>
      </div>

      {post.imagem_capa && (
        <img src={post.imagem_capa} alt={post.titulo} className="main-post-image" />
      )}

      <article 
        className="ksi-article-body" 
        dangerouslySetInnerHTML={{ __html: post.conteudo.replace(/&nbsp;/g, ' ') }} 
        style={{ marginBottom: '64px' }}
      />

      <hr style={{ borderTop: '1px solid rgba(0,0,0,0.1)', margin: '48px 0' }} />

      <div id="comentarios">
        <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-heading)' }}>
          <MessageSquare size={24} color="var(--accent-color)" /> Comentários ({comentarios.length})
        </h3>

        <CaixaDeComentario 
          user={user} 
          postId={post.id} 
          loginGoogle={loginGoogle} 
          onCommentSuccess={recarregarComentarios} 
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {comentarios.map((c: any) => (
            <div key={c.id} style={{ display: 'flex', gap: '16px' }}>
              <img src={c.imagem} alt={c.nome} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} referrerPolicy="no-referrer" />
              <div style={{ background: 'rgba(255,255,255,0.4)', padding: '16px', borderRadius: '0 16px 16px 16px', flex: 1, border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{c.nome}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(c.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{c.comentario}</p>
              </div>
            </div>
          ))}
          {comentarios.length === 0 && (
             <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
          )}
        </div>
      </div>

    </div>
  );
}