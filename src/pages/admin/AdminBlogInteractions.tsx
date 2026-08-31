import { useEffect, useState } from 'react';
import { Trash2, MessageSquare, User, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import KsiLoader from '../../components/KsiLoader';

export default function AdminBlogInteractions() {
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadComentarios = () => {
    setLoading(true);
    api.get('/blog/admin/comentarios')
      .then(res => setComentarios(res.data.returnObj || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadComentarios();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente apagar este comentário permanentemente?")) return;
    try {
      await api.delete(`/blog/admin/comentarios/${id}`);
      loadComentarios();
    } catch (err) {
      alert("Erro ao excluir comentário.");
    }
  };

  return (
    <div>
      {/* CABEÇALHO */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, letterSpacing: '0.5px', color: '#fff', margin: 0 }}>
          Moderação de <span style={{ color: 'var(--admin-accent)' }}>Interações</span>
        </h1>
        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.92rem', marginTop: '6px', margin: 0 }}>
          Acompanhe, modere e gerencie as discussões da comunidade no KSI Lab.
        </p>
      </div>

      {/* TABELA DE COMENTÁRIOS */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <KsiLoader
            kicker="MODERAÇÃO"
            title="Carregando Interações"
            message="Buscando comentários e discussões da comunidade..."
            theme="dark"
            minHeight="280px"
          />
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: '24px' }}>Autor</th>
                  <th>Comentário</th>
                  <th>Artigo de Origem</th>
                  <th>Data</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {comentarios.map((c: any) => (
                  <tr key={c.id}>
                    {/* Autor */}
                    <td style={{ paddingLeft: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {c.imagem ? (
                          <img 
                            src={c.imagem} 
                            alt="" 
                            style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid var(--admin-card-border)', flexShrink: 0 }} 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <User size={18} color="var(--admin-text-dim)" />
                          </div>
                        )}
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>{c.nome}</p>
                          <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-dim)' }}>{c.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Conteúdo do Comentário */}
                    <td style={{ maxWidth: '350px' }}>
                      <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.5, wordBreak: 'break-word' }}>
                        "{c.comentario}"
                      </p>
                    </td>

                    {/* Post de Origem */}
                    <td>
                      <span className="category-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <MessageSquare size={12} /> {c.post_titulo || 'Artigo'}
                      </span>
                    </td>

                    {/* Data */}
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={13} color="var(--admin-text-dim)" />
                        {new Date(c.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Ação */}
                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                      <button 
                        onClick={() => handleDelete(c.id)} 
                        className="action-icon-btn delete" 
                        title="Excluir Comentário"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {comentarios.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '56px 24px', color: 'var(--admin-text-dim)' }}>
                      <MessageSquare size={38} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                      <p style={{ margin: 0, fontSize: '0.95rem' }}>Nenhum comentário aguardando moderação.</p>
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