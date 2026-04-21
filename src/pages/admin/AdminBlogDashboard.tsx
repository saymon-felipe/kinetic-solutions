import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../services/api';

export default function AdminBlogDashboard() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const loadPosts = () => {
    api.get('/blog/admin/posts')
      .then(res => setPosts(res.data.returnObj || res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este artigo?")) return;
    try {
      await api.delete(`/blog/posts/${id}`);
      loadPosts();
    } catch (err) {
      alert("Erro ao excluir post.");
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 className="blog-title" style={{ fontSize: '2.5rem' }}>Gestão do LAB</h1>
          <p className="blog-subtitle">Gerencie seus artigos e rascunhos.</p>
        </div>
        <Link to="/admin/blog/new" className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Plus size={20} /> Novo Artigo
        </Link>
      </div>

      <div className="admin-card" style={{ padding: '24px' }}>
        <div className="table-responsive">
          <table className="admin-table" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post: any) => (
                <tr key={post.id} style={{ borderTop: '1px solid #27272a' }}>
                  <td style={{ fontWeight: 'bold', padding: '16px 0' }}>{post.titulo}</td>
                  <td style={{ color: '#a1a1aa' }}>{post.categoria_nome}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                      background: post.status === 'publicado' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: post.status === 'publicado' ? '#10b981' : '#f59e0b'
                    }}>
                      {post.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: '12px', padding: '16px 0' }}>
                    <button onClick={() => navigate(`/admin/blog/edit/${post.id}`)} className="icon-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <Edit size={18} color="#3b82f6" />
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="icon-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={18} color="#ef4444" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}