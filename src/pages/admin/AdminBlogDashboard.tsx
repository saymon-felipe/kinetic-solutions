import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, ThumbsUp, MessageSquare, Share2, Search, ExternalLink, Sparkles, Filter, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import KsiLoader from '../../components/KsiLoader';

export default function AdminBlogDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const navigate = useNavigate();

  const loadPosts = () => {
    setLoading(true);
    api.get('/blog/admin/posts')
      .then(res => setPosts(res.data.returnObj || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Deseja realmente excluir o artigo "${title}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await api.delete(`/blog/posts/${id}`);
      loadPosts();
    } catch (err) {
      alert("Erro ao excluir post.");
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchSearch = post.titulo?.toLowerCase().includes(search.toLowerCase()) || 
                          post.categoria_nome?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'todos' || post.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [posts, search, statusFilter]);

  return (
    <div>
      {/* CABEÇALHO DA GESTÃO DE ARTIGOS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, letterSpacing: '0.5px', color: '#fff', margin: 0 }}>
            KSI LAB <span style={{ color: 'var(--admin-accent)' }}>Artigos</span>
          </h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.92rem', marginTop: '6px', margin: 0 }}>
            Gerencie publicações, acompanhe métricas de audiência e crie conteúdos com IA.
          </p>
        </div>

        <Link to="/admin/blog/new" className="btn btn-primary" style={{ display: 'inline-flex', gap: '10px', alignItems: 'center', padding: '12px 24px', background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', boxShadow: '0 4px 20px rgba(56, 189, 248, 0.3)', border: 'none' }}>
          <Plus size={18} /> Novo Artigo
        </Link>
      </div>

      {/* BARRA DE FILTROS & BUSCA */}
      <div className="admin-card" style={{ padding: '18px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: '1 1 320px', maxWidth: '420px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-dim)', pointerEvents: 'none', zIndex: 2 }} />
          <input 
            type="text"
            placeholder="Buscar por título ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input admin-search-input"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', fontWeight: 700, marginRight: '4px' }}>
            Status:
          </span>
          <button 
            onClick={() => setStatusFilter('todos')} 
            className={`ai-preset-chip ${statusFilter === 'todos' ? 'active' : ''}`}
            style={{ background: statusFilter === 'todos' ? 'var(--admin-accent)' : undefined, color: statusFilter === 'todos' ? '#fff' : undefined }}
          >
            Todos ({posts.length})
          </button>
          <button 
            onClick={() => setStatusFilter('publicado')} 
            className={`ai-preset-chip ${statusFilter === 'publicado' ? 'active' : ''}`}
            style={{ background: statusFilter === 'publicado' ? 'var(--admin-success)' : undefined, color: statusFilter === 'publicado' ? '#fff' : undefined }}
          >
            Publicados
          </button>
          <button 
            onClick={() => setStatusFilter('rascunho')} 
            className={`ai-preset-chip ${statusFilter === 'rascunho' ? 'active' : ''}`}
            style={{ background: statusFilter === 'rascunho' ? 'var(--admin-warning)' : undefined, color: statusFilter === 'rascunho' ? '#fff' : undefined }}
          >
            Rascunhos
          </button>
        </div>
      </div>

      {/* TABELA DE ARTIGOS */}
      <div className="admin-card" style={{ padding: '0px', overflow: 'hidden' }}>
        {loading ? (
          <KsiLoader
            kicker="KSI LAB"
            title="Carregando Artigos"
            message="Buscando artigos publicados, rascunhos e métricas..."
            theme="dark"
            minHeight="380px"
          />
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: '24px' }}>Artigo</th>
                  <th>Categoria</th>
                  <th style={{ textAlign: 'center' }} title="Visualizações"><Eye size={16} style={{ margin: '0 auto', color: 'var(--admin-accent)' }} /></th>
                  <th style={{ textAlign: 'center' }} title="Curtidas"><ThumbsUp size={16} style={{ margin: '0 auto', color: 'var(--admin-success)' }} /></th>
                  <th style={{ textAlign: 'center' }} title="Comentários"><MessageSquare size={16} style={{ margin: '0 auto', color: 'var(--admin-warning)' }} /></th>
                  <th style={{ textAlign: 'center' }} title="Compartilhamentos"><Share2 size={16} style={{ margin: '0 auto', color: 'var(--admin-purple)' }} /></th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post: any) => (
                  <tr key={post.id}>
                    {/* Artigo Cover + Título */}
                    <td style={{ paddingLeft: '24px', paddingRight: '16px', maxWidth: '320px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {post.imagem_capa ? (
                          <img 
                            src={post.imagem_capa} 
                            alt="" 
                            style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--admin-card-border)', flexShrink: 0 }} 
                          />
                        ) : (
                          <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--admin-card-border)', flexShrink: 0 }}>
                            <FileText size={20} color="var(--admin-text-dim)" />
                          </div>
                        )}
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {post.titulo}
                          </p>
                          <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-dim)', fontFamily: 'monospace' }}>
                            /{post.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Categoria */}
                    <td>
                      <span className="category-badge">
                        {post.categoria_nome || 'Sem Categoria'}
                      </span>
                    </td>

                    {/* Métricas */}
                    <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--admin-accent)' }}>
                      {post.visualizacoes || 0}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--admin-success)' }}>
                      {post.likes_count || 0}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--admin-warning)' }}>
                      {post.comentarios_count || 0}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--admin-purple)' }}>
                      {post.compartilhamentos || 0}
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`status-pill ${post.status === 'publicado' ? 'publicado' : 'rascunho'}`}>
                        {post.status === 'publicado' ? '● Publicado' : '○ Rascunho'}
                      </span>
                    </td>

                    {/* Ações */}
                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                      <div className="action-btn-group" style={{ justifyContent: 'flex-end' }}>
                        <a 
                          href={`/lab/${post.slug}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="action-icon-btn view" 
                          title="Visualizar no KSI Lab"
                        >
                          <ExternalLink size={15} />
                        </a>
                        <button 
                          onClick={() => navigate(`/admin/blog/edit/${post.id}`)} 
                          className="action-icon-btn edit" 
                          title="Editar Artigo"
                        >
                          <Edit size={15} />
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id, post.titulo)} 
                          className="action-icon-btn delete" 
                          title="Excluir Artigo"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPosts.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: '64px 24px', textAlign: 'center' }}>
                      <FileText size={42} style={{ color: 'var(--admin-text-dim)', margin: '0 auto 16px', opacity: 0.4 }} />
                      <p style={{ color: 'var(--admin-text-muted)', fontSize: '1rem', margin: '0 0 16px 0' }}>
                        {search ? 'Nenhum artigo encontrado para esta busca.' : 'Nenhum artigo cadastrado ainda.'}
                      </p>
                      <Link to="/admin/blog/new" className="btn btn-primary" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                        <Plus size={16} /> Criar Primeiro Artigo
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}