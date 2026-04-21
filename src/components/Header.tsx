import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { Menu, X } from 'lucide-react'; 
import api from '../services/api';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/users')
      .then(res => {
        const userData = res.data.returnObj || res.data;
        if (userData) setUser(userData);
      })
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        await api.post('/users/google-login', { token: codeResponse.code });
        const resUser = await api.get('/users');
        setUser(resUser.data.returnObj || resUser.data);
      } catch (error) {
        alert('Falha ao autenticar.');
      }
    },
    flow: 'auth-code',
  });

  const handleLogout = async () => {
    try {
      await api.get('/users/logout');
      googleLogout();
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const headerStyle: React.CSSProperties = scrolled || isMobileMenuOpen ? {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease'
  } : {
    background: 'transparent',
    borderBottom: '1px solid transparent',
    transition: 'all 0.3s ease'
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`} style={{ ...headerStyle, position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
      <div className="container header-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        
        <Link to="/" className="logo">
          <img src="/img/ksi.png" alt="KSI Logo" style={{ width: '70px' }} />
        </Link>
        
        {/* NAVEGAÇÃO DESKTOP */}
        <nav className="desktop-nav" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <ul className="nav-links flex items-center gap-6">
            <li><a href="/#servicos" className="hover-target">SERVIÇOS</a></li>
            <li><a href="/#portfolio" className="hover-target">PORTFOLIO</a></li>
            <li><a href="/#sobre" className="hover-target">SOBRE NÓS</a></li>
            <li><Link to="/lab" className="hover-target">LAB</Link></li>
          </ul>
        </nav>

        {/* USUÁRIO DESKTOP */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.04)', padding: '6px 16px 6px 6px', borderRadius: '40px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <img src={user.imagem || '/default-user-image.png'} alt="Perfil" referrerPolicy="no-referrer" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', lineHeight: '1', color: 'var(--text-primary)' }}>{user.nome?.split(' ')[0]}</span>
                <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.75rem', textAlign: 'left', cursor: 'pointer', padding: 0, marginTop: '2px' }}>Sair</button>
              </div>
            </div>
          ) : (
            <button onClick={() => login()} className="btn" style={{ background: '#0a0a0a', color: '#fff', padding: '8px 16px', borderRadius: '24px', fontWeight: 'bold' }}>Entrar</button>
          )}
        </div>

        {/* BOTÃO HAMBÚRGUER MOBILE */}
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} color="var(--accent-color)" /> : <Menu size={28} color="var(--accent-color)" />}
        </button>

        {/* DROPDOWN MOBILE */}
        <div className={`mobile-nav-dropdown ${isMobileMenuOpen ? 'open' : ''}`}>
          <a href="/#servicos" onClick={() => setIsMobileMenuOpen(false)}>SERVIÇOS</a>
          <a href="/#portfolio" onClick={() => setIsMobileMenuOpen(false)}>PORTFOLIO</a>
          <a href="/#sobre" onClick={() => setIsMobileMenuOpen(false)}>SOBRE NÓS</a>
          <Link to="/lab" onClick={() => setIsMobileMenuOpen(false)}>LAB</Link>
          <hr style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }} />
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={user.imagem || '/default-user-image.png'} alt="Perfil" referrerPolicy="no-referrer" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{user.nome}</span>
                <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.9rem', textAlign: 'left', cursor: 'pointer', padding: 0, marginTop: '4px' }}>Sair da conta</button>
              </div>
            </div>
          ) : (
            <button onClick={() => login()} className="btn" style={{ background: '#0a0a0a', color: '#fff', padding: '12px 16px', borderRadius: '8px', fontWeight: 'bold', width: '100%' }}>Fazer Login</button>
          )}
        </div>
      </div>
    </header>
  );
}