import { useEffect, useState } from 'react';
import { Plus, Trash2, Tag, Edit, Check, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  ProjectTag, 
  fetchProjectTags, 
  saveProjectTag, 
  deleteProjectTag,
  slugify 
} from '../../services/projectTaxonomy';

const PRESET_COLORS = [
  '#38bdf8', // Ciano
  '#3b82f6', // Azul
  '#6366f1', // Índigo
  '#a855f7', // Roxo
  '#ec4899', // Rosa
  '#f43f5e', // Vermelho/Coral
  '#f97316', // Laranja
  '#eab308', // Amarelo
  '#10b981', // Esmeralda
  '#06b6d4', // Teal
  '#ffffff'  // Branco
];

export default function AdminProjectTags() {
  const [tags, setTags] = useState<ProjectTag[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('#38bdf8');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTags = async () => {
    setLoading(true);
    const data = await fetchProjectTags();
    setTags(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(slugify(val));
    }
  };

  const handleEdit = (tag: ProjectTag) => {
    setEditingId(tag.id);
    setName(tag.name);
    setSlug(tag.slug);
    setColor(tag.color || '#38bdf8');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setColor('#38bdf8');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await saveProjectTag({
      id: editingId || undefined,
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      color
    });

    setName('');
    setSlug('');
    setColor('#38bdf8');
    setEditingId(null);
    loadTags();
  };

  const handleDelete = async (id: string | number, tagName: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a tag "${tagName}"?`)) return;
    const updated = await deleteProjectTag(id);
    setTags(updated);
  };

  return (
    <div>
      {/* CABEÇALHO */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, letterSpacing: '0.5px', color: '#fff', margin: 0 }}>
          Tags de <span style={{ color: 'var(--admin-accent)' }}>Tecnologias</span>
        </h1>
        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.92rem', marginTop: '6px', margin: 0 }}>
          Cadastre e gerencie a lista padronizada de tecnologias, frameworks e linguagens para os projetos.
        </p>
      </div>

      {/* FORMULÁRIO DE NOVA / EDITAR TAG */}
      <div className="admin-card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={18} color="var(--admin-accent)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                {editingId ? 'Editar Tag de Tecnologia' : 'Nova Tag de Tecnologia'}
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)' }}>
                {editingId ? 'Atualize as propriedades da tecnologia' : 'Adicione uma nova tecnologia padronizada à biblioteca de cases'}
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

        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto', gap: '18px', alignItems: 'flex-end' }}>
          <div>
            <label className="admin-label">Nome da Tag / Tecnologia *</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => handleNameChange(e.target.value)} 
              placeholder="Ex: React, Next.js, Python, AWS..."
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
              placeholder="react"
              className="admin-input" 
              style={{ fontFamily: 'monospace', color: 'var(--admin-accent)' }}
              required 
            />
          </div>

          <div>
            <label className="admin-label">Cor de Destaque</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)} 
                style={{ width: '42px', height: '42px', borderRadius: '8px', border: '1px solid var(--admin-card-border)', background: 'transparent', cursor: 'pointer', padding: 0 }}
              />
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '180px' }}>
                {PRESET_COLORS.slice(0, 6).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{ width: '18px', height: '18px', borderRadius: '50%', background: c, border: color === c ? '2px solid #fff' : 'none', cursor: 'pointer' }}
                  />
                ))}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', height: '46px', padding: '0 24px', whiteSpace: 'nowrap', background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', border: 'none' }}
          >
            {editingId ? <Check size={18} /> : <Plus size={18} />} {editingId ? 'Atualizar' : 'Salvar Tag'}
          </button>
        </form>
      </div>

      {/* GRADE DE TAGS EXISTENTES */}
      <div className="admin-card">
        <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Biblioteca de Tags Padronizadas ({tags.length})
        </h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {tags.map((t) => (
            <div
              key={t.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 14px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--admin-card-border)',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.color || 'var(--admin-accent)', boxShadow: `0 0 8px ${t.color || 'var(--admin-accent)'}` }} />
              
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                {t.name}
              </span>
              
              <span style={{ color: 'var(--admin-text-dim)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                #{t.slug}
              </span>

              <div style={{ display: 'flex', gap: '4px', marginLeft: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleEdit(t)}
                  className="action-icon-btn edit"
                  title="Editar Tag"
                  style={{ width: '28px', height: '28px' }}
                >
                  <Edit size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id, t.name)}
                  className="action-icon-btn delete"
                  title="Excluir Tag"
                  style={{ width: '28px', height: '28px' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}

          {tags.length === 0 && !loading && (
            <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.9rem', margin: '16px 0' }}>
              Nenhuma tag de tecnologia cadastrada ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
