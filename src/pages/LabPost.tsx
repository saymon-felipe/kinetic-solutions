import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import '../styles/blog.css';

export default function LabPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    api.get(`/blog/posts/${slug}`)
      .then(res => setPost(res.data.returnObj))
      .catch(() => window.location.href = '/lab');
  }, [slug]);

  if (!post) return <div className="blog-container text-center">Carregando conteúdo...</div>;

  return (
    <div className="container post-detail-wrapper">
      <Helmet>
        <title>{post.titulo} | KSI LAB</title>
        <meta name="description" content={post.descricao} />
      </Helmet>

      <Link to="/lab" className="text-blue" style={{ textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        ← Voltar para o Lab
      </Link>

      <header className="post-header-meta">
        <h1 className="blog-title">{post.titulo}</h1>
        <div className="post-meta-info">
          <span className="text-blue">KSI Tech Team</span>
          <span>•</span>
          <span>{new Date(post.data_publicacao).toLocaleDateString('pt-BR')}</span>
          <span>•</span>
          <span>{post.visualizacoes} visualizações</span>
        </div>
      </header>

      <article 
        className="ksi-article-body"
        dangerouslySetInnerHTML={{ __html: post.conteudo }}
      />
    </div>
  );
}