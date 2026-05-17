import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Clock, User } from 'lucide-react';
import api from '../services/api';
import BlogLoader from '../components/BlogLoader';
import '../styles/blog.css';

export default function LabHome() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blog/posts')
      .then(res => {
        setPosts(res.data.returnObj || res.data);
      })
      .catch(err => console.error("Erro ao buscar posts:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(' de ', '/').replace('. de ', '/');
  };

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const regularPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="blog-container">
      <Helmet>
        <title>KSI LAB | Laboratório de Inovações</title>
        <meta name="description" content="Inovações, pesquisas e o futuro do desenvolvimento." />
        <link rel="canonical" href="https://kineticsolutions.com.br/lab" />
      </Helmet>

      <div className="blog-hero-copy">
        <h1 className="blog-title">KSI <span className="text-blue">LAB</span></h1>
        <p className="blog-subtitle">Inovações, pesquisas e o futuro do desenvolvimento.</p>
      </div>

      {loading ? (
        <BlogLoader
          title="Preparando o Lab"
          message="Estamos buscando os artigos e organizando as ideias para você."
        />
      ) : posts.length === 0 ? (
        <div className="blog-feedback-state blog-feedback-state--empty">
          Nenhum artigo publicado no momento. Volte em breve!
        </div>
      ) : (
        <>
          {/* Post de Destaque (Notícia Principal) */}
          {featuredPost && (
            <Link to={`/lab/${featuredPost.slug}`} className="featured-post-card">
              <div className="featured-post-image">
                <img src={featuredPost.imagem_capa} alt={featuredPost.titulo} />
              </div>
              
              <div className="featured-post-content">
                <div className="featured-post-meta">
                  <span className="post-category">{featuredPost.categoria_nome}</span>
                  <span className="post-meta-tag">
                    <Clock size={14} /> {formatDate(featuredPost.data_publicacao)}
                  </span>
                </div>
                
                <h2 className="featured-post-title">{featuredPost.titulo}</h2>
                <p className="featured-post-desc">
                  {featuredPost.descricao || 'Clique para ler este artigo completo no nosso laboratório de inovações...'}
                </p>
                
                <div className="featured-post-footer">
                  <span className="post-meta-tag">
                    <User size={14} /> {featuredPost.autor_nome}
                  </span>
                  <span className="read-more-link">
                    Ler artigo <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Grid de Posts Anteriores */}
          {regularPosts.length > 0 && (
            <div className="posts-grid">
              {regularPosts.map((post: any) => (
                <Link to={`/lab/${post.slug}`} key={post.id} className="post-card">
                  <div className="post-cover-wrapper">
                    <img src={post.imagem_capa} alt={post.titulo} className="post-cover-img" loading="lazy" />
                  </div>

                  <div className="post-content-preview">
                    <div className="post-card-meta">
                      <span className="post-category">{post.categoria_nome}</span>
                      <span className="post-meta-tag">
                        {formatDate(post.data_publicacao)}
                      </span>
                    </div>

                    <h3 className="post-card-title">{post.titulo}</h3>
                    <p className="post-description">
                      {post.descricao || 'Clique para ler este artigo completo no nosso laboratório de inovações...'}
                    </p>
                    
                    <span className="read-more-link">
                      Ler artigo <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
