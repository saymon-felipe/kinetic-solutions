import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, ImagePlus, Save } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import KsiLoader from '../../components/KsiLoader';

type ProjectForm = {
  title: string;
  category: string;
  description: string;
  link: string;
  tags: string;
  published: boolean;
  image: string;
};

const emptyProject: ProjectForm = { title: '', category: '', description: '', link: '', tags: '', published: true, image: '' };

export default function AdminProjectForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectForm>(emptyProject);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(editing);

  useEffect(() => {
    if (!id) return;
    api.get(`/projects/admin/${id}`).then((response) => {
      const data = response.data.returnObj || response.data;
      setProject({
        title: data.title || '', category: data.category || '', description: data.description || '', link: data.link || '',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
        published: Boolean(data.published), image: data.image || ''
      });
    }).catch(() => {
      alert('Projeto não encontrado.');
      navigate('/admin/projetos');
    }).finally(() => setLoading(false));
  }, [id, navigate]);

  const updateField = (field: keyof ProjectForm, value: string | boolean) => setProject((current) => ({ ...current, [field]: value }));

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    setImageFile(file);
    setProject((current) => ({ ...current, image: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing && !imageFile) {
      alert('Envie a imagem do projeto.');
      return;
    }
    setSaving(true);
    const payload = new FormData();
    payload.append('title', project.title);
    payload.append('category', project.category);
    payload.append('description', project.description);
    payload.append('link', project.link);
    payload.append('tags', project.tags);
    payload.append('published', String(project.published));
    if (imageFile) payload.append('image', imageFile);

    try {
      if (editing) await api.put(`/projects/${id}`, payload);
      else await api.post('/projects', payload);
      navigate('/admin/projetos');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Não foi possível salvar o projeto.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <KsiLoader
        kicker="PORTFÓLIO"
        title="Carregando Projeto"
        message="Buscando detalhes e mídias do case..."
        theme="dark"
        minHeight="60vh"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '920px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <Link to="/admin/projetos" className="action-icon-btn" title="Voltar"><ArrowLeft size={18} /></Link>
        <div><h1 style={{ margin: 0, color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>{editing ? 'Editar' : 'Novo'} <span style={{ color: 'var(--admin-accent)' }}>Projeto</span></h1><p style={{ margin: '4px 0 0', color: 'var(--admin-text-muted)' }}>A imagem é otimizada e enviada diretamente ao armazenamento do site.</p></div>
      </div>

      <div className="admin-card" style={{ display: 'grid', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <label><span className="admin-label">Título *</span><input className="admin-input" required value={project.title} onChange={(event) => updateField('title', event.target.value)} /></label>
          <label><span className="admin-label">Categoria *</span><input className="admin-input" required placeholder="Ex.: Plataformas Web" value={project.category} onChange={(event) => updateField('category', event.target.value)} /></label>
        </div>
        <label><span className="admin-label">Descrição *</span><textarea className="admin-textarea" required rows={4} value={project.description} onChange={(event) => updateField('description', event.target.value)} /></label>
        <label><span className="admin-label">Link do projeto</span><input className="admin-input" type="url" placeholder="https://..." value={project.link} onChange={(event) => updateField('link', event.target.value)} /></label>
        <label><span className="admin-label">Tags</span><input className="admin-input" placeholder="Ex.: SaaS, Gestão, Cloud" value={project.tags} onChange={(event) => updateField('tags', event.target.value)} /><small style={{ display: 'block', color: 'var(--admin-text-dim)', marginTop: '8px' }}>Separe as tags por vírgula.</small></label>
        <div>
          <span className="admin-label">Imagem {editing ? '(opcional para manter a atual)' : '*'}</span>
          <label style={{ minHeight: '180px', display: 'grid', placeItems: 'center', overflow: 'hidden', border: '1px dashed rgba(56, 189, 248, 0.5)', borderRadius: '12px', cursor: 'pointer', background: 'rgba(56, 189, 248, 0.04)' }}>
            {project.image ? <img src={project.image} alt="Prévia da imagem do projeto" style={{ width: '100%', maxHeight: '320px', objectFit: 'contain' }} /> : <span style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--admin-text-muted)' }}><ImagePlus size={22} /> Selecionar imagem</span>}
            <input type="file" accept="image/*" required={!editing} onChange={handleImageChange} style={{ display: 'none' }} />
          </label>
        </div>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--admin-text-main)' }}><input type="checkbox" checked={project.published} onChange={(event) => updateField('published', event.target.checked)} /> Exibir este projeto no site</label>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}><Link to="/admin/projetos" className="btn" style={{ padding: '12px 20px' }}>Cancelar</Link><button className="btn btn-primary" disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}><Save size={17} /> {saving ? 'Salvando...' : 'Salvar projeto'}</button></div>
      </div>
    </form>
  );
}
