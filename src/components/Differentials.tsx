import { motion } from 'motion/react';
import { Zap, ShieldCheck, Target, RefreshCw } from 'lucide-react';

const differentials = [
  {
    icon: Zap,
    title: 'Performance & Velocidade',
    description: 'Aplicações ultra-rápidas desenvolvidas com tecnologias modernas, otimizadas para carregamento instantâneo e máxima retenção.',
    badge: 'Máxima Eficiência'
  },
  {
    icon: Target,
    title: 'Design Focado em Conversão',
    description: 'Interfaces intuitivas e elegantes criadas para encantar usuários, guiar a navegação e transformar visitantes em clientes.',
    badge: 'UX / UI Estratégico'
  },
  {
    icon: ShieldCheck,
    title: 'Arquitetura Robusta & Segura',
    description: 'Sistemas estruturados para crescer com o seu negócio, garantindo segurança de dados, alta disponibilidade e código limpo.',
    badge: 'Pronto para Escalar'
  },
  {
    icon: RefreshCw,
    title: 'Suporte & Evolução Contínua',
    description: 'Acompanhamento próximo em todas as etapas, desde a concepção e lançamento até novas funcionalidades e melhorias contínuas.',
    badge: 'Parceria Estratégica'
  }
];

export default function Differentials() {
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
            POR QUE A KINETIC SOLUTIONS
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Engenharia Digital Que <span>Gera Resultados</span>
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Combinamos precisão técnica, design moderno e estratégia de negócios para construir plataformas que impulsionam empresas.
          </motion.p>
        </div>

        <div className="differentials-grid">
          {differentials.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
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
                  <span className="differential-badge">{item.badge}</span>
                </div>
                <h3 className="differential-title">{item.title}</h3>
                <p className="differential-desc">{item.description}</p>
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
            <span className="metric-label">Projetos & Sistemas</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <span className="metric-number">99.9%</span>
            <span className="metric-label">Uptime & Estabilidade</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <span className="metric-number">100%</span>
            <span className="metric-label">Soluções Sob Medida</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <span className="metric-number">Ágil</span>
            <span className="metric-label">Entregas Contínuas</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
