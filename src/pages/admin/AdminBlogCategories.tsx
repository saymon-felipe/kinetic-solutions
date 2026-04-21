import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../services/api'; // Ajuste o caminho se necessário

export default function AdminBlogCategories() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [slug, setSlug] = useState('');

  const carregarCategorias = () => {
    api.get('/blog/categorias')
      .then(res => setCategorias(res.data.returnObj || res.data))
      .catch(err => console.error(err));
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
    if (!nome || !slug) return;

    try {
      await api.post('/blog/categorias', { nome, slug });
      setNome('');
      setSlug('');
      carregarCategorias();
    } catch (error) {
      console.error("Erro ao criar categoria", error);
      alert("Erro ao criar categoria. Verifique se o slug já existe.");
    }
  };

  const deletarCategoria = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;
    
    try {
      await api.delete(`/blog/categorias/${id}`);
      carregarCategorias();
    } catch (error) {
      console.error("Erro ao deletar categoria", error);
      alert("Erro ao excluir. Verifique se existem posts vinculados a esta categoria.");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="blog-title" style={{ fontSize: '2.5rem' }}>Categorias</h1>
        <p className="blog-subtitle">Gerencie as categorias do KSI Lab.</p>
      </div>

      <div className="admin-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Nova Categoria</h2>
        <form onSubmit={criarCategoria} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Nome da Categoria</label>
            <input 
              type="text" 
              value={nome} 
              onChange={handleNomeChange} 
              className="form-control" 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #3f3f46', background: '#18181b', color: '#fff' }}
              required 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Slug (URL)</label>
            <input 
              type="text" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)} 
              className="form-control" 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #3f3f46', background: '#27272a', color: '#a1a1aa' }}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '42px' }}>
            <Plus size={20} /> Salvar
          </button>
        </form>
      </div>

      <div className="admin-card table-responsive" style={{ padding: '24px' }}>
        <table className="admin-table" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ paddingBottom: '16px' }}>ID</th>
              <th style={{ paddingBottom: '16px' }}>Nome</th>
              <th style={{ paddingBottom: '16px' }}>Slug</th>
              <th style={{ paddingBottom: '16px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat: any) => (
              <tr key={cat.id} style={{ borderTop: '1px solid #27272a' }}>
                <td style={{ padding: '16px 0' }}>{cat.id}</td>
                <td style={{ fontWeight: 'bold' }}>{cat.nome}</td>
                <td style={{ color: '#a1a1aa' }}>{cat.slug}</td>
                <td style={{ display: 'flex', gap: '12px', padding: '16px 0' }}>
                  <button onClick={() => deletarCategoria(cat.id)} className="icon-btn text-red" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={18} color="#ef4444" />
                  </button>
                </td>
              </tr>
            ))}
            {categorias.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>Nenhuma categoria cadastrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}