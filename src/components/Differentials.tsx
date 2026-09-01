import { motion } from 'motion/react';
import { Zap, ShieldCheck, Target, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const differentials = [
  {
    icon: Zap,
  },
  {
    icon: Target,
  },
  {
    icon: ShieldCheck,
  },
  {
    icon: RefreshCw,
  }
];

export default function Differentials() {
  const { t } = useTranslation();
  return (
    <section className="section differentials-section" id="diferenciais">
      <div className="container">
        <div className="section-header-center">
          <motion.span 
            className="section-badge"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('differentials.badge')}
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {t('differentials.title')} <span>{t('differentials.titleAccent')}</span>
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {t('differentials.subtitle')}
          </motion.p>
        </div>

        <div className="differentials-grid">
          {differentials.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                className="differential-card glass-panel"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className="differential-top">
                  <div className="differential-icon-box">
                    <Icon size={22} className="differential-icon" />
                  </div>
                  <span className="differential-badge">{t(`differentials.items.${index}.badge`)}</span>
                </div>
                <h3 className="differential-title">{t(`differentials.items.${index}.title`)}</h3>
                <p className="differential-desc">{t(`differentials.items.${index}.description`)}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Métricas / Social Proof Banner */}
        <motion.div 
          className="metrics-banner glass-panel"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="metric-item">
            <span className="metric-number">+17</span>
            <span className="metric-label">{t('differentials.metrics.0')}</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <span className="metric-number">99.9%</span>
            <span className="metric-label">{t('differentials.metrics.1')}</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <span className="metric-number">100%</span>
            <span className="metric-label">{t('differentials.metrics.2')}</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <span className="metric-number">{t('differentials.agile')}</span>
            <span className="metric-label">{t('differentials.metrics.3')}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
