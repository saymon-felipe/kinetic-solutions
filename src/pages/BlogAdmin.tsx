import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Sparkles, Save, ArrowLeft, Globe, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import '../styles/blog.css';

export default function BlogAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef<any>(null);
  
  const [post, setPost] = useState({
    titulo: '', 
    slug: '', 
    descricao: '', 
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
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);

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
        const data = res.data.returnObj;
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

  const handleSave = async () => {
    if (!post.titulo || !post.conteudo) {
      alert("Título e conteúdo são obrigatórios.");
      return;
    }

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
      alert('Operação realizada com sucesso!');
      navigate('/admin/blog');
    } catch (err) { 
      console.error(err);
      alert('Erro ao salvar publicação.'); 
    }
  };

  const gerarComIA = async () => {
    if (!prompt) return;
    
    setLoadingIA(true);
    
    try {
      const startRes = await api.post('/blog/ai-copywriter', { prompt });
      const jobId = startRes.data.returnObj.jobId;

      const checarStatus = setInterval(async () => {
        try {
          const statusRes = await api.get(`/blog/ai-copywriter/status/${jobId}`);
          const jobData = statusRes.data.returnObj;

          if (jobData && jobData.status === 'processing') {
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
                  console.warn("Falha no JSON.parse na iteração", loopCount, rawData);
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
          const novoConteudo = (normalizedObj['conteudo'] || normalizedObj['content'] || '').replace(/&nbsp;/g, ' ');
          
          setPost(prev => ({ 
            ...prev, 
            titulo: novoTitulo || prev.titulo,
            slug: novoTitulo ? generateSlug(novoTitulo) : prev.slug,
            descricao: novaDescricao || prev.descricao, 
            conteudo: prev.conteudo + (prev.conteudo ? '<br/><br/>' : '') + (novoConteudo || '')
          }));
          
          setPrompt('');
          setIsPromptExpanded(false);
          setLoadingIA(false);

        } catch (pollErr) {
          clearInterval(checarStatus);
          setLoadingIA(false);
          console.error("Erro no processo de extração:", pollErr);
          alert('Falha interna ao processar a resposta da IA.');
        }
      }, 5000);

    } catch (err) {
      setLoadingIA(false);
      console.error("Erro de comunicação:", err);
      alert('Conexão com o servidor falhou.');
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
        
        const url = res.data.returnObj.url;
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
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: { image: imageHandler }
    }
  }), [imageHandler]);

  return (
    <div className="blog-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate('/admin/blog')} className="btn" style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#fff', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <ArrowLeft size={16} /> Voltar
        </button>
        <h1 className="blog-title" style={{ margin: 0 }}>{id ? 'Editar' : 'Novo'} Artigo</h1>
      </div>
      
      <div className="admin-card">
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: '#18181b', padding: '8px 16px', borderRadius: '8px', border: '1px solid #3f3f46' }}>
            {post.status === 'publicado' ? <Globe size={18} color="#10b981" /> : <Lock size={18} color="#f59e0b" />}
            <span style={{ fontSize: '0.9rem', color: post.status === 'publicado' ? '#10b981' : '#f59e0b' }}>
              {post.status === 'publicado' ? 'Público' : 'Rascunho'}
            </span>
            <input 
              type="checkbox" 
              checked={post.status === 'publicado'}
              onChange={(e) => setPost(prev => ({...prev, status: e.target.checked ? 'publicado' : 'rascunho'}))}
              style={{ width: '18px', height: '18px' }}
            />
          </label>
        </div>

        <div className="ai-assistant-container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <motion.div 
              animate={{ height: isPromptExpanded ? '180px' : '50px' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ flex: 1, position: 'relative' }}
            >
              <textarea 
                style={{ 
                  width: '100%', height: '100%', background: 'rgba(0,0,0,0.3)', 
                  border: isPromptExpanded ? '1px solid #3b82f6' : '1px solid transparent', 
                  padding: '12px', borderRadius: '8px', color: '#fff', 
                  resize: 'none', outline: 'none', transition: 'border 0.3s'
                }}
                placeholder="Descreva o escopo, pauta e objetivos do post para a IA..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsPromptExpanded(true)}
                onBlur={(e) => { if (!e.target.value) setIsPromptExpanded(false); }}
              />
            </motion.div>

            <button 
              onClick={gerarComIA}
              disabled={loadingIA || !prompt}
              className="btn btn-primary"
              style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '50px', whiteSpace: 'nowrap' }}
            >
              <Sparkles size={16} /> {loadingIA ? 'Pensando...' : 'Gerar Post Completo'}
            </button>
          </div>
        </div>

        <div className="form-flex-col-mobile" style={{ display: 'flex', gap: '20px', marginTop: '32px' }}>
          <div className="form-group-blog" style={{ flex: 2 }}>
            <label style={{ color: '#71717a', fontSize: '0.8rem', fontWeight: 'bold' }}>TÍTULO DO ARTIGO</label>
            <input 
              className="blog-input"
              value={post.titulo}
              onChange={(e) => handleTitleChange(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #3f3f46', background: '#18181b', color: '#fff', marginTop: '8px' }}
            />
            <span style={{ fontSize: '0.75rem', color: '#52525b', display: 'block', marginTop: '4px' }}>
              Slug: {post.slug || 'sera-gerado-automaticamente'}
            </span>
          </div>

          <div className="form-group-blog" style={{ flex: 1 }}>
            <label style={{ color: '#71717a', fontSize: '0.8rem', fontWeight: 'bold' }}>CATEGORIA</label>
            <select 
              value={post.categoria_id}
              onChange={(e) => setPost(prev => ({...prev, categoria_id: parseInt(e.target.value)}))}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #3f3f46', background: '#18181b', color: '#fff', marginTop: '8px', cursor: 'pointer' }}
            >
              <option value="" disabled>Selecione...</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-flex-col-mobile" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#71717a', fontSize: '0.8rem', fontWeight: 'bold' }}>VISÍVEL EM (OPCIONAL)</label>
            <input 
              type="datetime-local"
              className="blog-input"
              value={post.data_publicacao}
              onChange={(e) => setPost(prev => ({...prev, data_publicacao: e.target.value}))}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #3f3f46', background: '#18181b', color: '#fff', marginTop: '8px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#71717a', fontSize: '0.8rem', fontWeight: 'bold' }}>REMOVER EM (OPCIONAL)</label>
            <input 
              type="datetime-local"
              className="blog-input"
              value={post.data_pausa}
              onChange={(e) => setPost(prev => ({...prev, data_pausa: e.target.value}))}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #3f3f46', background: '#18181b', color: '#fff', marginTop: '8px' }}
            />
          </div>
        </div>

        <div className="form-group-blog" style={{ marginTop: '20px' }}>
          <label style={{ color: '#71717a', fontSize: '0.8rem', fontWeight: 'bold' }}>BREVE DESCRIÇÃO (SEO)</label>
          <textarea 
            value={post.descricao}
            onChange={(e) => setPost(prev => ({...prev, descricao: e.target.value}))}
            rows={2}
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #3f3f46', background: '#18181b', color: '#fff', marginTop: '8px', resize: 'vertical' }}
          />
        </div>

        <div className="quill-wrapper" style={{ marginTop: '32px' }}>
          <ReactQuill 
            ref={quillRef}
            theme="snow" 
            modules={modules}
            style={{ height: '500px', paddingBottom: '42px' }}
            value={post.conteudo}
            onChange={(val) => setPost(prev => ({...prev, conteudo: val}))}
          />
        </div>

        <button 
          onClick={handleSave}
          className="btn btn-primary"
          style={{ width: '100%', padding: '16px', marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '12px' }}
        >
          <Save size={20} /> SALVAR PUBLICAÇÃO
        </button>
      </div>
    </div>
  );
}