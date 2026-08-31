import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Plus, Trash2, Tag, List, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import KsiLoader from '../../components/KsiLoader';

export default function AdminBlogCategories() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(true);

  const carregarCategorias = () => {
    setLoading(true);
    api.get('/blog/categorias')
      .then(res => setCategorias(res.data.returnObj || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoNome = e.target.value;
    setNome(novoNome);
    
    const novoSlug = novoNome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    setSlug(novoSlug);
  };

  const criarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !slug.trim()) return;

    try {
      await api.post('/blog/categorias', { nome, slug });
      setNome('');
      setSlug('');
      carregarCategorias();
    } catch (error) {
      console.error("Erro ao criar categoria", error);
      alert("Erro ao criar categoria. Verifique se o slug já existe no sistema.");
    }
  };

  const deletarCategoria = async (id: number, catNome: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a categoria "${catNome}"?`)) return;
    
    try {
      await api.delete(`/blog/categorias/${id}`);
      carregarCategorias();
    } catch (error) {
      console.error("Erro ao deletar categoria", error);
      alert("Erro ao excluir. Verifique se existem posts vinculados a esta categoria antes de excluí-la.");
    }
  };

  return (
    <div>
      {/* CABEÇALHO */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, letterSpacing: '0.5px', color: '#fff', margin: 0 }}>
          Categorias do <span style={{ color: 'var(--admin-accent)' }}>KSI LAB</span>
        </h1>
        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.92rem', marginTop: '6px', margin: 0 }}>
          Organize e classifique as linhas editoriais de pesquisa e inovação.
        </p>
      </div>

      {/* FORMULÁRIO DE NOVA CATEGORIA */}
      <div className="admin-card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={18} color="var(--admin-accent)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>Nova Categoria</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)' }}>Adicione uma nova taxonomia para filtrar artigos</span>
          </div>
        </div>

        <form onSubmit={criarCategoria} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr)) auto', gap: '18px', alignItems: 'flex-end' }}>
          <div>
            <label className="admin-label">Nome da Categoria</label>
            <input 
              type="text" 
              value={nome} 
              onChange={handleNomeChange} 
              placeholder="Ex: Inteligência Artificial, Cloud, UI/UX..."
              className="admin-input" 
              required 
            />
          </div>

          <div>
            <label className="admin-label">Slug (URL Amigável)</label>
            <input 
              type="text" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)} 
              placeholder="inteligencia-artificial"
              className="admin-input" 
              style={{ fontFamily: 'monospace', color: 'var(--admin-accent) !important' }}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', height: '46px', padding: '0 24px', whiteSpace: 'nowrap', background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', border: 'none' }}
          >
            <Plus size={18} /> Salvar Categoria
          </button>
        </form>
      </div>

      {/* TABELA DE CATEGORIAS */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <KsiLoader
            kicker="CATEGORIAS"
            title="Carregando Categorias"
            message="Buscando taxonomia e estrutura de tópicos..."
            theme="dark"
            minHeight="280px"
          />
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: '24px', width: '80px' }}>ID</th>
                  <th>Nome da Categoria</th>
                  <th>Identificador (Slug)</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((cat: any) => (
                  <tr key={cat.id}>
                    <td style={{ paddingLeft: '24px', color: 'var(--admin-text-dim)', fontWeight: 800 }}>
                      #{cat.id}
                    </td>
                    <td>
                      <span className="category-badge" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                        {cat.nome}
                      </span>
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      /{cat.slug}
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                      <button 
                        onClick={() => deletarCategoria(cat.id, cat.nome)} 
                        className="action-icon-btn delete" 
                        title="Excluir Categoria"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {categorias.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--admin-text-dim)' }}>
                      <Layers size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                      <p style={{ margin: 0, fontSize: '0.95rem' }}>Nenhuma categoria cadastrada ainda.</p>
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