import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ThumbsUp, Share2, MessageSquare, Clock, User, Eye } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import BlogLoader from '../components/BlogLoader';
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
    <div className="comment-box">
      {user ? (
        <form onSubmit={handleComentar} className="comment-form">
          <div className="comment-user">
            <img src={user.imagem} alt="Avatar" className="comment-avatar comment-avatar--sm" referrerPolicy="no-referrer" />
            <span>{user.nome}</span>
          </div>
          <textarea 
            placeholder="O que você achou deste artigo?" 
            value={novoComentario}
            onChange={e => setNovoComentario(e.target.value)}
            className="comment-textarea"
          />
          <button type="submit" className="btn btn-primary comment-submit">Publicar Comentário</button>
        </form>
      ) : (
        <div className="comment-login-state">
          <p>Faça login para participar da discussão.</p>
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

  if (!post) {
    return (
      <div className="blog-container post-loading-container">
        <BlogLoader
          title="Abrindo o artigo"
          message="Carregando conteúdo, imagem e interações do post."
        />
      </div>
    );
  }

  return (
    <div className="blog-container post-detail-wrapper">
      
      <Helmet>
        <title>{post.titulo} | KSI LAB</title>
        <link rel="canonical" href={`https://kineticsolutions.com.br/lab/${slug}`} />
        <meta name="description" content={post.descricao} />
        {post.keywords && <meta name="keywords" content={post.keywords} />}

        {/* Open Graph / Facebook / LinkedIn / WhatsApp */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${post.titulo} | KSI LAB`} />
        <meta property="og:description" content={post.descricao} />
        <meta property="og:image" content={post.imagem_capa || 'https://kineticsolutions.com.br/banner-kinetic-solutions-16-9.png'} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Kinetic Solutions" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.titulo} | KSI LAB`} />
        <meta name="twitter:description" content={post.descricao} />
        <meta name="twitter:image" content={post.imagem_capa || 'https://kineticsolutions.com.br/banner-kinetic-solutions-16-9.png'} />
      </Helmet>

      <Link to="/lab" className="back-link">
        <ArrowLeft size={16} /> Voltar para o Lab
      </Link>

      <div className="post-header-meta">
        <span className="post-category post-category--hero">{post.categoria_nome}</span>
        <h1 className="blog-title post-title">{post.titulo}</h1>
        
        <div className="post-meta-info">
          
          <div className="post-byline">
            <span><User size={16} /> {post.autor_nome}</span>
            <span><Clock size={16} /> {new Date(post.data_publicacao).toLocaleDateString('pt-BR')}</span>
            <span><Eye size={16} /> {post.visualizacoes} views</span>
          </div>

          <div className="post-action-row">
            <button onClick={handleLike} className={`post-action-btn ${interacoes.userLiked ? 'is-active' : ''}`} aria-label="Curtir artigo">
              <ThumbsUp size={16} fill={interacoes.userLiked ? '#fff' : 'none'} /> {interacoes.likes}
            </button>
            <button onClick={handleShare} className="post-action-btn" aria-label="Compartilhar artigo">
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
      />

      <hr className="post-divider" />

      <div id="comentarios" className="comments-section">
        <h3 className="comments-title">
          <MessageSquare size={24} color="var(--accent-color)" /> Comentários ({comentarios.length})
        </h3>

        <CaixaDeComentario 
          user={user} 
          postId={post.id} 
          loginGoogle={loginGoogle} 
          onCommentSuccess={recarregarComentarios} 
        />

        <div className="comments-list">
          {comentarios.map((c: any) => (
            <div key={c.id} className="comment-item">
              <img src={c.imagem} alt={c.nome} className="comment-avatar" referrerPolicy="no-referrer" />
              <div className="comment-bubble">
                <div className="comment-heading">
                  <span>{c.nome}</span>
                  <time>{new Date(c.data).toLocaleDateString('pt-BR')}</time>
                </div>
                <p>{c.comentario}</p>
              </div>
            </div>
          ))}
          {comentarios.length === 0 && (
             <p className="empty-comments">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
          )}
        </div>
      </div>

    </div>
  );
}
