import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import OrganicSphere from './OrganicSphere';

export default function Hero() {
  /* Adicionado: Controle de estado e ciclo de vida para a alternância de texto */
  const [textIndex, setTextIndex] = useState(0);
  const titles = ["KINETIC SOLUTIONS.", "DIGITAL CONCEPTS."];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % titles.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section" id="home" style={{ position: 'relative', overflow: 'hidden' }}>
      
      <OrganicSphere />

      <motion.div 
        className="bg-text"
        initial={{ opacity: 0, x: '-50vw', y: '-10px' }}
        animate={{ opacity: 0.80, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        KINETIC
      </motion.div>
      <motion.div 
        className="bg-text-2"
        initial={{ opacity: 0, x: '50vw', y: '10px' }}
        animate={{ opacity: 0.80, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      >
        SOLUTIONS
      </motion.div>
      
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <h1 className="hero-title">
            FORÇA DA INOVAÇÃO. IDEIAS DO FUTURO.<br />
            <span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={textIndex}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{ display: 'inline-block' }}
                >
                  {titles[textIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
          
          <div className="hero-actions">
            <a href="#contato" className="btn btn-primary hover-target">
              ORÇAMENTO GRATUITO
            </a>
            <a href="#portfolio" className="btn btn-secondary hover-target">
              VER CLIENTES
            </a>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        style={{ position: 'absolute', bottom: '2rem', zIndex: 10 }}
      >
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <div>Scroll</div>
      </motion.div>
    </section>
  );
}