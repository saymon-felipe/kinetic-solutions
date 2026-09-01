import React, { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, MessageCircle, Mail, Phone, Clock, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t, i18n } = useTranslation();
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
      await api.post('/utils/contact', { ...formData, locale: i18n.resolvedLanguage || 'pt-BR' });
      setStatus('success');
      setFormData({ name: '', email: '', tel: '', requestType: '', obs: '' });
      setTimeout(() => setStatus('idle'), 6000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 6000);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `${t('contact.whatsappMessage')}${formData.requestType ? ` ${formData.requestType}.` : ''}`
  );
  const whatsappUrl = `https://wa.me/5511978250274?text=${whatsappMessage}`;

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
            {t('contact.badge')}
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {t('contact.title')}
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {t('contact.subtitle')}
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
            <h3 className="contact-info-title">{t('contact.infoTitle')}</h3>
            <p className="contact-info-desc">
              {t('contact.infoDescription')}
            </p>

            <div className="contact-channels">
              <a 
                href={whatsappUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-channel-item whatsapp-channel hover-target"
              >
                <div className="channel-icon-box">
                  <MessageCircle size={22} />
                </div>
                <div className="channel-text">
                  <span className="channel-name">{t('contact.whatsapp')}</span>
                  <span className="channel-sub">{t('contact.whatsappDescription')}</span>
                </div>
              </a>

              <div className="contact-channel-item">
                <div className="channel-icon-box">
                  <Mail size={22} />
                </div>
                <div className="channel-text">
                  <span className="channel-name">{t('contact.commercialEmail')}</span>
                  <span className="channel-sub">contato@kineticsolutions.com.br</span>
                </div>
              </div>

              <div className="contact-channel-item">
                <div className="channel-icon-box">
                  <Clock size={22} />
                </div>
                <div className="channel-text">
                  <span className="channel-name">{t('contact.responseTime')}</span>
                  <span className="channel-sub">{t('contact.responseTimeDescription')}</span>
                </div>
              </div>
            </div>

            <div className="contact-guarantee-badge">
              <Sparkles size={16} className="guarantee-icon" />
              <span>{t('contact.guarantee')}</span>
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
                  <label htmlFor="name">{t('contact.name')}</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder={t('contact.namePlaceholder')} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">{t('contact.email')}</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder={t('contact.emailPlaceholder')} 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">{t('contact.phone')}</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="tel" 
                    value={formData.tel} 
                    onChange={handleChange} 
                    placeholder={t('contact.phonePlaceholder')} 
                  />
                </div>

                <div className={`form-group ${serviceHighlighted ? 'highlight-pulse' : ''}`}>
                  <label htmlFor="service">{t('contact.service')}</label>
                  <select 
                    id="service" 
                    name="requestType" 
                    ref={selectRef}
                    value={formData.requestType} 
                    onChange={handleChange}
                  >
                    <option value="">{t('contact.selectService')}</option>
                    <option value="Desenvolvimento Web">{t('contact.services.0')}</option>
                    <option value="Aplicativos Mobile">{t('contact.services.1')}</option>
                    <option value="Consultoria em TI">{t('contact.services.2')}</option>
                    <option value="UI/UX Design">{t('contact.services.3')}</option>
                    <option value="Outro Projeto">{t('contact.services.4')}</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">{t('contact.details')}</label>
                <textarea 
                  id="message" 
                  name="obs" 
                  rows={4} 
                  value={formData.obs} 
                  onChange={handleChange} 
                  placeholder={t('contact.detailsPlaceholder')}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary submit-btn hover-target" 
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <span>{t('contact.sending')}</span>
                ) : (
                  <>
                    <span>{t('contact.send')}</span>
                    <Send size={16} />
                  </>
                )}
              </button>

              {status === 'success' && (
                <div className="form-feedback success">
                  <CheckCircle2 size={18} />
                  <span>{t('contact.success')}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="form-feedback error">
                  <AlertCircle size={18} />
                  <span>{t('contact.error')}</span>
                </div>
              )}
            </form>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
