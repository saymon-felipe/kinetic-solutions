import { motion } from 'motion/react';

const services = [
  {
    id: 'Desenvolvimento Web',
    icon: 'fa-solid fa-code',
    title: 'Desenvolvimento Web',
    description: 'Criação de sites e sistemas web escaláveis e de alta performance.'
  },
  {
    id: 'Aplicativos Mobile',
    icon: 'fa-solid fa-mobile-screen',
    title: 'Aplicativos Mobile',
    description: 'Aplicativos nativos e híbridos para iOS e Android.'
  },
  {
    id: 'Consultoria em TI',
    icon: 'fa-solid fa-server',
    title: 'Consultoria em TI',
    description: 'Arquitetura de software e soluções em nuvem.'
  },
  {
    id: 'UI/UX Design',
    icon: 'fa-solid fa-pen-nib',
    title: 'UI/UX Design',
    description: 'Design de interfaces focadas na experiência do usuário.'
  }
];

export default function Services() {
  const handleServiceClick = (serviceTitle: string) => {
    const event = new CustomEvent('selectService', { detail: { service: serviceTitle } });
    window.dispatchEvent(event);
    
    const contactSection = document.getElementById('contato');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section" id="servicos">
      <div className="container">
        <motion.h2 
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Nossos <span>Serviços</span>
        </motion.h2>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleServiceClick(service.title)}
              style={{ cursor: 'pointer' }}
            >
              <div className="service-icon">
                <i className={service.icon}></i>
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}