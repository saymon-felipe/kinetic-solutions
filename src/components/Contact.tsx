import React, { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, MessageCircle, Mail, Phone, Clock, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tel: '',
    requestType: '',
    obs: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serviceHighlighted, setServiceHighlighted] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const handleServiceSelect = (e: CustomEvent<{ service: string }>) => {
      setFormData(prev => ({ ...prev, requestType: e.detail.service }));
      setServiceHighlighted(true);
      setTimeout(() => setServiceHighlighted(false), 2000);
      if (selectRef.current) {
        selectRef.current.focus();
      }
    };

    window.addEventListener('selectService' as any, handleServiceSelect);
    return () => window.removeEventListener('selectService' as any, handleServiceSelect);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await api.post('/utils/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', tel: '', requestType: '', obs: '' });
      setTimeout(() => setStatus('idle'), 6000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 6000);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Olá! Vim através do site da Kinetic Solutions e gostaria de solicitar um orçamento para um projeto.${formData.requestType ? ` Tenho interesse em: ${formData.requestType}.` : ''}`
  );
  const whatsappUrl = `https://wa.me/5511999999999?text=${whatsappMessage}`; // Link flexível para WhatsApp

  return (
    <section className="section contact-section" id="contato">
      <div className="container">
        
        <div className="section-header-center">
          <motion.span 
            className="section-badge"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            INICIE SEU PROJETO
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Fale <span>Conosco</span>
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Conte-nos sobre sua ideia ou desafio técnico. Nossa equipe responderá rapidamente com uma proposta personalizada.
          </motion.p>
        </div>

        <div className="contact-grid">
          
          {/* Informações de Contato e Vantagens */}
          <motion.div 
            className="contact-info-card glass-panel"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="contact-info-title">Vamos Tirar Sua Ideia do Papel?</h3>
            <p className="contact-info-desc">
              Preencha o formulário ao lado para uma análise técnica detalhada do seu projeto, ou escolha um dos canais diretos abaixo.
            </p>

            <div className="contact-channels">
              <a 
                href="https://wa.me/5511978250274?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20com%20a%20Kinetic%20Solutions." 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-channel-item whatsapp-channel hover-target"
              >
                <div className="channel-icon-box">
                  <MessageCircle size={22} />
                </div>
                <div className="channel-text">
                  <span className="channel-name">WhatsApp Direto</span>
                  <span className="channel-sub">Atendimento ágil em tempo real</span>
                </div>
              </a>

              <div className="contact-channel-item">
                <div className="channel-icon-box">
                  <Mail size={22} />
                </div>
                <div className="channel-text">
                  <span className="channel-name">E-mail Comercial</span>
                  <span className="channel-sub">contato@kineticsolutions.com.br</span>
                </div>
              </div>

              <div className="contact-channel-item">
                <div className="channel-icon-box">
                  <Clock size={22} />
                </div>
                <div className="channel-text">
                  <span className="channel-name">Tempo de Resposta</span>
                  <span className="channel-sub">Em até 2 horas úteis</span>
                </div>
              </div>
            </div>

            <div className="contact-guarantee-badge">
              <Sparkles size={16} className="guarantee-icon" />
              <span>Orçamento 100% gratuito e sem compromisso</span>
            </div>
          </motion.div>

          {/* Formulário de Contato */}
          <motion.div 
            className="contact-form-card glass-panel"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="contact-form">
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nome Completo *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Seu nome ou da sua empresa" 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">E-mail Corporativo *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="seuemail@empresa.com" 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Telefone / WhatsApp</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="tel" 
                    value={formData.tel} 
                    onChange={handleChange} 
                    placeholder="(00) 00000-0000" 
                  />
                </div>

                <div className={`form-group ${serviceHighlighted ? 'highlight-pulse' : ''}`}>
                  <label htmlFor="service">Serviço de Interesse</label>
                  <select 
                    id="service" 
                    name="requestType" 
                    ref={selectRef}
                    value={formData.requestType} 
                    onChange={handleChange}
                  >
                    <option value="">Selecione um serviço</option>
                    <option value="Desenvolvimento Web">Sistemas & Aplicações Web (ERP / SaaS)</option>
                    <option value="Aplicativos Mobile">Aplicativos Mobile (iOS / Android)</option>
                    <option value="Consultoria em TI">Cloud & Consultoria Técnica</option>
                    <option value="UI/UX Design">Design UI/UX & Prototipagem</option>
                    <option value="Outro Projeto">Outro Projeto Personalizado</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Detalhes do Projeto *</label>
                <textarea 
                  id="message" 
                  name="obs" 
                  rows={4} 
                  value={formData.obs} 
                  onChange={handleChange} 
                  placeholder="Fale um pouco sobre o que precisa, prazo estimado e objetivos..."
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary submit-btn hover-target" 
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <span>Enviando Mensagem...</span>
                ) : (
                  <>
                    <span>ENVIAR SOLICITAÇÃO</span>
                    <Send size={16} />
                  </>
                )}
              </button>

              {status === 'success' && (
                <div className="form-feedback success">
                  <CheckCircle2 size={18} />
                  <span>Mensagem enviada com sucesso! Entraremos em contato em breve.</span>
                </div>
              )}

              {status === 'error' && (
                <div className="form-feedback error">
                  <AlertCircle size={18} />
                  <span>Houve um erro ao enviar. Por favor, tente novamente ou use o WhatsApp direto.</span>
                </div>
              )}
            </form>
          </motion.div>

        </div>

      </div>
    </section>
  );
}