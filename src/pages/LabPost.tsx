import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ThumbsUp, Share2, MessageSquare, Clock, User, Eye, Check, Bookmark, Sparkles } from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import BlogLoader from '../components/BlogLoader';
import '../styles/blog.css';
import { useTranslation } from 'react-i18next';

function CaixaDeComentario({ user, postId, loginGoogle, onCommentSuccess }: any) {
  const { t } = useTranslation();
  const [novoComentario, setNovoComentario] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleComentar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return loginGoogle();
    if (!novoComentario.trim()) return;

    setSubmitting(true);
    try {
      await api.post(`/blog/posts/${postId}/comentarios`, { comentario: novoComentario });
      setNovoComentario('');
      onCommentSuccess(); 
    } catch (e) { 
      alert(t('lab.commentError')); 
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comment-box">
      {user ? (
        <form onSubmit={handleComentar} className="comment-form">
          <div className="comment-user">
            <img src={user.imagem} alt="Avatar" className="comment-avatar comment-avatar--sm" referrerPolicy="no-referrer" />
            <div>
              <span style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 700 }}>{user.nome}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t('lab.commenter')}</span>
            </div>
          </div>
          <textarea 
            placeholder={t('lab.commentPlaceholder')} 
            value={novoComentario}
            onChange={e => setNovoComentario(e.target.value)}
            className="comment-textarea"
            rows={3}
          />
          <button type="submit" disabled={submitting || !novoComentario.trim()} className="btn btn-primary comment-submit">
            {submitting ? t('lab.publishing') : t('lab.publish')}
          </button>
        </form>
      ) : (
        <div className="comment-login-state">
          <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{t('lab.join')}</h4>
          <p style={{ margin: '0 0 16px 0' }}>{t('lab.loginPrompt')}</p>
          <button type="button" onClick={() => loginGoogle()} className="btn btn-primary">
            {t('lab.loginGoogle')}
          </button>
        </div>
      )}
    </div>
  );
}

export default function LabPost() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [interacoes, setInteracoes] = useState({ likes: 0, compartilhamentos: 0, userLiked: false });
  const [comentarios, setComentarios] = useState([]);
  const [user, setUser] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState('');

  // Framer Motion Scroll Progress Indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        await api.post('/users/google-login', { token: codeResponse.code });
        window.dispatchEvent(new Event('authChange'));
        showToast(t('lab.loginSuccess'));
      } catch (error) {
        alert(t('lab.loginError'));
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
        likes: status === 'adicionado' ? prev.likes + 1 : Math.max(0, prev.likes - 1),
        userLiked: status === 'adicionado'
      }));

      if (status === 'adicionado') {
        showToast(t('lab.likeThanks'));
      }
    } catch (e) { 
      alert(t('lab.likeError')); 
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
          console.error("Erro no compartilhamento:", error);
        }
      }
    } else {
      navigator.clipboard.writeText(url);
      showToast(t('lab.copied'));
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
    showToast(t('lab.commentSent'));
  };

  const calculateReadTime = (content: string) => {
    if (!content) return t('lab.readTime', { minutes: 3 });
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return t('lab.readTime', { minutes: minutes || 2 });
  };

  if (!post) {
    return (
      <div className="blog-container post-loading-container">
        <BlogLoader
          title={t('lab.opening')}
          message={t('lab.openingMessage')}
        />
      </div>
    );
  }

  return (
    <>
      {/* BARRA DE PROGRESSO DE LEITURA (TOPO) */}
      <motion.div className="reading-progress-bar" style={{ scaleX }} />

      {/* TOAST DE FEEDBACK */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            className="ksi-toast"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <Check size={18} color="#10b981" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="blog-container post-detail-wrapper">
        <Helmet>
          <title>{post.titulo} | KSI LAB</title>
          <link rel="canonical" href={`https://kineticsolutions.com.br/lab/${slug}`} />
          <meta name="description" content={post.descricao} />
          {post.keywords && <meta name="keywords" content={post.keywords} />}

          {/* Open Graph */}
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
          <ArrowLeft size={16} /> {t('lab.back')}
        </Link>

        <header className="post-header-meta">
          <span className="post-category post-category--hero">{post.categoria_nome || t('lab.fallbackCategory')}</span>
          <h1 className="blog-title post-title">{post.titulo}</h1>
          
          <div className="post-meta-info">
            <div className="post-byline">
              <span><User size={16} /> {post.autor_nome || t('lab.team')}</span>
              <span><Clock size={16} /> {new Date(post.data_publicacao).toLocaleDateString(i18n.resolvedLanguage || 'pt-BR')} • {calculateReadTime(post.conteudo)}</span>
              <span><Eye size={16} /> {post.visualizacoes || 0} {t('lab.views')}</span>
            </div>

            <div className="post-action-row">
              <button 
                onClick={handleLike} 
                className={`post-action-btn ${interacoes.userLiked ? 'is-active' : ''}`} 
                aria-label={t('lab.like')}
              >
                <ThumbsUp size={16} fill={interacoes.userLiked ? '#fff' : 'none'} /> {interacoes.likes}
              </button>
              <button 
                onClick={handleShare} 
                className="post-action-btn" 
                aria-label={t('lab.share')}
              >
                <Share2 size={16} /> {t('lab.shareAction')}
              </button>
            </div>
          </div>
        </header>

        {post.imagem_capa && (
          <img src={post.imagem_capa} alt={post.titulo} className="main-post-image" />
        )}

        <article 
          className="ksi-article-body" 
          dangerouslySetInnerHTML={{ __html: post.conteudo.replace(/&nbsp;/g, ' ') }} 
        />

        <hr className="post-divider" />

        {/* SEÇÃO DE COMENTÁRIOS */}
        <section id="comentarios" className="comments-section">
          <h3 className="comments-title">
            <MessageSquare size={24} color="var(--accent-color)" /> {t('lab.comments', { count: comentarios.length })}
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
                    <time>{new Date(c.data).toLocaleDateString(i18n.resolvedLanguage || 'pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</time>
                  </div>
                  <p>{c.comentario}</p>
                </div>
              </div>
            ))}
            {comentarios.length === 0 && (
              <p className="empty-comments">{t('lab.emptyComments')}</p>
            )}
          </div>
        </section>

      </div>
    </>
  );
}
