import { useEffect, useState } from 'react';
import { Trash2, MessageSquare } from 'lucide-react';
import api from '../../services/api';

export default function AdminBlogInteractions() {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadComentarios = () => {
    api.get('/blog/admin/comentarios')
      .then(res => setComentarios(res.data.returnObj || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadComentarios();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente apagar este comentário?")) return;
    try {
      await api.delete(`/blog/admin/comentarios/${id}`);
      loadComentarios();
    } catch (err) {
      alert("Erro ao excluir comentário.");
    }
  };

  if (loading) return <div style={{ color: '#a1a1aa' }}>Carregando interações...</div>;

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="blog-title" style={{ fontSize: '2.5rem' }}>Interações</h1>
        <p className="blog-subtitle">Modere e gerencie os comentários do KSI Lab.</p>
      </div>

      <div className="admin-card" style={{ padding: '24px' }}>
        <div className="table-responsive">
          <table className="admin-table" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ paddingBottom: '16px' }}>Usuário</th>
                <th style={{ paddingBottom: '16px' }}>Comentário</th>
                <th style={{ paddingBottom: '16px' }}>Post Origem</th>
                <th style={{ paddingBottom: '16px' }}>Data</th>
                <th style={{ paddingBottom: '16px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {comentarios.map((c: any) => (
                <tr key={c.id} style={{ borderTop: '1px solid #27272a' }}>
                  <td style={{ padding: '16px 0', fontWeight: 'bold' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{c.nome}</span>
                      <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>{c.email}</span>
                    </div>
                  </td>
                  <td style={{ color: '#d4d4d8', maxWidth: '300px' }}>{c.comentario}</td>
                  <td style={{ color: '#3b82f6', fontSize: '0.9rem' }}>{c.post_titulo}</td>
                  <td style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
                    {new Date(c.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '16px 0' }}>
                    <button onClick={() => handleDelete(c.id)} className="icon-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={18} color="#ef4444" />
                    </button>
                  </td>
                </tr>
              ))}
              {comentarios.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#a1a1aa' }}>Nenhum comentário registrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}