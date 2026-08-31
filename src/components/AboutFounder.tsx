import { motion } from 'motion/react';
import { Linkedin, Github, Code, CheckCircle, Sparkles, Quote } from 'lucide-react';

export default function AboutFounder() {
  return (
    <section className="section founder-section" id="sobre">
      <div className="container">
        <div className="founder-grid">
          
          {/* Informações do Fundador */}
          <motion.div 
            className="founder-info"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="section-badge founder-badge">
              <Sparkles size={13} />
              <span>LIDERANÇA & VISÃO TÉCNICA</span>
            </div>

            <h2 className="founder-name">Saymon Felipe</h2>
            <span className="founder-role">Fundador & Arquiteto de Software</span>

            <p className="founder-bio">
              Com sólida experiência em engenharia de software e desenvolvimento de plataformas escaláveis, 
              Saymon Felipe lidera a <strong>Kinetic Solutions (KSI)</strong> com a missão de construir soluções 
              tecnológicas que aliam alta performance de código, arquitetura limpa e design focado no usuário final.
            </p>

            {/* Destaques de Competências */}
            <div className="founder-highlights">
              <div className="highlight-item">
                <CheckCircle size={16} className="highlight-icon" />
                <span>Arquitetura de Sistemas & Cloud</span>
              </div>
              <div className="highlight-item">
                <CheckCircle size={16} className="highlight-icon" />
                <span>Desenvolvimento Full Stack & Mobile</span>
              </div>
              <div className="highlight-item">
                <CheckCircle size={16} className="highlight-icon" />
                <span>Design de Produtos & UX de Conversão</span>
              </div>
            </div>

            {/* Citação / Quote */}
            <div className="founder-quote-box glass-panel">
              <Quote size={20} className="quote-icon" />
              <p>
                "Nossa visão nos move, nossa expertise te guia. Entregamos soluções dinâmicas para o ritmo do seu negócio, garantindo a solidez que você precisa para crescer com segurança."
              </p>
            </div>

            {/* Ações Sociais */}
            <div className="founder-social-actions">
              <a 
                href="https://www.linkedin.com/in/saymonflima/" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary hover-target"
              >
                <Linkedin size={16} />
                <span>Conectar no LinkedIn</span>
              </a>
              <a 
                href="https://github.com/saymon-felipe" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-secondary hover-target"
              >
                <Github size={16} />
                <span>GitHub</span>
              </a>
            </div>
          </motion.div>
          
          {/* Imagem do Fundador com Moldura Tecnológica */}
          <motion.div 
            className="founder-image-wrapper"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="founder-image-card glass-panel">
              <div className="founder-image-frame">
                <img 
                  src="/foto-saymon.webp" 
                  alt="Saymon Felipe - Fundador da Kinetic Solutions" 
                  className="founder-photo"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="founder-card-footer">
                <div className="founder-status-indicator">
                  <span className="status-pulse"></span>
                  <span>Disponível para novos projetos e consultorias</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
