import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Clock, User, Search, Sparkles, BookOpen, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import BlogLoader from '../components/BlogLoader';
import '../styles/blog.css';

export default function LabHome() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/blog/posts')
      .then(res => {
        setPosts(res.data.returnObj || res.data);
      })
      .catch(err => console.error("Erro ao buscar posts:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(' de ', '/').replace('. de ', '/');
  };

  const calculateReadTime = (content: string) => {
    if (!content) return '3 min';
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes || 2} min`;
  };

  // Categorias únicas extraídas dos posts
  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach(p => {
      if (p.categoria_nome) cats.add(p.categoria_nome);
    });
    return Array.from(cats);
  }, [posts]);

  // Filtragem dos posts
  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const matchesCategory = selectedCategory === 'todas' || p.categoria_nome === selectedCategory;
      const matchesSearch = !searchQuery.trim() || 
                            p.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.descricao?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.keywords?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const regularPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return (
    <div className="blog-container">
      <Helmet>
        <title>KSI LAB | Laboratório de Inovações & Pesquisa Tech</title>
        <meta name="description" content="Artigos técnicos, pesquisas em inteligência artificial, engenharia de software e tendências digitais pela Kinetic Solutions." />
        <link rel="canonical" href="https://kineticsolutions.com.br/lab" />
      </Helmet>

      {/* CABEÇALHO DO LAB */}
      <div className="blog-hero-copy">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(0, 64, 128, 0.08)', border: '1px solid rgba(0, 64, 128, 0.15)', marginBottom: '14px' }}>
          <Sparkles size={14} color="var(--accent-color)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-color)', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>
            RESEARCH & DEVELOPMENT
          </span>
        </div>
        <h1 className="blog-title">KSI <span className="text-blue">LAB</span></h1>
        <p className="blog-subtitle">Inovações, pesquisas avançadas e o futuro do desenvolvimento.</p>
      </div>

      {/* BARRA DE CONTROLE: BUSCA E FILTRO DE CATEGORIAS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div className="lab-search-container" style={{ margin: 0 }}>
          <Search size={18} className="lab-search-icon" />
          <input 
            type="text" 
            placeholder="Pesquisar artigos, temas ou tecnologias..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="lab-search-input"
          />
        </div>

        {/* Pílulas de Categoria */}
        {categories.length > 0 && (
          <div className="category-filter-bar" style={{ margin: 0, paddingBottom: 0 }}>
            <button 
              onClick={() => setSelectedCategory('todas')}
              className={`category-pill ${selectedCategory === 'todas' ? 'active' : ''}`}
            >
              Todos ({posts.length})
            </button>
            {categories.map((cat, i) => (
              <button 
                key={i}
                onClick={() => setSelectedCategory(cat)}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <BlogLoader
          title="Preparando o Lab"
          message="Estamos buscando os artigos e organizando as ideias para você."
        />
      ) : filteredPosts.length === 0 ? (
        <div className="blog-feedback-state blog-feedback-state--empty">
          <BookOpen size={40} style={{ margin: '0 auto 14px', opacity: 0.5, color: 'var(--accent-color)' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', color: 'var(--text-primary)' }}>Nenhum artigo encontrado</h3>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            {searchQuery ? `Não encontramos publicações para "${searchQuery}". Tente outros termos.` : 'Nenhum artigo publicado nesta categoria no momento.'}
          </p>
        </div>
      ) : (
        <>
          {/* Post de Destaque (Featured Hero) */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link to={`/lab/${featuredPost.slug}`} className="featured-post-card">
                <div className="featured-post-image">
                  <img src={featuredPost.imagem_capa || '/banner-kinetic-solutions-16-9.png'} alt={featuredPost.titulo} />
                </div>
                
                <div className="featured-post-content">
                  <div className="featured-post-meta">
                    <span className="post-category">{featuredPost.categoria_nome || 'Inovação'}</span>
                    <span className="post-meta-tag">
                      <Clock size={14} /> {formatDate(featuredPost.data_publicacao)} • {calculateReadTime(featuredPost.conteudo)}
                    </span>
                  </div>
                  
                  <h2 className="featured-post-title">{featuredPost.titulo}</h2>
                  <p className="featured-post-desc">
                    {featuredPost.descricao || 'Clique para ler este artigo completo no nosso laboratório de inovações...'}
                  </p>
                  
                  <div className="featured-post-footer">
                    <span className="post-meta-tag">
                      <User size={14} /> {featuredPost.autor_nome || 'Equipe KSI'}
                    </span>
                    <span className="read-more-link">
                      Ler artigo completo <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Grid de Demais Posts */}
          {regularPosts.length > 0 && (
            <div className="posts-grid">
              {regularPosts.map((post: any, idx: number) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07, duration: 0.35 }}
                >
                  <Link to={`/lab/${post.slug}`} className="post-card">
                    <div className="post-cover-wrapper">
                      <img src={post.imagem_capa || '/banner-kinetic-solutions-16-9.png'} alt={post.titulo} className="post-cover-img" loading="lazy" />
                    </div>

                    <div className="post-content-preview">
                      <div className="post-card-meta">
                        <span className="post-category">{post.categoria_nome || 'Tech'}</span>
                        <span className="post-meta-tag">
                          {formatDate(post.data_publicacao)}
                        </span>
                      </div>

                      <h3 className="post-card-title">{post.titulo}</h3>
                      <p className="post-description">
                        {post.descricao || 'Clique para ler este artigo completo no laboratório de inovações...'}
                      </p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {calculateReadTime(post.conteudo)}
                        </span>
                        <span className="read-more-link">
                          Ler artigo <ArrowRight size={15} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
