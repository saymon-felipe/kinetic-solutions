import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut, List, Menu, X, MessageSquare } from 'lucide-react';
import api from '../../services/api';
import '../../styles/blog.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Estado do menu lateral mobile

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/users');
        const user = res.data.returnObj || res.data;
        if (!user || !user.admin) navigate('/admin/login');
        else setLoading(false);
      } catch (err) {
        navigate('/admin/login');
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.get('/users/logout');
      navigate('/admin/login');
    } catch (err) {
      console.error("Erro ao deslogar", err);
    }
  };

  if (loading) return <div className="blog-container text-center" style={{ paddingTop: '20vh' }}>Verificando autorização...</div>;

  return (
    <div className="admin-wrapper">
      
      {/* BARRA SUPERIOR EXCLUSIVA PARA MOBILE */}
      <div className="admin-mobile-topbar">
        <img src="/img/ksi.png" alt="KSI Logo" style={{ width: '60px' }} />
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'transparent', border: 'none', color: '#fff' }}>
          <Menu size={28} />
        </button>
      </div>

      {/* OVERLAY MOBILE PARA FECHAR SIDEBAR */}
      <div className={`admin-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <img src="/img/ksi.png" alt="KSI Logo" style={{ width: '80px' }} />
            <span className="text-blue font-bold" style={{ display: 'block', marginTop: '10px' }}>WORKSPACE</span>
          </div>
          {/* Botão de fechar visível apenas no mobile na sidebar aberta */}
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(false)} style={{ color: '#fff' }}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/admin" className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          
          <Link to="/admin/blog" className={`nav-item ${
            location.pathname === '/admin/blog' || 
            location.pathname.includes('/admin/blog/new') || 
            location.pathname.includes('/admin/blog/edit') ? 'active' : ''
          }`}>
            <FileText size={20} /> KSI Lab
          </Link>
          
          <Link to="/admin/blog/categorias" className={`nav-item ${location.pathname.includes('/admin/blog/categorias') ? 'active' : ''}`}>
            <List size={20} /> Categorias
          </Link>

          <Link to="/admin/blog/interacoes" className={`nav-item ${location.pathname.includes('/admin/blog/interacoes') ? 'active' : ''}`}>
            <MessageSquare size={20} /> Interações
          </Link>
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} /> Sair
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}