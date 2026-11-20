import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CheckCircle2, Cpu, HardDrive, MapPin, MessageCircle, MonitorCog, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { techWhatsappUrl } from '../utils/whatsapp';
import '../styles/tech.css';

const copy = {
  pt: {
    title: 'Manutenção de computadores em Londrina | KSI TECH', description: 'Formatação, otimização e manutenção de computadores em Londrina e região. Converse com a KSI TECH pelo WhatsApp.',
    badge: 'Suporte técnico com atenção aos detalhes', hero: 'Manutenção de computadores e notebooks em Londrina.', intro: 'Formatação, otimização, limpeza e reparos. Consulte a possibilidade de atendimento em domicílio na sua região.', cta: 'Pedir orçamento no WhatsApp', explore: 'Conheça os serviços', location: 'Londrina e região',
    servicesLabel: 'O que fazemos', servicesTitle: 'Cuidado para cada necessidade', servicesIntro: 'Soluções para recuperar o desempenho e manter seu equipamento pronto para a rotina.',
    services: [['Formatação', 'Instalação e configuração do sistema conforme a necessidade do equipamento.'], ['Otimização', 'Ajustes para melhorar o funcionamento e a experiência de uso.'], ['Limpeza', 'Limpeza simples ou completa, definida após avaliação do equipamento.'], ['Troca de peças', 'Avaliação e substituição de componentes conforme a necessidade.'], ['Pequenos reparos', 'Reparos pontuais em carcaças, sujeitos à avaliação.']],
    processLabel: 'Como funciona', processTitle: 'Simples do primeiro contato à solução', steps: [['Conte o que acontece', 'Envie uma mensagem e descreva o equipamento e o problema.'], ['Avaliamos juntos', 'Entendemos a necessidade e orientamos sobre as possibilidades.'], ['Aprove o orçamento', 'Combinamos a forma de atendimento e você aprova o orçamento antes do serviço.']],
    coverageLabel: 'Onde atendemos', coverageTitle: 'Perto de você, em Londrina e região.', coverageText: 'A possibilidade de visita é avaliada conforme o bairro e o serviço. Fale com a gente para combinar a melhor forma de atendimento.',
    faqLabel: 'Dúvidas frequentes', faqTitle: 'Antes de começar', faqs: [['Preciso saber qual é o problema?', 'Não. Conte os sintomas e o modelo do equipamento, se souber. Vamos ajudar a entender a necessidade.'], ['Qual limpeza meu equipamento precisa?', 'A limpeza simples ou completa é definida após a avaliação do equipamento.'], ['Vocês fazem atendimento no local?', 'A possibilidade de visita depende do bairro e do tipo de serviço. Consulte pelo WhatsApp.'], ['Como funciona o orçamento?', 'Após entender o problema, combinamos os próximos passos e apresentamos o orçamento para sua aprovação.'], ['Preciso fazer backup antes da formatação?', 'Converse com a KSI sobre seus arquivos e o backup antes de autorizar a formatação.']],
    finalLabel: 'Vamos conversar?', finalTitle: 'Seu equipamento pode contar com a KSI TECH.', finalText: 'Conte o que você precisa e vamos avaliar o melhor caminho.',
  },
  en: {
    title: 'KSI TECH | Care for your computer', description: 'Computer formatting, optimization and maintenance in Londrina and the surrounding area. Talk to KSI TECH on WhatsApp.',
    badge: 'Technical support with attention to detail', hero: 'Your computer deserves to work well.', intro: 'From slow performance to minor repairs, we care for your device with a careful assessment and clear guidance.', cta: 'Chat on WhatsApp', explore: 'Explore services', location: 'Londrina and surrounding area',
    servicesLabel: 'What we do', servicesTitle: 'Care for every need', servicesIntro: 'Solutions to restore performance and keep your device ready for everyday life.',
    services: [['System formatting', 'System installation and configuration according to your device’s needs.'], ['Optimization', 'Adjustments to improve performance and your experience.'], ['Cleaning', 'Basic or full cleaning, determined after assessing the device.'], ['Parts replacement', 'Assessment and replacement of components as needed.'], ['Minor repairs', 'Targeted casing repairs, subject to assessment.']],
    processLabel: 'How it works', processTitle: 'Simple from first contact to solution', steps: [['Tell us what is happening', 'Send a message describing your device and the problem.'], ['We assess together', 'We understand your needs and explain the possibilities.'], ['Approve the quote', 'We arrange the service and you approve the quote before work begins.']],
    coverageLabel: 'Service area', coverageTitle: 'Close to you in Londrina and beyond.', coverageText: 'Visit availability is assessed according to the neighborhood and service. Contact us to arrange the best way to help.',
    faqLabel: 'Frequently asked questions', faqTitle: 'Before we begin', faqs: [['Do I need to know what is wrong?', 'No. Tell us the symptoms and device model, if you know it. We will help understand what is needed.'], ['What kind of cleaning does my device need?', 'Basic or full cleaning is determined after assessing the device.'], ['Do you provide on-site service?', 'Visit availability depends on the neighborhood and service. Ask us on WhatsApp.'], ['Can you replace parts or repair the casing?', 'Yes. Parts replacement and minor casing repairs are subject to assessment.']],
    finalLabel: 'Shall we talk?', finalTitle: 'Your device can count on KSI TECH.', finalText: 'Tell us what you need and we will assess the best way forward.',
  },
  es: {
    title: 'KSI TECH | Cuidado para tu computadora', description: 'Formateo, optimización y mantenimiento de computadoras en Londrina y alrededores. Habla con KSI TECH por WhatsApp.',
    badge: 'Soporte técnico con atención al detalle', hero: 'Tu computadora merece funcionar bien.', intro: 'Desde la lentitud hasta pequeñas reparaciones, cuidamos tu equipo con una evaluación cuidadosa y orientación clara.', cta: 'Hablar por WhatsApp', explore: 'Conoce los servicios', location: 'Londrina y alrededores',
    servicesLabel: 'Qué hacemos', servicesTitle: 'Cuidado para cada necesidad', servicesIntro: 'Soluciones para recuperar el rendimiento y mantener tu equipo listo para el día a día.',
    services: [['Formateo', 'Instalación y configuración del sistema según las necesidades del equipo.'], ['Optimización', 'Ajustes para mejorar el funcionamiento y la experiencia de uso.'], ['Limpieza', 'Limpieza simple o completa, definida tras evaluar el equipo.'], ['Cambio de piezas', 'Evaluación y sustitución de componentes según sea necesario.'], ['Pequeñas reparaciones', 'Reparaciones puntuales de carcasa, sujetas a evaluación.']],
    processLabel: 'Cómo funciona', processTitle: 'Simple desde el primer contacto hasta la solución', steps: [['Cuéntanos qué sucede', 'Envía un mensaje describiendo el equipo y el problema.'], ['Evaluamos juntos', 'Entendemos tu necesidad y explicamos las posibilidades.'], ['Aprueba el presupuesto', 'Coordinamos el servicio y apruebas el presupuesto antes de comenzar.']],
    coverageLabel: 'Zona de atención', coverageTitle: 'Cerca de ti, en Londrina y alrededores.', coverageText: 'La posibilidad de visita se evalúa según el barrio y el servicio. Contáctanos para acordar la mejor forma de atención.',
    faqLabel: 'Preguntas frecuentes', faqTitle: 'Antes de comenzar', faqs: [['¿Debo saber cuál es el problema?', 'No. Cuéntanos los síntomas y el modelo del equipo, si lo conoces. Te ayudaremos a entender lo que necesita.'], ['¿Qué limpieza necesita mi equipo?', 'La limpieza simple o completa se define tras evaluar el equipo.'], ['¿Ofrecen atención a domicilio?', 'La posibilidad de visita depende del barrio y del servicio. Consulta por WhatsApp.'], ['¿Pueden cambiar piezas o reparar la carcasa?', 'Sí. El cambio de piezas y las pequeñas reparaciones de carcasa están sujetos a evaluación.']],
    finalLabel: '¿Hablamos?', finalTitle: 'Tu equipo puede contar con KSI TECH.', finalText: 'Cuéntanos qué necesitas y evaluaremos el mejor camino.',
  },
};

