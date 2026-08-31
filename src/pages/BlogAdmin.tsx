import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { 
  Sparkles, Save, ArrowLeft, Globe, Lock, Calendar, Tag, 
  ExternalLink, Copy, Check, Info, Image as ImageIcon, Search, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import '../styles/admin.css';

export default function BlogAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef<any>(null);
  
  const [post, setPost] = useState({
    titulo: '', 
    slug: '', 
    descricao: '', 
    keywords: '',
    conteudo: '', 
    status: 'rascunho', 
    categoria_id: 1, 
    imagem_capa: '',
    data_publicacao: '', 
    data_pausa: ''
  });
  
  const [categorias, setCategorias] = useState<any[]>([]);
  const [prompt, setPrompt] = useState('');
  const [loadingIA, setLoadingIA] = useState(false);
  const [iaStep, setIaStep] = useState('');
  const [saving, setSaving] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(false);

  useEffect(() => {
    api.get('/blog/categorias')
      .then(res => {
        const cats = res.data.returnObj || res.data;
        setCategorias(cats);
        if (cats.length > 0 && !id) {
          setPost(prev => ({ ...prev, categoria_id: cats[0].id }));
        }
      })
      .catch(err => console.error("Erro ao buscar categorias:", err));

    if (id) {
      api.get(`/blog/posts/id/${id}`).then(res => {
        const data = res.data.returnObj || res.data;
        const formatForInput = (d: string) => d ? new Date(d).toISOString().slice(0, 16) : '';
        setPost({
          ...data,
          data_publicacao: formatForInput(data.data_publicacao),
          data_pausa: formatForInput(data.data_pausa)
        });
      });
    }
  }, [id]);

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleTitleChange = (val: string) => {
    setPost(prev => ({ ...prev, titulo: val, slug: generateSlug(val) }));
  };

  const handleCopySlug = () => {
    navigator.clipboard.writeText(`https://kineticsolutions.com.br/lab/${post.slug}`);
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  const handleSave = async () => {
    if (!post.titulo || !post.conteudo) {
      alert("Título e conteúdo do artigo são obrigatórios.");
      return;
    }

    setSaving(true);
    try {
      const payload = { 
        ...post, 
        data_publicacao: post.data_publicacao ? post.data_publicacao.replace('T', ' ') + ':00' : new Date().toISOString().slice(0, 19).replace('T', ' '),
        data_pausa: post.data_pausa ? post.data_pausa.replace('T', ' ') + ':00' : null
      };

      if (id) {
        await api.put(`/blog/posts/${id}`, payload);
      } else {
        await api.post('/blog/posts', payload);
      }
      navigate('/admin/blog');
    } catch (err) { 
      console.error(err);
      alert('Erro ao salvar publicação. Verifique a conexão.'); 
    } finally {
      setSaving(false);
    }
  };

  const setPromptPreset = (presetText: string) => {
    setPrompt(presetText);
  };

  const gerarComIA = async () => {
    if (!prompt.trim()) return;
    
    setLoadingIA(true);
    setIaStep('Enviando briefing para o Copilot...');
    
    try {
      const startRes = await api.post('/blog/ai-copywriter', { prompt });
      const jobId = startRes.data.returnObj?.jobId || startRes.data?.jobId;

      setIaStep('IA analisando referências e estruturando tópicos...');

      const checarStatus = setInterval(async () => {
        try {
          const statusRes = await api.get(`/blog/ai-copywriter/status/${jobId}`);
          const jobData = statusRes.data.returnObj || statusRes.data;

          if (jobData && jobData.status === 'processing') {
            setIaStep('Redigindo e formatando conteúdo completo...');
            return; 
          }

          clearInterval(checarStatus);

          let rawData = jobData;
          let loopCount = 0;
          
          while (typeof rawData === 'string' && loopCount < 5) {
              rawData = rawData.replace(/```json\n?|```/g, '').trim();
              try {
                  rawData = JSON.parse(rawData);
              } catch(e) {
                  break; 
              }
              loopCount++;
          }

          const resultObj = (typeof rawData === 'object' && rawData !== null) ? rawData : {};

          const normalizedObj: any = {};
          Object.keys(resultObj).forEach(key => {
              const cleanKey = key.toLowerCase().trim();
              normalizedObj[cleanKey] = resultObj[key];
          });

          const novoTitulo = normalizedObj['titulo'] || normalizedObj['title'] || '';
          const novaDescricao = normalizedObj['descricao'] || normalizedObj['description'] || '';
          const novoKeywords = normalizedObj['keywords'] || '';
          const novoConteudo = (normalizedObj['conteudo'] || normalizedObj['content'] || '').replace(/&nbsp;/g, ' ');
          
          setPost(prev => ({ 
            ...prev, 
            titulo: novoTitulo || prev.titulo,
            slug: novoTitulo ? generateSlug(novoTitulo) : prev.slug,
            descricao: novaDescricao || prev.descricao, 
            keywords: novoKeywords || prev.keywords,
            conteudo: prev.conteudo + (prev.conteudo ? '<br/><br/>' : '') + (novoConteudo || '')
          }));
          
          setPrompt('');
          setLoadingIA(false);
          setIaStep('');

        } catch (pollErr) {
          clearInterval(checarStatus);
          setLoadingIA(false);
          setIaStep('');
          alert('Falha interna ao processar a resposta da IA.');
        }
      }, 4000);

    } catch (err) {
      setLoadingIA(false);
      setIaStep('');
      console.error("Erro de comunicação:", err);
      alert('Falha na comunicação com o assistente IA.');
    }
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const currentSlug = post.slug || 'rascunho-' + Date.now();
      const formData = new FormData();
      formData.append('slug', currentSlug);
      formData.append('upload', file);

      try {
        const res = await api.post('/blog/upload-editor', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const url = res.data.returnObj?.url || res.data?.url;
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', url);
        quill.setSelection(range.index + 1);
      } catch (error) {
        alert('Erro ao fazer upload da imagem.');
      }
    };
  }, [post.slug]);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: { image: imageHandler }
    }
  }), [imageHandler]);

  return (
    <div>
      {/* CABEÇALHO DO ESTÚDIO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            onClick={() => navigate('/admin/blog')} 
            className="action-icon-btn" 
            title="Voltar para a lista"
            style={{ width: '40px', height: '40px' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: 0 }}>
              {id ? 'Editar' : 'Novo'} <span style={{ color: 'var(--admin-accent)' }}>Artigo</span>
            </h1>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.84rem', margin: '4px 0 0 0' }}>
              Estúdio de criação, redação com IA Copilot e gestão de publicação.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="btn btn-primary"
            style={{ display: 'inline-flex', gap: '10px', alignItems: 'center', padding: '12px 24px', background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', boxShadow: '0 4px 20px rgba(56, 189, 248, 0.3)', border: 'none' }}
          >
            <Save size={18} /> {saving ? 'Salvando...' : 'Salvar Publicação'}
          </button>
        </div>
      </div>

      {/* LAYOUT EM 2 COLUNAS (STUDIO) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.1fr)', gap: '28px', alignItems: 'start' }}>
        
        {/* COLUNA ESQUERDA: EDITOR & IA COPILOT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* ASSISTENTE IA COPILOT */}
          <div className="ai-copilot-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={16} color="#818cf8" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff', letterSpacing: '0.5px' }}>
                    KSI AI Copilot
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Assistente de Redação e Pauta para o Lab</span>
                </div>
              </div>
            </div>

            {/* Presets Rápidos */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <button 
                type="button" 
                onClick={() => setPromptPreset('Artigo sobre o impacto de Agentes de Inteligência Artificial no Desenvolvimento Web em 2026')}
                className="ai-preset-chip"
              >
                💡 Tendências de IA & Agentes
              </button>
              <button 
                type="button" 
                onClick={() => setPromptPreset('Guia prático sobre Performance Web, Core Web Vitals e renderização moderna')}
                className="ai-preset-chip"
              >
                ⚡ Performance & Vitals
              </button>
              <button 
                type="button" 
                onClick={() => setPromptPreset('Estudo de caso sobre Escalabilidade, Micro-frontends e Arquiteturas Cloud-Native')}
                className="ai-preset-chip"
              >
                🎯 Arquitetura & Cloud
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Escreva um artigo técnico e envolvente sobre as novidades do ecossistema React e TypeScript..."
                rows={3}
                className="admin-textarea"
                style={{ background: 'rgba(6, 10, 20, 0.8) !important', resize: 'vertical' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)' }}>
                  {loadingIA ? iaStep : 'O assistente preencherá título, descrição, keywords e corpo do texto.'}
                </span>

                <button 
                  type="button"
                  onClick={gerarComIA}
                  disabled={loadingIA || !prompt.trim()}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', padding: '10px 18px', background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)', border: 'none', fontSize: '0.82rem' }}
                >
                  <Sparkles size={16} /> {loadingIA ? 'Processando IA...' : 'Gerar com IA'}
                </button>
              </div>
            </div>
          </div>

          {/* FORMULÁRIO PRINCIPAL DE EDIÇÃO */}
          <div className="admin-card">
            {/* Título do Artigo */}
            <div style={{ marginBottom: '20px' }}>
              <label className="admin-label">Título do Artigo</label>
              <input 
                type="text"
                value={post.titulo}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Digite o título atraente da publicação..."
                className="admin-input"
                style={{ fontSize: '1.25rem', fontWeight: 700, padding: '14px 18px' }}
              />
            </div>

            {/* Slug URL */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="admin-label" style={{ margin: 0 }}>Slug da URL</label>
                <button 
                  type="button" 
                  onClick={handleCopySlug} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--admin-accent)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {copiedSlug ? <Check size={12} /> : <Copy size={12} />} {copiedSlug ? 'Copiado!' : 'Copiar Link Completo'}
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(6, 10, 20, 0.6)', border: '1px solid var(--admin-card-border)', borderRadius: '10px', padding: '0 14px' }}>
                <span style={{ color: 'var(--admin-text-dim)', fontSize: '0.82rem', fontFamily: 'monospace' }}>
                  kineticsolutions.com.br/lab/
                </span>
                <input 
                  type="text"
                  value={post.slug}
                  onChange={(e) => setPost(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                  className="admin-input"
                  style={{ border: 'none !important', background: 'transparent !important', padding: '12px 6px !important', boxShadow: 'none !important' }}
                />
              </div>
            </div>

            {/* Imagem de Capa URL */}
            <div style={{ marginBottom: '24px' }}>
              <label className="admin-label">URL da Imagem de Capa</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="text"
                  value={post.imagem_capa}
                  onChange={(e) => setPost(prev => ({ ...prev, imagem_capa: e.target.value }))}
                  placeholder="https://exemplo.com/imagem-capa.jpg"
                  className="admin-input"
                />
                {post.imagem_capa && (
                  <img src={post.imagem_capa} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-card-border)' }} />
                )}
              </div>
            </div>

            {/* Editor Quill em Tema Dark */}
            <div>
              <label className="admin-label">Conteúdo do Artigo</label>
              <div className="admin-quill-wrapper">
                <ReactQuill 
                  ref={quillRef}
                  theme="snow" 
                  modules={modules}
                  value={post.conteudo}
                  onChange={(val) => setPost(prev => ({ ...prev, conteudo: val }))}
                  placeholder="Redija o artigo com formatação rica, cabeçalhos, citações e imagens..."
                />
              </div>
            </div>

          </div>

        </div>

        {/* COLUNA DIREITA: CONFIGURAÇÕES, SEO & PREVIEW (STICKY) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '24px' }}>
          
          {/* CARD DE STATUS & PUBLICAÇÃO */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} color="var(--admin-accent)" /> Publicação & Visibilidade
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label className="admin-label">Status do Artigo</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setPost(prev => ({ ...prev, status: 'publicado' }))}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: post.status === 'publicado' ? '1px solid var(--admin-success)' : '1px solid var(--admin-card-border)',
                    background: post.status === 'publicado' ? 'var(--admin-success-bg)' : 'rgba(255,255,255,0.02)',
                    color: post.status === 'publicado' ? 'var(--admin-success)' : 'var(--admin-text-muted)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Globe size={14} /> Público
                </button>

                <button
                  type="button"
                  onClick={() => setPost(prev => ({ ...prev, status: 'rascunho' }))}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: post.status === 'rascunho' ? '1px solid var(--admin-warning)' : '1px solid var(--admin-card-border)',
                    background: post.status === 'rascunho' ? 'var(--admin-warning-bg)' : 'rgba(255,255,255,0.02)',
                    color: post.status === 'rascunho' ? 'var(--admin-warning)' : 'var(--admin-text-muted)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Lock size={14} /> Rascunho
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="admin-label">Categoria</label>
              <select 
                value={post.categoria_id}
                onChange={(e) => setPost(prev => ({ ...prev, categoria_id: parseInt(e.target.value) }))}
                className="admin-select"
              >
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
            </div>

            <button 
              type="button"
              onClick={handleSave} 
              disabled={saving}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', display: 'flex', justifyContent: 'center', gap: '10px' }}
            >
              <Save size={18} /> {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>

          {/* CARD DE AGENDAMENTO */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--admin-purple)" /> Agendamento & Validade
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label className="admin-label">Data de Publicação</label>
              <input 
                type="datetime-local"
                value={post.data_publicacao}
                onChange={(e) => setPost(prev => ({ ...prev, data_publicacao: e.target.value }))}
                className="admin-input"
              />
            </div>

            <div>
              <label className="admin-label">Data de Pausa / Despublicação</label>
              <input 
                type="datetime-local"
                value={post.data_pausa}
                onChange={(e) => setPost(prev => ({ ...prev, data_pausa: e.target.value }))}
                className="admin-input"
              />
            </div>
          </div>

          {/* SIMULADOR DE SERP DO GOOGLE (SEO PREVIEW) */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={18} color="#34a853" /> Google Search Preview
            </h3>
            <p style={{ color: 'var(--admin-text-dim)', fontSize: '0.75rem', margin: '0 0 14px 0' }}>
              Pré-visualização de como o snippet aparecerá nos resultados de busca do Google.
            </p>

            <div className="google-preview-card">
              <div className="google-preview-url">
                <span>https://kineticsolutions.com.br</span>
                <span>› lab › {post.slug || 'artigo'}</span>
              </div>
              <div className="google-preview-title">
                {post.titulo || 'Título do Artigo Aparecerá Aqui | KSI LAB'}
              </div>
              <div className="google-preview-desc">
                {post.descricao || 'Adicione uma breve descrição para otimizar a taxa de cliques e melhorar o posicionamento nos buscadores...'}
              </div>
            </div>

            <div style={{ marginTop: '18px' }}>
              <label className="admin-label">Descrição SEO (Meta Description)</label>
              <textarea 
                rows={3}
                value={post.descricao}
                onChange={(e) => setPost(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Resumo estratégico para motores de busca (máx 160 caracteres recomendados)..."
                className="admin-textarea"
                style={{ fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ marginTop: '16px' }}>
              <label className="admin-label">Palavras-chave (Keywords)</label>
              <input 
                type="text"
                value={post.keywords}
                onChange={(e) => setPost(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="tecnologia, inovacao, web, ia..."
                className="admin-input"
                style={{ fontSize: '0.88rem' }}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}