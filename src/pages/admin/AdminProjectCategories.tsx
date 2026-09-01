import { useEffect, useState } from 'react';
import { Plus, Trash2, Layers, Tag, Edit, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  ProjectCategory, 
  fetchProjectCategories, 
  saveProjectCategory, 
  deleteProjectCategory,
  slugify 
} from '../../services/projectTaxonomy';

export default function AdminProjectCategories() {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    setLoading(true);
    const data = await fetchProjectCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(slugify(val));
    }
  };

  const handleEdit = (cat: ProjectCategory) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await saveProjectCategory({
      id: editingId || undefined,
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      description: description.trim()
    });

    setName('');
    setSlug('');
    setDescription('');
    setEditingId(null);
    loadCategories();
  };

  const handleDelete = async (id: string | number, catName: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a categoria de projetos "${catName}"?`)) return;
    const updated = await deleteProjectCategory(id);
    setCategories(updated);
  };

  return (
    <div>
      {/* CABEÇALHO */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, letterSpacing: '0.5px', color: '#fff', margin: 0 }}>
          Categorias de <span style={{ color: 'var(--admin-accent)' }}>Projetos</span>
        </h1>
        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.92rem', marginTop: '6px', margin: 0 }}>
          Padronize e organize as áreas de atuação e tipos de cases exibidos no portfólio.
        </p>
      </div>

      {/* FORMULÁRIO DE NOVA / EDITAR CATEGORIA */}
      <div className="admin-card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={18} color="var(--admin-accent)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                {editingId ? 'Editar Categoria' : 'Nova Categoria de Projetos'}
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)' }}>
                {editingId ? 'Atualize as informações da taxonomia' : 'Cadastre uma classificação padronizada para os cases'}
              </span>
            </div>
          </div>

          {editingId && (
            <button 
              type="button" 
              onClick={handleCancelEdit} 
              className="btn" 
              style={{ background: 'transparent', border: '1px solid var(--admin-card-border)', color: 'var(--admin-text-muted)', fontSize: '0.8rem', padding: '6px 14px' }}
            >
              Cancelar Edição
            </button>
          )}
        </div>

        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr)) auto', gap: '18px', alignItems: 'flex-end' }}>
          <div>
            <label className="admin-label">Nome da Categoria *</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => handleNameChange(e.target.value)} 
              placeholder="Ex: Plataformas Web, Cloud & DevOps..."
              className="admin-input" 
              required 
            />
          </div>

          <div>
            <label className="admin-label">Slug (Identificador)</label>
            <input 
              type="text" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)} 
              placeholder="plataformas-web"
              className="admin-input" 
              style={{ fontFamily: 'monospace', color: 'var(--admin-accent)' }}
              required 
            />
          </div>

          <div>
            <label className="admin-label">Descrição (Opcional)</label>
            <input 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Breve resumo da área de atuação..."
              className="admin-input" 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', height: '46px', padding: '0 24px', whiteSpace: 'nowrap', background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', border: 'none' }}
          >
            {editingId ? <Check size={18} /> : <Plus size={18} />} {editingId ? 'Atualizar' : 'Salvar Categoria'}
          </button>
        </form>
      </div>

      {/* TABELA DE CATEGORIAS */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '24px' }}>Categoria</th>
                <th>Slug (URL)</th>
                <th>Descrição</th>
                <th style={{ textAlign: 'right', paddingRight: '24px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td style={{ paddingLeft: '24px' }}>
                    <span className="category-badge" style={{ fontSize: '0.84rem', padding: '6px 14px' }}>
                      {cat.name}
                    </span>
                  </td>
                  <td style={{ color: 'var(--admin-text-muted)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    /{cat.slug}
                  </td>
                  <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', maxWidth: '350px' }}>
                    {cat.description || <span style={{ color: 'var(--admin-text-dim)', fontStyle: 'italic' }}>Sem descrição</span>}
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleEdit(cat)} 
                        className="action-icon-btn edit" 
                        title="Editar Categoria"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id, cat.name)} 
                        className="action-icon-btn delete" 
                        title="Excluir Categoria"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--admin-text-dim)' }}>
                    <Layers size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>Nenhuma categoria de projeto cadastrada.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