export default function Tech() {
  const { i18n } = useTranslation();
  const reducedMotion = useReducedMotion();
  const reveal = (delay = 0) => reducedMotion ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.5, delay } };
  const language = i18n.resolvedLanguage?.split('-')[0];
  const c = copy[language === 'en' || language === 'es' ? language : 'pt'];
  const heroRef = useRef<HTMLElement>(null);
  const finalRef = useRef<HTMLElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);

  useEffect(() => {
    const hero = heroRef.current;
    const final = finalRef.current;
    if (!hero || !final || typeof IntersectionObserver === 'undefined') return;
    let heroVisible = true;
    let finalVisible = false;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === final) finalVisible = entry.isIntersecting;
      });
      setShowSticky(!heroVisible && !finalVisible);
    }, { threshold: 0 });
    observer.observe(hero);
    observer.observe(final);
    return () => observer.disconnect();
  }, []);

  const icons = [MonitorCog, Sparkles, ShieldCheck, Cpu, Wrench];
  return <main className="tech-page">
    <Helmet><title>{c.title}</title><meta name="description" content={c.description} /><link rel="canonical" href="https://kineticsolutions.com.br/tech" /></Helmet>
    <section className="tech-hero tech-wrap" ref={heroRef}>
      <motion.div className="tech-hero-copy" {...reveal()}><span className="tech-eyebrow"><span /> {c.badge}</span><h1>{c.hero}</h1><p>{c.intro}</p><div className="tech-actions"><a id="tech-hero-whatsapp" data-tech-cta className="tech-button" href={techWhatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} /> {c.cta} <ArrowRight size={18} /></a><a className="tech-text-link" href="#tech-servicos">{c.explore} <ArrowRight size={16} /></a></div><div className="tech-location"><MapPin size={16} /> {c.location}</div></motion.div>
      <motion.div {...reveal(0.15)} className="tech-visual" aria-hidden="true"><div className="tech-visual-orbit tech-orbit-one" /><div className="tech-visual-orbit tech-orbit-two" /><div className="tech-device"><div className="tech-device-screen"><Cpu size={72} strokeWidth={1} /><span>KSI / TECH</span></div><div className="tech-device-base" /></div><div className="tech-visual-chip"><CheckCircle2 size={18} /> KSI TECH</div><div className="tech-visual-dot" /></motion.div>
    </section>
    <section className="tech-section tech-wrap" id="tech-servicos"><motion.div className="tech-heading" {...reveal()}><span className="tech-kicker">01 / {c.servicesLabel}</span><h2>{c.servicesTitle}</h2><p>{c.servicesIntro}</p></motion.div><div className="tech-services">{c.services.map(([title, text], i) => { const Icon = icons[i]; return <motion.article className="tech-card" key={title} {...reveal(i * 0.08)} whileHover={reducedMotion ? undefined : { y: -6 }}><div className="tech-card-top"><span className="tech-icon"><Icon size={23} /></span><span className="tech-number">0{i + 1}</span></div><h3>{title}</h3><p>{text}</p></motion.article>; })}</div></section>
    <section className="tech-section tech-process"><div className="tech-wrap"><motion.div className="tech-heading" {...reveal()}><span className="tech-kicker">02 / {c.processLabel}</span><h2>{c.processTitle}</h2></motion.div><div className="tech-steps">{c.steps.map(([title, text], i) => <motion.article key={title} {...reveal(i * 0.1)}><span className="tech-step-number">0{i + 1}</span><h3>{title}</h3><p>{text}</p></motion.article>)}</div></div></section>
    <section className="tech-section tech-wrap"><motion.div className="tech-coverage" {...reveal()}><div><span className="tech-kicker">03 / {c.coverageLabel}</span><h2>{c.coverageTitle}</h2><p>{c.coverageText}</p></div><div className="tech-map" aria-hidden="true"><div className="tech-map-ring"><MapPin size={38} /></div><span>LONDRINA / PR</span></div></motion.div></section>
    <section className="tech-section tech-wrap tech-faq"><motion.div className="tech-heading" {...reveal()}><span className="tech-kicker">04 / {c.faqLabel}</span><h2>{c.faqTitle}</h2></motion.div><div>{c.faqs.map(([question, answer], index) => {
      const isOpen = openFaqs.includes(index);
      return <div className="tech-faq-item" key={index}>
        <button className="tech-faq-question" type="button" aria-expanded={isOpen} aria-controls={`tech-faq-answer-${index}`} onClick={() => setOpenFaqs(current => isOpen ? current.filter(item => item !== index) : [...current, index])}>
          {question}<span aria-hidden="true">+</span>
        </button>
        <div id={`tech-faq-answer-${index}`} className={`tech-faq-answer${isOpen ? ' is-open' : ''}`} aria-hidden={!isOpen} inert={!isOpen}>
          <div><p>{answer}</p></div>
        </div>
      </div>;
    })}</div></section>
    <section className="tech-wrap tech-final" ref={finalRef}><motion.div {...reveal()}><span className="tech-kicker">{c.finalLabel}</span><h2>{c.finalTitle}</h2><p>{c.finalText}</p></motion.div><a id="tech-final-whatsapp" data-tech-cta className="tech-button tech-button-light" href={techWhatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} /> {c.cta} <ArrowRight size={18} /></a><HardDrive className="tech-final-icon" size={170} strokeWidth={0.7} aria-hidden="true" /></section>
    {showSticky && <div className="tech-sticky"><a id="tech-sticky-whatsapp" data-tech-cta className="tech-button" href={techWhatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} /> {c.cta} <ArrowRight size={18} /></a></div>}
  </main>;
}

