import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Differentials from './components/Differentials';
import AboutFounder from './components/AboutFounder';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import SmoothScroll from './components/SmoothScroll';
import api from './services/api';
import useAdvancedAnalytics from './hooks/useAdvancedAnalytics';

import LabHome from './pages/LabHome';
import LabPost from './pages/LabPost';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBlogDashboard from './pages/admin/AdminBlogDashboard';
import BlogAdmin from './pages/BlogAdmin';
import AdminBlogCategories from './pages/admin/AdminBlogCategories';
import AdminBlogInteractions from './pages/admin/AdminBlogInteractions';
import AdminProjectsDashboard from './pages/admin/AdminProjectsDashboard';
import AdminProjectForm from './pages/admin/AdminProjectForm';
import AdminProjectCategories from './pages/admin/AdminProjectCategories';
import AdminProjectTags from './pages/admin/AdminProjectTags';

//TODO: Modularizar as funções de Analytics em hooks separados.
const SCROLL_POSITION_KEY_PREFIX = 'ksi_scroll_position:';

function AnalyticsTracker() {
  const location = useLocation();
  const lastTrackedPath = useRef('');

  useAdvancedAnalytics();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    const currentPath = location.pathname + location.search;
    if (lastTrackedPath.current === currentPath) {
      return; 
    }
    lastTrackedPath.current = currentPath;

    let sessionId = sessionStorage.getItem('ksi_session');
    
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      sessionStorage.setItem('ksi_session', sessionId);
    }

    const queryParams = new URLSearchParams(window.location.search);
    const utm_source = queryParams.get('utm_source');
    const utm_medium = queryParams.get('utm_medium');
    const utm_campaign = queryParams.get('utm_campaign');

    api.post('/analytics/track', {
      session_id: sessionId,
      page_url: location.pathname,
      utm_source,
      utm_medium,
      utm_campaign
    }).catch(err => console.error(err));
    
  }, [location.pathname, location.search]);

  return null;
}

function PageScrollPersistence() {
  const location = useLocation();

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    const storageKey = `${SCROLL_POSITION_KEY_PREFIX}${location.pathname}`;
    const savedValue = sessionStorage.getItem(storageKey);
    const savedPosition = savedValue === null ? null : Number(savedValue);
    const hasSavedPosition = savedPosition !== null && Number.isFinite(savedPosition) && savedPosition >= 0;
    const targetPosition = savedPosition ?? 0;
    let restored = false;
    let animationFrame: number | null = null;
    let restoreTimer: number | null = null;
    let restoreAttempts = 0;

    const persistScrollPosition = () => {
      if (restored) {
        sessionStorage.setItem(storageKey, String(Math.round(window.scrollY)));
      }
    };

    const restoreScrollPosition = () => {
      if (window.location.hash) {
        restored = true;
        return;
      }

      if (!hasSavedPosition) {
        window.scrollTo(0, 0);
        restored = true;
        return;
      }

      window.scrollTo(0, targetPosition);
      restoreAttempts += 1;

      if (restoreAttempts >= 3 && Math.abs(window.scrollY - targetPosition) < 1) {
        restored = true;
        return;
      }

      if (restoreAttempts < 20) {
        restoreTimer = window.setTimeout(restoreScrollPosition, 100);
      } else {
        restored = true;
      }
    };

    const handleScroll = () => {
      if (animationFrame === null) {
        animationFrame = requestAnimationFrame(() => {
          persistScrollPosition();
          animationFrame = null;
        });
      }
    };

    const restoreFrame = requestAnimationFrame(restoreScrollPosition);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pagehide', persistScrollPosition);

    return () => {
      cancelAnimationFrame(restoreFrame);
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      if (restoreTimer !== null) window.clearTimeout(restoreTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pagehide', persistScrollPosition);
    };
  }, [location.hash, location.pathname]);

  return null;
}

function HomePage() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Differentials />
        <AboutFounder />
        <Contact />
      </main>
    </SmoothScroll>
  );
}

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname === '/' && hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          const headerOffset = 90;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }, 100);
      }
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <div style={{ minHeight: '100dvh' }}>
      <CustomCursor />
      <AnalyticsTracker />
      <PageScrollPersistence />
      <ScrollToHash />
      
      <Routes>
        <Route path="/" element={
          <>
            <Header />
            <HomePage />
            <Footer />
          </>
        } />

        <Route path="/lab" element={
          <>
            <Header />
            <LabHome />
            <Footer />
          </>
        } />

        <Route path="/lab/:slug" element={
          <>
            <Header />
            <LabPost />
            <Footer />
          </>
        } />

        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="blog" element={<AdminBlogDashboard />} />
          <Route path="blog/new" element={<BlogAdmin />} />
          <Route path="blog/edit/:id" element={<BlogAdmin />} />
          <Route path="blog/categorias" element={<AdminBlogCategories />} />
          <Route path="blog/interacoes" element={<AdminBlogInteractions />} />
          <Route path="projetos" element={<AdminProjectsDashboard />} />
          <Route path="projetos/novo" element={<AdminProjectForm />} />
          <Route path="projetos/editar/:id" element={<AdminProjectForm />} />
          <Route path="projetos/categorias" element={<AdminProjectCategories />} />
          <Route path="projetos/tags" element={<AdminProjectTags />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
