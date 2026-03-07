import { motion } from 'motion/react';

export default function AboutFounder() {
  return (
    <section className="section" id="sobre">
      <div className="container">
        <div className="founder-grid">
          <motion.div 
            className="founder-info"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>Saymon Felipe</h2>
            <p>
              Fundador da Kinetic Solutions, Saymon Felipe é um visionário em tecnologia e inovação. 
              Com anos de experiência em desenvolvimento de software e soluções digitais, ele lidera 
              a KSI com a missão de transformar ideias complexas em plataformas intuitivas e de alto impacto.
            </p>
            <p>
              "Nossa visão nos move, nossa expertise te guia. Entregamos soluções dinâmicas para o ritmo 
              do seu negócio, garantindo a confiança que você precisa para ir além."
            </p>
            <a href="https://linkedin.com/in/saymonfelipe" target="_blank" rel="noreferrer" className="btn btn-primary hover-target">
              <i className="fa-brands fa-linkedin"></i> Conectar
            </a>
          </motion.div>
          
          <motion.div 
            className="founder-image-container"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-panel" style={{ padding: '20px' }}>
              <img 
                src="/foto-saymon.webp" 
                alt="Saymon Felipe - Fundador" 
                className="founder-image"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
