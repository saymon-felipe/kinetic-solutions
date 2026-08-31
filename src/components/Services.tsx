import { motion } from 'motion/react';
import { Globe, Smartphone, Server, Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const services = [
  {
    id: 'Desenvolvimento Web',
    icon: Globe,
    title: 'Sistemas & Aplicações Web',
    description: 'Desenvolvimento de ERPs sob medida, portais corporativos, plataformas SaaS e sites de altíssimo desempenho.',
    features: ['ERPs & Dashboards', 'Arquitetura Escalável', 'APIs REST & GraphQL', 'Segurança de Ponta']
  },
  {
    id: 'Aplicativos Mobile',
    icon: Smartphone,
    title: 'Aplicativos Mobile',
    description: 'Criação de aplicativos para iOS e Android com experiência fluida, sincronização offline e integração completa.',
    features: ['iOS & Android Nativo/Híbrido', 'UI/UX Fluido', 'Notificações Push', 'Integração com APIs']
  },
  {
    id: 'Consultoria em TI',
    icon: Server,
    title: 'Cloud & Consultoria Técnica',
    description: 'Otimização de infraestrutura em nuvem, modernização de código legadas, microsserviços e auditoria de performance.',
    features: ['AWS & Google Cloud', 'CI/CD & DevOps', 'Microsserviços & Bancos', 'Auditoria de Performance']
  },
  {
    id: 'UI/UX Design',
    icon: Sparkles,
    title: 'Design UI/UX & Prototipagem',
    description: 'Construção de identidades visuais e interfaces de usuário modernas, intuitivas e focadas na retenção e conversão de clientes.',
    features: ['Design Systems', 'Prototipagem Interativa', 'Testes de Usabilidade', 'Foco em Conversão']
  }
];

export default function Services() {
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
            SOLUÇÕES SOB MEDIDA
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Nossos <span>Serviços</span>
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Tecnologia de ponta e metodologia ágil para construir produtos digitais robustos, velozes e prontos para o futuro.
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

                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.description}</p>

                <div className="service-features-list">
                  {service.features.map((feat) => (
                    <div key={feat} className="service-feature-pill">
                      <CheckCircle2 size={13} className="check-icon" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="service-card-action">
                  <span>Solicitar este serviço</span>
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