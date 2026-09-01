import { motion } from 'motion/react';
import { Globe, Smartphone, Server, Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const services = [
  {
    id: 'Desenvolvimento Web',
    icon: Globe,
  },
  {
    id: 'Aplicativos Mobile',
    icon: Smartphone,
  },
  {
    id: 'Consultoria em TI',
    icon: Server,
  },
  {
    id: 'UI/UX Design',
    icon: Sparkles,
  }
];

export default function Services() {
  const { t } = useTranslation();
  const handleServiceClick = (serviceTitle: string) => {
    const event = new CustomEvent('selectService', { detail: { service: serviceTitle } });
    window.dispatchEvent(event);
    
    const contactSection = document.getElementById('contato');
    if (contactSection) {
      const headerOffset = 80;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', '/#contato');
    }
  };

  return (
    <section className="section services-section" id="servicos">
      <div className="container">
        
        <div className="section-header-center">
          <motion.span 
            className="section-badge"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('services.badge')}
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {t('services.title')} <span>{t('services.titleAccent')}</span>
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {t('services.subtitle')}
          </motion.p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                className="service-card glass-panel hover-target"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="service-card-top">
                  <div className="service-icon-box">
                    <Icon size={26} className="service-icon-svg" />
                  </div>
                  <div className="service-arrow-btn">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                <h3 className="service-title">{t(`services.items.${index}.title`)}</h3>
                <p className="service-desc">{t(`services.items.${index}.description`)}</p>

                <div className="service-features-list">
                  {[0, 1, 2, 3].map((featureIndex) => (
                    <div key={featureIndex} className="service-feature-pill">
                      <CheckCircle2 size={13} className="check-icon" />
                      <span>{t(`services.items.${index}.features.${featureIndex}`)}</span>
                    </div>
                  ))}
                </div>

                <div className="service-card-action">
                  <span>{t('services.request')}</span>
                  <ArrowUpRight size={15} />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
