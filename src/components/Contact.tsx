import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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

  useEffect(() => {
    const handleServiceSelect = (e: CustomEvent<{ service: string }>) => {
      setFormData(prev => ({ ...prev, requestType: e.detail.service }));
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
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="section" id="contato">
      <div className="container">
        <motion.h2 
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Fale <span>Conosco</span>
        </motion.h2>

        <motion.div 
          className="glass-panel"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}
        >
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefone</label>
              <input type="tel" id="phone" name="tel" value={formData.tel} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="service">Serviço de Interesse</label>
              <select id="service" name="requestType" value={formData.requestType} onChange={handleChange}>
                <option value="">Selecione um serviço</option>
                <option value="Desenvolvimento Web">Desenvolvimento Web</option>
                <option value="Aplicativos Mobile">Aplicativos Mobile</option>
                <option value="Consultoria em TI">Consultoria em TI</option>
                <option value="UI/UX Design">UI/UX Design</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Mensagem</label>
              <textarea id="message" name="obs" rows={5} value={formData.obs} onChange={handleChange} required></textarea>
            </div>

            <button type="submit" className="btn btn-primary hover-target" disabled={status === 'loading'} style={{ width: '100%', marginTop: '1rem' }}>
              {status === 'loading' ? 'Enviando...' : 'Enviar Mensagem'}
            </button>

            {status === 'success' && <p style={{ color: '#4ade80', marginTop: '1rem', textAlign: 'center' }}>Mensagem enviada com sucesso!</p>}
            {status === 'error' && <p style={{ color: '#f87171', marginTop: '1rem', textAlign: 'center' }}>Erro ao enviar. Tente novamente.</p>}
          </form>
        </motion.div>
      </div>
    </section>
  );
}