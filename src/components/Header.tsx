import React, { useState, useEffect, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { Menu, X, ArrowRight, MessageSquare, LogIn, LogOut, User, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { languages } from '../i18n';

export default function Header() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchUser = () => {
    api.get('/users')
      .then(res => {
        const userData = res.data.returnObj || res.data;
        setUser(userData || null);
      })
      .catch(() => setUser(null));
  };

  useEffect(() => {
    fetchUser(); 
    window.addEventListener('authChange', fetchUser);
    return () => window.removeEventListener('authChange', fetchUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (location.pathname === '/') {
      e.preventDefault(); 
      
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80; 
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        window.history.pushState(null, '', `/#${id}`);
      }
    }
    setIsMobileMenuOpen(false);
  };

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        await api.post('/users/google-login', { token: codeResponse.code });
        window.dispatchEvent(new Event('authChange'));
      } catch (error) {
        alert(t('nav.authFailed'));
      }
    },
    flow: 'auth-code',
    scope: 'openid email profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read',
    prompt: 'consent'
  });

  const handleLogout = async () => {
    try {
      await api.get('/users/logout');
      googleLogout();
      window.dispatchEvent(new Event('authChange'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', '/');
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        
        {/* Logo KSI */}
        <Link to="/" className="logo" onClick={handleLogoClick}>
          <img src="/img/ksi.png" alt="KSI" className="logo-img" style={{ width: '70px', height: 'auto' }} />
        </Link>
        
        {/* Navegação Desktop */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            <li>
              <a href="/#servicos" onClick={(e) => handleScrollToSection(e, 'servicos')} className="hover-target">
                {t('nav.services')}
              </a>
            </li>
            <li>
              <a href="/#portfolio" onClick={(e) => handleScrollToSection(e, 'portfolio')} className="hover-target">
                {t('nav.portfolio')}
              </a>
            </li>
            <li>
              <a href="/#diferenciais" onClick={(e) => handleScrollToSection(e, 'diferenciais')} className="hover-target">
                {t('nav.differentials')}
              </a>
            </li>
            <li>
              <a href="/#sobre" onClick={(e) => handleScrollToSection(e, 'sobre')} className="hover-target">
                {t('nav.about')}
              </a>
            </li>
            <li>
              <Link to="/lab" className="hover-target lab-nav-link">
                LAB
              </Link>
            </li>
          </ul>
        </nav>

        {/* Ações Desktop: Login / Usuário & Botão Orçamento */}
        <div className="header-actions">
          {user ? (
            <div className="user-profile-pill">
              <img 
                src={user.imagem || '/default-user-image.png'} 
                alt={t('nav.profile')} 
                referrerPolicy="no-referrer" 
                className="user-avatar"
              />
              <div className="user-info-text">
                <span className="user-name">{user.nome?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="logout-btn">
                  {t('nav.signOut')}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => login()} className="header-login-btn hover-target" title={t('nav.signIn')}>
              <LogIn size={15} />
              <span>{t('nav.signIn')}</span>
            </button>
          )}

          <a 
            href="/#contato" 
            onClick={(e) => handleScrollToSection(e, 'contato')} 
            className="btn btn-primary header-cta-btn hover-target"
          >
            <span>{t('nav.budget')}</span>
            <ArrowRight size={14} />
          </a>

          <label title={t('nav.language')} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.76rem' }}>
            <Languages size={15} />
            <select aria-label={t('nav.language')} value={i18n.resolvedLanguage} onChange={(event) => i18n.changeLanguage(event.target.value)} style={{ appearance: 'none', border: 0, background: 'transparent', color: 'inherit', cursor: 'pointer', fontWeight: 700 }}>
              {languages.map((language) => <option key={language.code} value={language.code} style={{ color: '#0f172a' }}>{language.label}</option>)}
            </select>
          </label>

          {/* Botão Menu Mobile */}
          <button 
            className="mobile-menu-btn hover-target" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? t('nav.menuClose') : t('nav.menuOpen')}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Menu Mobile Drawer */}
      <div className={`mobile-nav-dropdown ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links">
          <a href="/#servicos" onClick={(e) => handleScrollToSection(e, 'servicos')}>
            {t('nav.services')}
          </a>
          <a href="/#portfolio" onClick={(e) => handleScrollToSection(e, 'portfolio')}>
            {t('nav.portfolio')}
          </a>
          <a href="/#diferenciais" onClick={(e) => handleScrollToSection(e, 'diferenciais')}>
            {t('nav.differentials')}
          </a>
          <a href="/#sobre" onClick={(e) => handleScrollToSection(e, 'sobre')}>
            {t('nav.about')}
          </a>
          <Link to="/lab" onClick={() => setIsMobileMenuOpen(false)}>
            LAB <span className="lab-badge">{t('nav.new')}</span>
          </Link>
          <a href="/#contato" onClick={(e) => handleScrollToSection(e, 'contato')} className="mobile-cta-link">
            {t('nav.budget')}
          </a>
        </div>

        <div className="mobile-user-area">
          {user ? (
            <div className="mobile-user-card">
              <img src={user.imagem || '/default-user-image.png'} alt={t('nav.profile')} referrerPolicy="no-referrer" />
              <div className="mobile-user-details">
                <span className="mobile-user-name">{user.nome}</span>
                <button onClick={handleLogout} className="mobile-logout-btn">
                  <LogOut size={14} />
                  <span>{t('nav.signOutAccount')}</span>
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => login()} className="btn btn-primary mobile-login-btn">
              <LogIn size={16} />
              <span>{t('nav.signInGoogle')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
