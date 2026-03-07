import { motion } from 'motion/react';
import { useRef } from 'react';
/* Adicionado: Imports da biblioteca de visualização de imagens e seu CSS base */
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

const projects = [
  // Sistemas, ERPs e Plataformas (Maior impacto e complexidade)
  {
    id: 1,
    title: 'Solutto',
    description: 'Sistema ERP integrado para gestão de operações comerciais.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/solutto-thumb_otimizada.webp',
    link: '#'
  },
  {
    id: 2,
    title: 'Solutto - Educacional',
    description: 'Portal do aluno e sistema de gestão para franquias educacionais.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/portal-aluno-thumb_otimizada.webp',
    link: 'https://solutto.com.br/segmento-franquia-educacional.aspx'
  },
  {
    id: 3,
    title: 'Solutto - Educacional (Variante)',
    description: 'Interface alternativa para o portal do aluno educacional.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/portal-aluno-2-thumb_otimizada.webp',
    link: 'https://solutto.com.br/segmento-franquia-educacional.aspx'
  },
  {
    id: 4,
    title: 'Gourmetech',
    description: 'Sistema ERP especializado em varejo e food service.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/gourmetech_otimizada.webp',
    link: '#'
  },
  {
    id: 5,
    title: 'BCD Aliança',
    description: 'Plataforma EAD completa para cursos online e gestão de alunos.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/bcd-alianca-system_otimizada.webp',
    link: ''
  },
  {
    id: 6,
    title: 'Sistema AgendasPro',
    description: 'Painel administrativo para controle e gestão de agendamentos.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/agendaspro-sistema_otimizada.webp',
    link: '#'
  },
  {
    id: 7,
    title: 'AgendasPro',
    description: 'Plataforma completa para gestão inteligente de agendamentos.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/agendaspro_otimizada.webp',
    link: '#'
  },
  {
    id: 8,
    title: 'Sistema Kadem',
    description: 'Painel de controle voltado ao gerenciamento de produtividade.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/kadem-system_otimizada.webp',
    link: '#'
  },
  {
    id: 9,
    title: 'Kadem',
    description: 'Plataforma digital para otimização de trabalho e equipes.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/kadem_otimizada.webp',
    link: '#'
  },
  {
    id: 10,
    title: 'Mokaly - Sistema',
    description: 'Painel de gerenciamento da plataforma digital interativa.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/sistema-mokaly-thumb_otimizada.webp',
    link: 'https://mokaly.com/'
  },
  {
    id: 11,
    title: 'Mokaly',
    description: 'Plataforma digital interativa para engajamento e eventos.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/mokaly-thumb_otimizada.webp',
    link: '#'
  },
  // Aplicativos, E-commerce e Institucionais (Foco em conversão e visual)
  {
    id: 12,
    title: 'Compra Rápida',
    description: 'Aplicativo mobile para otimização de compras em mercados locais.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/compra-rapida_otimizada.webp',
    link: ''
  },
  {
    id: 13,
    title: 'Mania Mania',
    description: 'Vitrine virtual e catálogo para fabricante de doces e biscoitos.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/mania-mania_otimizada.webp',
    link: '#'
  },
  {
    id: 14,
    title: 'CDA E-sports',
    description: 'Site institucional de alta performance para time de e-sports.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/cda-thumb_otimizada.webp',
    link: ''
  },
  {
    id: 15,
    title: 'Advocacia Geunon',
    description: 'Site institucional corporativo para escritório de advocacia.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/advocacia-geunon_otimizada.webp',
    link: ''
  },
  {
    id: 16,
    title: 'Sonus Prime',
    description: 'Site institucional para agência de serviços e soluções web.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/sonus-prime_otimizada.webp',
    link: '#'
  },
  {
    id: 17,
    title: 'A Última Passageira',
    description: 'Landing page promocional para lançamento literário.',
    image: 'https://kineticsolutions.s3.sa-east-1.amazonaws.com/a-ultima-passageira_otimizada.webp',
    link: ''
  }
];

export default function Portfolio() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current && carouselRef.current.firstElementChild) {
      const container = carouselRef.current;
      const item = container.firstElementChild as HTMLElement;
      
      const gap = parseFloat(window.getComputedStyle(container).gap) || 0;
      const scrollAmount = item.offsetWidth + gap;
      
      const scrollTo = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
        
      container.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="section" id="portfolio">
      <div className="container">
        <div className="portfolio-header">
          <motion.h2
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 0, textAlign: 'left' }}
          >
            Nossos <span>TRABALHOS</span>
          </motion.h2>

          <div className="carousel-nav">
            <button className="btn btn-secondary hover-target nav-btn" onClick={() => scroll('left')} aria-label="Anterior">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className="btn btn-secondary hover-target nav-btn" onClick={() => scroll('right')} aria-label="Próximo">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Adicionado: PhotoProvider agrupa as imagens para permitir navegação no modal */}
        <PhotoProvider>
          <div className="portfolio-carousel" ref={carouselRef} data-lenis-prevent="true">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="portfolio-item"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="glass-panel portfolio-card">
                  {/* Adicionado: PhotoView transforma a imagem em um gatilho para o modal interativo */}
                  <PhotoView src={project.image}>
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="portfolio-image" 
                      referrerPolicy="no-referrer"
                      style={{ cursor: 'zoom-in' }} 
                    />
                  </PhotoView>
                  <div className="portfolio-info">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </PhotoProvider>
      </div>
    </section>
  );
}