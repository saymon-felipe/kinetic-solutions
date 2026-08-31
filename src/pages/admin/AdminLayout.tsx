import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut, List, Menu, X, MessageSquare, ExternalLink, ShieldCheck, ChevronRight, FolderKanban } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import KsiLoader from '../../components/KsiLoader';
import '../../styles/admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/users');
        const userData = res.data.returnObj || res.data;
        if (!userData || !userData.admin) {
          navigate('/admin/login');
        } else {
          setUser(userData);
          setLoading(false);
        }
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

  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/admin') return 'Analytics & Métricas';
    if (p.startsWith('/admin/blog/new')) return 'Novo Artigo';
    if (p.startsWith('/admin/blog/edit')) return 'Editar Artigo';
    if (p.startsWith('/admin/blog/categorias')) return 'Categorias';
    if (p.startsWith('/admin/blog/interacoes')) return 'Moderação de Comentários';
    if (p.startsWith('/admin/blog')) return 'Gestão do KSI Lab';
    if (p.startsWith('/admin/projetos/novo')) return 'Novo Projeto';
    if (p.startsWith('/admin/projetos/editar')) return 'Editar Projeto';
    if (p.startsWith('/admin/projetos')) return 'Gestão de Projetos';
    return 'Painel Geral';
  };

  if (loading) {
    return (
      <div className="admin-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <KsiLoader
          kicker="KSI WORKSPACE"
          title="Autenticando"
          message="Sincronizando permissões de administrador..."
          theme="dark"
          minHeight="60vh"
        />
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-ambient-glow" />

      {/* BARRA SUPERIOR MOBILE */}
      <div className="admin-mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
            <img src="/img/ksi.png" alt="KSI Logo" style={{ height: '22px', width: 'auto', display: 'block' }} />
          </div>
          <span className="sidebar-brand-badge">WORKSPACE</span>
        </div>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}>
          <Menu size={26} />
        </button>
      </div>

      {/* OVERLAY MOBILE */}
      <div className={`admin-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>

      {/* SIDEBAR DESKTOP & MOBILE DRAWER */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#ffffff', padding: '8px 14px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center' }}>
                <img src="/img/ksi.png" alt="KSI Logo" style={{ height: '24px', width: 'auto', display: 'block' }} />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.05rem', letterSpacing: '0.5px', color: '#fff' }}>KSI</span>
                <span className="sidebar-brand-badge" style={{ display: 'block' }}>WORKSPACE</span>
              </div>
            </div>
          </div>
          <button className="action-icon-btn" onClick={() => setSidebarOpen(false)} style={{ display: sidebarOpen ? 'inline-flex' : 'none' }}>
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin" className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link to="/admin/blog" className={`nav-item ${
            location.pathname === '/admin/blog' || 
            location.pathname.includes('/admin/blog/new') || 
            location.pathname.includes('/admin/blog/edit') ? 'active' : ''
          }`}>
            <FileText size={18} /> KSI Lab Posts
          </Link>

          <Link to="/admin/blog/categorias" className={`nav-item ${location.pathname.includes('/admin/blog/categorias') ? 'active' : ''}`}>
            <List size={18} /> Categorias
          </Link>

          <Link to="/admin/blog/interacoes" className={`nav-item ${location.pathname.includes('/admin/blog/interacoes') ? 'active' : ''}`}>
            <MessageSquare size={18} /> Moderação
          </Link>

          <Link to="/admin/projetos" className={`nav-item ${location.pathname.startsWith('/admin/projetos') ? 'active' : ''}`}>
            <FolderKanban size={18} /> Projetos
          </Link>
        </nav>

        {/* User Card & Logout */}
        <div className="sidebar-user-card">
          <div className="sidebar-user-info">
            {user?.imagem ? (
              <img src={user.imagem} alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(56, 189, 248, 0.3)' }} referrerPolicy="no-referrer" />
            ) : (
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} color="var(--admin-accent)" />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.nome || 'Administrador'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span className="sidebar-status-dot" />
                <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-dim)' }}>Online • Admin</span>
              </div>
            </div>
          </div>

          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} /> Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="admin-content">
        {/* Barra de cabeçalho com Breadcrumbs e Ações Rápidas */}
        <div className="admin-header-bar">
          <div className="admin-breadcrumb">
            <span>KSI Admin</span>
            <ChevronRight size={14} />
            <span className="admin-breadcrumb-current">{getPageTitle()}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/lab" target="_blank" className="admin-quick-link" title="Visualizar KSI Lab no ambiente público">
              <ExternalLink size={14} /> Ver Lab Público
            </Link>
          </div>
        </div>

        {/* Animação suave entre rotas filhas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
