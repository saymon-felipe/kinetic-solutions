import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import AboutFounder from './components/AboutFounder';
import Portfolio from './components/Portfolio';
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

//TODO: Modularizar as funções de Analytics em hooks separados.

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

function HomePage() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        <AboutFounder />
        <Services />
        <Portfolio />
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
      <ScrollToHash />
      
      <Routes>
        <Route path="/*" element={
          <>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/lab" element={<LabHome />} />
              <Route path="/lab/:slug" element={<LabPost />} />
            </Routes>
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
        </Route>
      </Routes>
    </div>
  );
}

export default App;