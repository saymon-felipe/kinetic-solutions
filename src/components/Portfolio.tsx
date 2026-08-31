import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { ChevronLeft, ChevronRight, ExternalLink, Maximize2, Layers } from 'lucide-react';

export interface Project {
  id: number;
  title: string;
  category: 'Sistemas & ERPs' | 'Plataformas Web' | 'Mobile Apps' | 'Landing Pages & Sites';
  description: string;
  image: string;
  link: string;
  tags: string[];
}

const allProjects: Project[] = [
  // Sistemas e ERPs
  {
    id: 1,
    title: 'Solutto',
    category: 'Sistemas & ERPs',
    description: 'Sistema ERP integrado de alta complexidade para gestão completa de operações e franquias.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/solutto-thumb_otimizada.webp',
    link: 'https://solutto.com.br',
    tags: ['ERP Corporativo', 'Gestão Multiunidade', 'Cloud']
  },
  {
    id: 2,
    title: 'Solutto - Educacional',
    category: 'Sistemas & ERPs',
    description: 'Portal do aluno e plataforma de gestão acadêmica e financeira para redes educacionais.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/portal-aluno-thumb_otimizada.webp',
    link: 'https://solutto.com.br/segmento-franquia-educacional.aspx',
    tags: ['Portal do Aluno', 'EdTech', 'Franquias']
  },
  {
    id: 3,
    title: 'Solutto - Educacional (V2)',
    category: 'Sistemas & ERPs',
    description: 'Interface modernizada e responsiva com foco na experiência do aluno e agilidade do corpo docente.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/portal-aluno-2-thumb_otimizada.webp',
    link: 'https://solutto.com.br/segmento-franquia-educacional.aspx',
    tags: ['UI/UX Redesign', 'Gestão Acadêmica', 'Dashboard']
  },
  {
    id: 4,
    title: 'Gourmetech',
    category: 'Sistemas & ERPs',
    description: 'Sistema ERP especializado em varejo alimentício e food service com controle de pedidos em tempo real.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/gourmetech_otimizada.webp',
    link: '',
    tags: ['Food Service', 'PDV & Estoque', 'Gestão Comercial']
  },
  {
    id: 5,
    title: 'BCD Aliança',
    category: 'Plataformas Web',
    description: 'Plataforma EAD robusta com streaming de aulas, emissão de certificados e painel do instrutor.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/bcd-alianca-system_otimizada.webp',
    link: '',
    tags: ['Plataforma EAD', 'LMS', 'Cursos Online']
  },
  {
    id: 6,
    title: 'Sistema AgendasPro',
    category: 'Sistemas & ERPs',
    description: 'Painel administrativo avançado para gestão multi-profissionais, automação de horários e métricas.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/agendaspro-sistema_otimizada.webp',
    link: '',
    tags: ['Painel Admin', 'Automação', 'Gestão de Clientes']
  },
  {
    id: 7,
    title: 'AgendasPro',
    category: 'Plataformas Web',
    description: 'Plataforma SaaS para agendamentos inteligentes e notificações automáticas para prestadores de serviços.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/agendaspro_otimizada.webp',
    link: '',
    tags: ['SaaS', 'Agendamento Online', 'Alta Conversão']
  },
  {
    id: 8,
    title: 'Sistema Kadem',
    category: 'Sistemas & ERPs',
    description: 'Dashboard corporativo voltado ao controle de produtividade, metas e fluxos de trabalho em equipe.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/kadem-system_otimizada.webp',
    link: '',
    tags: ['Produtividade', 'Workflow', 'Métricas de Equipe']
  },
  {
    id: 9,
    title: 'Kadem',
    category: 'Plataformas Web',
    description: 'Plataforma colaborativa para organização de projetos e aceleração de entregas empresariais.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/kadem_otimizada.webp',
    link: '',
    tags: ['Gestão de Projetos', 'Colaboração', 'Cloud']
  },
  {
    id: 10,
    title: 'Mokaly - Sistema',
    category: 'Sistemas & ERPs',
    description: 'Painel de controle analítico para configuração e monitoramento de eventos interativos.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/sistema-mokaly-thumb_otimizada.webp',
    link: 'https://mokaly.com/',
    tags: ['Painel Analítico', 'Live Analytics', 'Gamificação']
  },
  {
    id: 11,
    title: 'Mokaly',
    category: 'Plataformas Web',
    description: 'Plataforma interativa para engajamento de audiências em conferências e treinamentos corporativos.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/mokaly-thumb_otimizada.webp',
    link: 'https://mokaly.com/',
    tags: ['Engajamento', 'Interatividade', 'Web Platform']
  },
  {
    id: 12,
    title: 'Compra Rápida',
    category: 'Mobile Apps',
    description: 'Aplicativo mobile moderno para compras com leitor de código de barras, checkout ágil e delivery local.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/compra-rapida_otimizada.webp',
    link: '',
    tags: ['Mobile App', 'iOS & Android', 'E-commerce']
  },
  {
    id: 13,
    title: 'Mania Mania',
    category: 'Landing Pages & Sites',
    description: 'Vitrine virtual e catálogo digital interativo para indústria de doces, biscoitos e confeitaria.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/mania-mania_otimizada.webp',
    link: '',
    tags: ['Catálogo Digital', 'Vitrine Virtual', 'UI Comercial']
  },
  {
    id: 14,
    title: 'CDA E-sports',
    category: 'Plataformas Web',
    description: 'Portal institucional de alta performance para organização profissional de esportes eletrônicos.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/cda-thumb_otimizada.webp',
    link: '',
    tags: ['Gaming & E-sports', 'High Performance', 'Design Futurista']
  },
  {
    id: 15,
    title: 'Advocacia Geunon',
    category: 'Landing Pages & Sites',
    description: 'Site institucional corporativo para escritório de advocacia com foco em autoridade e captação de clientes.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/advocacia-geunon_otimizada.webp',
    link: '',
    tags: ['Site Institucional', 'Autoridade Jurídica', 'Responsivo']
  },
  {
    id: 16,
    title: 'Sonus Prime',
    category: 'Landing Pages & Sites',
    description: 'Site institucional moderno para agência de tecnologia e serviços digitais em nuvem.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/sonus-prime_otimizada.webp',
    link: '',
    tags: ['Agência Digital', 'Apresentação Corporativa', 'UI/UX']
  },
  {
    id: 17,
    title: 'A Última Passageira',
    category: 'Landing Pages & Sites',
    description: 'Landing page imersiva de alta conversão para divulgação e pré-venda de obra literária.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/a-ultima-passageira_otimizada.webp',
    link: '',
    tags: ['Landing Page', 'Lançamento', 'Foco em Conversão']
  }
];

