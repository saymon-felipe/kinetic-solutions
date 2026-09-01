import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { ChevronLeft, ChevronRight, ExternalLink, Maximize2, Layers } from 'lucide-react';
import api from '../services/api';
import KsiLoader from './KsiLoader';
import { useTranslation } from 'react-i18next';

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  descriptionEn: string | null;
  descriptionEs: string | null;
  image: string;
  link: string | null;
  tags: string[];
}

export default function Portfolio() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('__all__');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/projects')
      .then((response) => setProjects(response.data.returnObj || response.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => [
    '__all__',
    ...Array.from(new Set(projects.map((project) => project.category))).filter(Boolean)
  ], [projects]);

  const filteredProjects = selectedCategory === '__all__'
    ? projects
    : projects.filter((project) => project.category === selectedCategory);

  const updateScrollState = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const maxScroll = scrollWidth - clientWidth;

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(maxScroll > 0 && scrollLeft < maxScroll - 10);
    setScrollProgress(maxScroll > 0 ? Math.min(Math.max(scrollLeft / maxScroll, 0), 1) : 0);

    const firstItem = carouselRef.current.querySelector('.portfolio-item') as HTMLElement | null;
    if (firstItem && filteredProjects.length) {
      const itemWidth = firstItem.offsetWidth + 24;
      setCurrentIndex(Math.max(0, Math.min(Math.round(scrollLeft / itemWidth), filteredProjects.length - 1)));
    }
  }, [filteredProjects.length]);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;
    container.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => container.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState, selectedCategory, loading]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    carouselRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = carouselRef.current;
    const firstItem = container?.querySelector('.portfolio-item') as HTMLElement | null;
    if (!container || !firstItem) return;
    const itemWidth = firstItem.offsetWidth + 24;
    container.scrollBy({ left: direction === 'left' ? -itemWidth : itemWidth, behavior: 'smooth' });
  };

  const scrollToIndex = (index: number) => {
    const container = carouselRef.current;
    const firstItem = container?.querySelector('.portfolio-item') as HTMLElement | null;
    if (!container || !firstItem) return;
    container.scrollTo({ left: index * (firstItem.offsetWidth + 24), behavior: 'smooth' });
  };

  return (
    <section className="section portfolio-section" id="portfolio">
      <div className="container">
        <div className="portfolio-header-wrapper">
          <div className="portfolio-header-text">
            <motion.span className="section-badge" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              {t('portfolio.badge')}
            </motion.span>
            <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              {t('portfolio.title')} <span>{t('portfolio.titleAccent')}</span>
            </motion.h2>
            <motion.p className="section-subtitle" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              {t('portfolio.subtitle')}
            </motion.p>
          </div>

          <div className="portfolio-nav-container">
            <div className="project-counter-pill">
              <Layers size={15} className="counter-icon" />
              <span><strong>{String(filteredProjects.length ? currentIndex + 1 : 0).padStart(2, '0')}</strong> / {String(filteredProjects.length).padStart(2, '0')} {t('portfolio.projects')}</span>
            </div>
            <div className="carousel-nav-buttons">
              <button className={`nav-btn ${!canScrollLeft ? 'nav-btn-disabled' : ''}`} onClick={() => scroll('left')} disabled={!canScrollLeft} aria-label={t('portfolio.previous')}><ChevronLeft size={20} /></button>
              <button className={`nav-btn ${!canScrollRight ? 'nav-btn-disabled' : ''}`} onClick={() => scroll('right')} disabled={!canScrollRight} aria-label={t('portfolio.next')}><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>

        {categories.length > 1 && (
          <div className="portfolio-categories">
            {categories.map((category) => {
              const count = category === '__all__' ? projects.length : projects.filter((project) => project.category === category).length;
              return (
                <button key={category} className={`category-pill ${selectedCategory === category ? 'active' : ''}`} onClick={() => handleCategoryChange(category)}>
                  <span>{category === '__all__' ? t('portfolio.all') : category}</span><span className="category-count">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        <PhotoProvider maskOpacity={0.88} bannerVisible={false} speed={() => 300}>
          <div className="portfolio-carousel" ref={carouselRef} data-lenis-prevent="true" tabIndex={0} onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') scroll('left');
            if (event.key === 'ArrowRight') scroll('right');
          }}>
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => {
                const hasValidLink = Boolean(project.link && project.link !== '#');
                const localizedDescription = i18n.resolvedLanguage === 'en'
                  ? project.descriptionEn || project.description
                  : i18n.resolvedLanguage === 'es'
                    ? project.descriptionEs || project.description
                    : project.description;
                return (
                  <motion.div key={project.id} className="portfolio-item" layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}>
                    <div className="glass-panel portfolio-card">
                      <div className="portfolio-image-wrapper">
                        <PhotoView src={project.image}>
                          <div className="portfolio-image-container">
                            <img src={project.image} alt={project.title} className="portfolio-image" loading="lazy" referrerPolicy="no-referrer" />
                            <div className="portfolio-image-overlay"><div className="overlay-badge"><Maximize2 size={16} /><span>{t('portfolio.zoomPreview')}</span></div></div>
                          </div>
                        </PhotoView>
                        <span className="project-category-tag">{project.category}</span>
                      </div>
                      <div className="portfolio-info">
                        <h3 className="portfolio-title">{project.title}</h3>
                        <p className="portfolio-desc">{localizedDescription}</p>
                        <div className="portfolio-tags">{project.tags.map((tag) => <span key={tag} className="tech-tag">{tag}</span>)}</div>
                        <div className="portfolio-card-actions">
                          <PhotoView src={project.image}><button className="card-btn card-btn-secondary" title={t('portfolio.zoomImage')}><Maximize2 size={15} /><span>{t('portfolio.details')}</span></button></PhotoView>
                          {hasValidLink && <a href={project.link!} target="_blank" rel="noopener noreferrer" className="card-btn card-btn-primary" title={t('portfolio.visitTitle')}><span>{t('portfolio.visit')}</span><ExternalLink size={14} /></a>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {!loading && (error || filteredProjects.length === 0) && <p style={{ width: '100%', textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0' }}>{error ? t('portfolio.loadError') : t('portfolio.empty')}</p>}
            {loading && (
              <div style={{ width: '100%', gridColumn: '1 / -1', display: 'flex', justifyContent: 'center' }}>
                <KsiLoader
                  kicker={t('nav.portfolio')}
                  title={t('portfolio.loadingTitle')}
                  message={t('portfolio.loadingMessage')}
                  minHeight="320px"
                />
              </div>
            )}
          </div>
        </PhotoProvider>

        {filteredProjects.length > 0 && <div className="portfolio-footer-controls">
          <div className="carousel-progress-track"><div className="carousel-progress-bar" style={{ width: `${Math.max(scrollProgress * 100, 100 / filteredProjects.length)}%` }} /></div>
          <div className="carousel-dots-wrapper">{filteredProjects.map((project, dotIndex) => <button key={project.id} className={`carousel-dot ${currentIndex === dotIndex ? 'active' : ''}`} onClick={() => scrollToIndex(dotIndex)} aria-label={t('portfolio.goTo', { number: dotIndex + 1 })} />)}</div>
        </div>}
      </div>
    </section>
  );
}
