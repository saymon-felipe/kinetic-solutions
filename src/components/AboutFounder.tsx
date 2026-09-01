import { motion } from 'motion/react';
import { Linkedin, Github, Code, CheckCircle, Sparkles, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AboutFounder() {
  const { t } = useTranslation();
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
              <span>{t('founder.badge')}</span>
            </div>

            <h2 className="founder-name">Saymon Felipe</h2>
            <span className="founder-role">{t('founder.role')}</span>

            <p className="founder-bio">
              {t('founder.bio')}
            </p>

            {/* Destaques de Competências */}
            <div className="founder-highlights">
              <div className="highlight-item">
                <CheckCircle size={16} className="highlight-icon" />
                <span>{t('founder.highlights.0')}</span>
              </div>
              <div className="highlight-item">
                <CheckCircle size={16} className="highlight-icon" />
                <span>{t('founder.highlights.1')}</span>
              </div>
              <div className="highlight-item">
                <CheckCircle size={16} className="highlight-icon" />
                <span>{t('founder.highlights.2')}</span>
              </div>
            </div>

            {/* Citação / Quote */}
            <div className="founder-quote-box glass-panel">
              <Quote size={20} className="quote-icon" />
              <p>
                {t('founder.quote')}
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
                <span>{t('founder.linkedin')}</span>
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
                  alt={t('founder.imageAlt')} 
                  className="founder-photo"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="founder-card-footer">
                <div className="founder-status-indicator">
                  <span className="status-pulse"></span>
                  <span>{t('founder.availability')}</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