const categories = [
  'Todos',
  'Sistemas & ERPs',
  'Plataformas Web',
  'Mobile Apps',
  'Landing Pages & Sites'
] as const;

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const carouselRef = useRef<HTMLDivElement>(null);

  const filteredProjects = selectedCategory === 'Todos'
    ? allProjects
    : allProjects.filter(p => p.category === selectedCategory);

  const updateScrollState = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? Math.min(Math.max(scrollLeft / maxScroll, 0), 1) : 0;
    setScrollProgress(progress);

    // Calcular índice aproximado do item visível
    const firstItem = carouselRef.current.querySelector('.portfolio-item') as HTMLElement;
    if (firstItem) {
      const itemWidth = firstItem.offsetWidth + 24; // width + gap
      const index = Math.min(Math.round(scrollLeft / itemWidth), filteredProjects.length - 1);
      setCurrentIndex(Math.max(0, index));
    }
  }, [filteredProjects.length]);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    return () => container.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const firstItem = container.querySelector('.portfolio-item') as HTMLElement;
      if (!firstItem) return;

      const itemWidth = firstItem.offsetWidth + 24; // width + gap
      const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;

      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const firstItem = container.querySelector('.portfolio-item') as HTMLElement;
      if (!firstItem) return;

      const itemWidth = firstItem.offsetWidth + 24;
      container.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
    }
  };

  return (
    <section className="section portfolio-section" id="portfolio">
      <div className="container">
        
        {/* Cabeçalho da Seção */}
        <div className="portfolio-header-wrapper">
          <div className="portfolio-header-text">
            <motion.span 
              className="section-badge"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              CASOS DE SUCESSO & PROJETOS
            </motion.span>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Nossos <span>Trabalhos</span>
            </motion.h2>
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Explore sistemas, aplicativos e plataformas desenvolvidos com foco em alta performance, usabilidade e resultados comerciais.
            </motion.p>
          </div>

          {/* Contador e Botões de Navegação Desktop */}
          <div className="portfolio-nav-container">
            <div className="project-counter-pill">
              <Layers size={15} className="counter-icon" />
              <span>
                <strong>{String(currentIndex + 1).padStart(2, '0')}</strong> / {String(filteredProjects.length).padStart(2, '0')} projetos
              </span>
            </div>

            <div className="carousel-nav-buttons">
              <button 
                className={`nav-btn ${!canScrollLeft ? 'nav-btn-disabled' : ''}`}
                onClick={() => scroll('left')} 
                disabled={!canScrollLeft}
                aria-label="Projeto Anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                className={`nav-btn ${!canScrollRight ? 'nav-btn-disabled' : ''}`}
                onClick={() => scroll('right')} 
                disabled={!canScrollRight}
                aria-label="Próximo Projeto"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Abas de Filtros de Categoria */}
        <div className="portfolio-categories">
          {categories.map((category) => {
            const count = category === 'Todos' 
              ? allProjects.length 
              : allProjects.filter(p => p.category === category).length;
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                className={`category-pill ${isActive ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                <span>{category}</span>
                <span className="category-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Carrossel de Projetos com PhotoProvider */}
        <PhotoProvider
          maskOpacity={0.88}
          bannerVisible={false}
          speed={() => 300}
        >
          <div 
            className="portfolio-carousel" 
            ref={carouselRef} 
            data-lenis-prevent="true"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') scroll('left');
              if (e.key === 'ArrowRight') scroll('right');
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => {
                const hasValidLink = Boolean(project.link && project.link !== '#');

                return (
                  <motion.div
                    key={project.id}
                    className="portfolio-item"
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
                  >
                    <div className="glass-panel portfolio-card">
                      
                      {/* Área da Imagem com Preview e Overlay */}
                      <div className="portfolio-image-wrapper">
                        <PhotoView src={project.image}>
                          <div className="portfolio-image-container">
                            <img 
                              src={project.image} 
                              alt={project.title} 
                              className="portfolio-image" 
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                            <div className="portfolio-image-overlay">
                              <div className="overlay-badge">
                                <Maximize2 size={16} />
                                <span>Ampliar Preview</span>
                              </div>
                            </div>
                          </div>
                        </PhotoView>
                        
                        <span className="project-category-tag">
                          {project.category}
                        </span>
                      </div>

                      {/* Informações do Projeto */}
                      <div className="portfolio-info">
                        <h3 className="portfolio-title">{project.title}</h3>
                        <p className="portfolio-desc">{project.description}</p>
                        
                        {/* Tags de Tecnologias / Destaques */}
                        <div className="portfolio-tags">
                          {project.tags.map((tag) => (
                            <span key={tag} className="tech-tag">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Botões de Ação do Card */}
                        <div className="portfolio-card-actions">
                          <PhotoView src={project.image}>
                            <button className="card-btn card-btn-secondary" title="Ampliar Imagem">
                              <Maximize2 size={15} />
                              <span>Ver Detalhes</span>
                            </button>
                          </PhotoView>

                          {hasValidLink && (
                            <a 
                              href={project.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="card-btn card-btn-primary"
                              title="Visitar Projeto em Produção"
                            >
                              <span>Acessar</span>
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </PhotoProvider>

        {/* Barra de Progresso e Paginação Interativa */}
        <div className="portfolio-footer-controls">
          <div className="carousel-progress-track">
            <div 
              className="carousel-progress-bar" 
              style={{ width: `${Math.max(scrollProgress * 100, 100 / filteredProjects.length)}%` }}
            />
          </div>

          <div className="carousel-dots-wrapper">
            {filteredProjects.map((_, dotIndex) => (
              <button
                key={dotIndex}
                className={`carousel-dot ${currentIndex === dotIndex ? 'active' : ''}`}
                onClick={() => scrollToIndex(dotIndex)}
                aria-label={`Ir para projeto ${dotIndex + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}