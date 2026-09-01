import { ChangeEvent, FormEvent, useEffect, useState, useMemo } from 'react';
import { ArrowLeft, ImagePlus, Save, Globe, Eye, EyeOff, ExternalLink, Tag, X, Sparkles, Layers, Check, Plus, Settings } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import KsiLoader from '../../components/KsiLoader';
import { 
  fetchProjectCategories, 
  fetchProjectTags, 
  ProjectCategory, 
  ProjectTag 
} from '../../services/projectTaxonomy';

type ProjectForm = {
  title: string;
  category: string;
  description: string;
  descriptionEn: string;
  descriptionEs: string;
  link: string;
  tags: string;
  published: boolean;
  image: string;
};

const emptyProject: ProjectForm = {
  title: '',
  category: '',
  description: '',
  descriptionEn: '',
  descriptionEs: '',
  link: '',
  tags: '',
  published: true,
  image: ''
};

export default function AdminProjectForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectForm>(emptyProject);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(editing);
  const [activeLang, setActiveLang] = useState<'pt' | 'en' | 'es'>('pt');
  const [tagInput, setTagInput] = useState('');
  const [availableCategories, setAvailableCategories] = useState<ProjectCategory[]>([]);
  const [availableTags, setAvailableTags] = useState<ProjectTag[]>([]);

  useEffect(() => {
    // Carregar taxonomias padronizadas
    fetchProjectCategories().then(cats => {
      setAvailableCategories(cats);
      if (!id && cats.length > 0) {
        setProject(prev => prev.category ? prev : { ...prev, category: cats[0].name });
      }
    });

    fetchProjectTags().then(tags => {
      setAvailableTags(tags);
    });

    if (!id) return;
    api.get(`/projects/admin/${id}`).then((response) => {
      const data = response.data.returnObj || response.data;
      setProject({
        title: data.title || '',
        category: data.category || '',
        description: data.description || '',
        descriptionEn: data.descriptionEn || '',
        descriptionEs: data.descriptionEs || '',
        link: data.link || '',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
        published: Boolean(data.published),
        image: data.image || ''
      });
    }).catch(() => {
      alert('Projeto não encontrado.');
      navigate('/admin/projetos');
    }).finally(() => setLoading(false));
  }, [id, navigate]);

  const updateField = (field: keyof ProjectForm, value: string | boolean) => {
    setProject((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    setImageFile(file);
    setProject((current) => ({ ...current, image: URL.createObjectURL(file) }));
  };

  // Processamento de Tags
  const parsedTags = useMemo(() => {
    return project.tags
      ? project.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];
  }, [project.tags]);

  const handleAddTag = (newTag: string) => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (parsedTags.includes(trimmed)) {
      setTagInput('');
      return;
    }
    const updated = [...parsedTags, trimmed].join(', ');
    updateField('tags', updated);
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = parsedTags.filter(t => t !== tagToRemove).join(', ');
    updateField('tags', updated);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!project.title.trim() || !project.category.trim() || !project.description.trim()) {
      alert('Título, categoria e descrição em português são obrigatórios.');
      return;
    }

    if (!editing && !imageFile) {
      alert('Envie uma imagem de capa para o projeto.');
      return;
    }

    setSaving(true);
    const payload = new FormData();
    payload.append('title', project.title);
    payload.append('category', project.category);
    payload.append('description', project.description);
    payload.append('descriptionEn', project.descriptionEn);
    payload.append('descriptionEs', project.descriptionEs);
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

  // Descrição para o preview de acordo com o idioma ativo
  const currentPreviewDesc = activeLang === 'en' 
    ? (project.descriptionEn || project.description) 
    : activeLang === 'es' 
      ? (project.descriptionEs || project.description) 
      : project.description;

  return (
    <form onSubmit={handleSubmit}>
      {/* CABEÇALHO DO ESTÚDIO DE PROJETOS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link 
            to="/admin/projetos" 
            className="action-icon-btn" 
            title="Voltar para a lista de projetos"
            style={{ width: '40px', height: '40px' }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: 0 }}>
              {editing ? 'Editar' : 'Novo'} <span style={{ color: 'var(--admin-accent)' }}>Projeto</span>
            </h1>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.84rem', margin: '4px 0 0 0' }}>
              Cadastre e gerencie os cases de sucesso em múltiplos idiomas para o portfólio público.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link 
            to="/admin/projetos" 
            className="btn" 
            style={{ background: 'transparent', border: '1px solid var(--admin-card-border)', color: 'var(--admin-text-muted)', padding: '12px 20px' }}
          >
            Cancelar
          </Link>
          <button 
            type="submit" 
            disabled={saving} 
            className="btn btn-primary" 
            style={{ display: 'inline-flex', gap: '10px', alignItems: 'center', padding: '12px 26px', background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', boxShadow: '0 4px 20px rgba(56, 189, 248, 0.35)', border: 'none' }}
          >
            <Save size={18} /> {saving ? 'Salvando...' : 'Salvar Projeto'}
          </button>
        </div>
      </div>

      {/* LAYOUT EM 2 COLUNAS (STUDIO) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1.1fr)', gap: '28px', alignItems: 'start' }}>
        
        {/* COLUNA ESQUERDA: DADOS PRINCIPAIS, DESCRIÇÕES & TAGS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* CARD: INFORMAÇÕES PRINCIPAIS */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--admin-accent)" /> Informações Gerais
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label className="admin-label">Título do Projeto *</label>
              <input 
                type="text"
                className="admin-input" 
                required 
                placeholder="Ex: Plataforma Omnichannel de Logística"
                value={project.title} 
                onChange={(event) => updateField('title', event.target.value)} 
                style={{ fontSize: '1.15rem', fontWeight: 700, padding: '14px 18px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Categoria *</label>
                  <Link 
                    to="/admin/projetos/categorias" 
                    target="_blank"
                    style={{ fontSize: '0.72rem', color: 'var(--admin-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Settings size={12} /> Gerenciar
                  </Link>
                </div>
                <select 
                  className="admin-select"
                  required
                  value={project.category}
                  onChange={(event) => updateField('category', event.target.value)}
                >
                  <option value="" disabled>Selecione uma categoria padronizada...</option>
                  {/* Se a categoria atual não estiver na lista (legado), exibe-a */}
                  {project.category && !availableCategories.some(c => c.name === project.category) && (
                    <option value={project.category}>{project.category} (Personalizada)</option>
                  )}
                  {availableCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="admin-label">Link Externo / Demonstração</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="url" 
                    className="admin-input" 
                    placeholder="https://exemplo.com.br" 
                    value={project.link} 
                    onChange={(event) => updateField('link', event.target.value)} 
                  />
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="action-icon-btn" 
                      title="Testar link em nova aba"
                      style={{ flexShrink: 0, height: '46px', width: '46px' }}
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CARD: DESCRIÇÃO MULTILÍNGUE (i18n) */}
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} color="var(--admin-accent)" /> Descrição do Projeto
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-dim)' }}>
                {activeLang === 'pt' ? 'Obrigatório' : 'Opcional (fallback em PT)'}
              </span>
            </div>

            {/* ABAS DE IDIOMA */}
            <div className="lang-tab-bar">
              <button 
                type="button" 
                onClick={() => setActiveLang('pt')} 
                className={`lang-tab-item ${activeLang === 'pt' ? 'active' : ''}`}
              >
                🇧🇷 Português {project.description && <Check size={12} color="var(--admin-success)" />}
              </button>
              <button 
                type="button" 
                onClick={() => setActiveLang('en')} 
                className={`lang-tab-item ${activeLang === 'en' ? 'active' : ''}`}
              >
                🇺🇸 English {project.descriptionEn && <Check size={12} color="var(--admin-success)" />}
              </button>
              <button 
                type="button" 
                onClick={() => setActiveLang('es')} 
                className={`lang-tab-item ${activeLang === 'es' ? 'active' : ''}`}
              >
                🇪🇸 Español {project.descriptionEs && <Check size={12} color="var(--admin-success)" />}
              </button>
            </div>

            {/* CONTEÚDO DA ABA SELECIONADA */}
            {activeLang === 'pt' && (
              <div>
                <label className="admin-label">Descrição em Português *</label>
                <textarea 
                  className="admin-textarea" 
                  required 
                  rows={5} 
                  placeholder="Descreva os desafios técnicos, a solução arquitetada e os resultados de negócios gerados..."
                  value={project.description} 
                  onChange={(event) => updateField('description', event.target.value)} 
                />
              </div>
            )}

            {activeLang === 'en' && (
              <div>
                <label className="admin-label">Descrição em Inglês (English)</label>
                <textarea 
                  className="admin-textarea" 
                  rows={5} 
                  placeholder="Describe the engineering challenge, high-performance solution, and core outcomes..."
                  value={project.descriptionEn} 
                  onChange={(event) => updateField('descriptionEn', event.target.value)} 
                />
              </div>
            )}

            {activeLang === 'es' && (
              <div>
                <label className="admin-label">Descrição em Espanhol (Español)</label>
                <textarea 
                  className="admin-textarea" 
                  rows={5} 
                  placeholder="Describe el reto técnico, la arquitectura implementada y el impacto generado..."
                  value={project.descriptionEs} 
                  onChange={(event) => updateField('descriptionEs', event.target.value)} 
                />
              </div>
            )}
          </div>

          {/* CARD: TAGS E TECNOLOGIAS */}
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={18} color="var(--admin-accent)" /> Tecnologias & Tags Padronizadas
              </h3>
              <Link 
                to="/admin/projetos/tags" 
                target="_blank"
                style={{ fontSize: '0.72rem', color: 'var(--admin-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Settings size={12} /> Gerenciar Tags
              </Link>
            </div>

            {/* Tags selecionadas no projeto */}
            <div style={{ marginBottom: '16px' }}>
              <span className="admin-label">Tags Selecionadas no Projeto:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '34px', padding: '10px', background: 'rgba(6, 10, 20, 0.4)', borderRadius: '10px', border: '1px solid var(--admin-card-border)' }}>
                {parsedTags.map((tag, idx) => (
                  <span key={idx} className="tag-badge-pill" style={{ background: 'rgba(56, 189, 248, 0.2)' }}>
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)} 
                      style={{ background: 'transparent', border: 'none', color: 'var(--admin-accent)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                      title="Remover tag"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
                {parsedTags.length === 0 && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-dim)', fontStyle: 'italic', alignSelf: 'center' }}>
                    Clique nas tags abaixo para adicioná-las ao projeto.
                  </span>
                )}
              </div>
            </div>

            {/* Seletor rápido de tags padronizadas disponíveis */}
            {availableTags.length > 0 && (
              <div style={{ marginBottom: '18px' }}>
                <span className="admin-label">Selecione na Biblioteca Padronizada:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {availableTags.map((t) => {
                    const isSelected = parsedTags.includes(t.name);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => isSelected ? handleRemoveTag(t.name) : handleAddTag(t.name)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          border: isSelected ? '1px solid var(--admin-accent)' : '1px solid var(--admin-card-border)',
                          background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                          color: isSelected ? '#fff' : 'var(--admin-text-muted)',
                          fontSize: '0.76rem',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isSelected ? <Check size={12} color="var(--admin-accent)" /> : <Plus size={12} />}
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Inserção rápida de nova tag customizada */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text"
                className="admin-input" 
                placeholder="Adicionar outra tag personalizada..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <button 
                type="button" 
                onClick={() => handleAddTag(tagInput)}
                className="btn"
                style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', color: 'var(--admin-accent)', padding: '0 20px', whiteSpace: 'nowrap' }}
              >
                Adicionar
              </button>
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA: STATUS, UPLOAD DE IMAGEM & LIVE PREVIEW */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* CARD 1: STATUS & VISIBILIDADE */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} color="var(--admin-accent)" /> Visibilidade no Portfólio
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => updateField('published', true)}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: project.published ? '1px solid var(--admin-success)' : '1px solid var(--admin-card-border)',
                  background: project.published ? 'var(--admin-success-bg)' : 'rgba(255,255,255,0.02)',
                  color: project.published ? 'var(--admin-success)' : 'var(--admin-text-muted)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Eye size={15} /> Ativo (Público)
              </button>

              <button
                type="button"
                onClick={() => updateField('published', false)}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: !project.published ? '1px solid var(--admin-warning)' : '1px solid var(--admin-card-border)',
                  background: !project.published ? 'var(--admin-warning-bg)' : 'rgba(255,255,255,0.02)',
                  color: !project.published ? 'var(--admin-warning)' : 'var(--admin-text-muted)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <EyeOff size={15} /> Oculto (Rascunho)
              </button>
            </div>
          </div>

          {/* CARD 2: IMAGEM DO PROJETO */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImagePlus size={18} color="var(--admin-accent)" /> Imagem de Capa {editing ? '(Opcional)' : '*'}
            </h3>

            <label className="project-dropzone">
              {project.image ? (
                <div style={{ width: '100%' }}>
                  <img 
                    src={project.image} 
                    alt="Prévia do projeto" 
                    className="project-preview-image"
                  />
                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '8px', color: 'var(--admin-accent)', fontSize: '0.8rem', fontWeight: 700 }}>
                    <ImagePlus size={16} /> Clique para alterar a imagem
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <ImagePlus size={26} color="var(--admin-accent)" />
                  </div>
                  <strong style={{ color: '#fff', fontSize: '0.92rem' }}>Clique ou arraste uma imagem aqui</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)', marginTop: '4px' }}>
                    Formatos recomendados: 16:9 em PNG, JPG ou WebP
                  </span>
                </>
              )}
              <input 
                type="file" 
                accept="image/*" 
                required={!editing && !project.image} 
                onChange={handleImageChange} 
                style={{ display: 'none' }} 
              />
            </label>
          </div>

          {/* CARD 3: PRÉ-VISUALIZAÇÃO DO CARD DO PORTFÓLIO EM TEMPO REAL */}
          <div className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#f59e0b" /> Prévia do Portfólio
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-dim)' }}>
                {activeLang.toUpperCase()}
              </span>
            </div>

            <div className="portfolio-preview-card">
              {/* Imagem do Mockup */}
              <div style={{ position: 'relative', height: '160px', background: 'rgba(0, 0, 0, 0.5)', overflow: 'hidden' }}>
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt="" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-dim)', fontSize: '0.8rem' }}>
                    Sem imagem de capa
                  </div>
                )}
                <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(10, 16, 32, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(56, 189, 248, 0.3)', color: 'var(--admin-accent)', fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px' }}>
                  {project.category || 'Categoria'}
                </span>
              </div>

              {/* Informações do Mockup */}
              <div style={{ padding: '16px' }}>
                <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, margin: '0 0 6px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {project.title || 'Título do Projeto'}
                </h4>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.78rem', lineHeight: 1.4, margin: '0 0 12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {currentPreviewDesc || 'A descrição detalhada do case aparecerá aqui para os visitantes do site...'}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                  {parsedTags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--admin-text-muted)' }}>
                      {tag}
                    </span>
                  ))}
                  {parsedTags.length > 3 && (
                    <span style={{ fontSize: '0.68rem', padding: '2px 8px', color: 'var(--admin-text-dim)' }}>
                      +{parsedTags.length - 3}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ flex: 1, textAlign: 'center', padding: '6px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontWeight: 700 }}>
                    Ver Detalhes
                  </span>
                  {project.link && (
                    <span style={{ flex: 1, textAlign: 'center', padding: '6px', borderRadius: '6px', background: 'var(--admin-accent)', color: '#000', fontSize: '0.72rem', fontWeight: 800 }}>
                      Visitar Projeto
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </form>
  );
}
