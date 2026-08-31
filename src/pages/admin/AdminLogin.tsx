import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import '../../styles/admin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginAdmin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setLoading(true);
      try {
        await api.post('/users/google-login', { token: codeResponse.code });
        
        const resUser = await api.get('/users');
        const user = resUser.data.returnObj || resUser.data;
        
        if (user && user.admin) {
          navigate('/admin');
        } else {
          await api.get('/users/logout');
          alert('Acesso negado. Sua conta Google autenticada não possui nível de administrador.');
        }
      } catch (error) {
        alert('Falha ao processar a autenticação com o Google.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setLoading(false);
    },
    flow: 'auth-code',
    scope: 'openid email profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read',
    prompt: 'consent'
  });

  return (
    <div className="admin-wrapper" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '24px' }}>
      <div className="admin-ambient-glow" />

      <motion.div 
        className="admin-card text-center" 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          maxWidth: '440px', 
          width: '100%', 
          padding: '48px 36px', 
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.15)',
          border: '1px solid rgba(56, 189, 248, 0.25)' 
        }}
      >
        {/* LOGO KSI EM CONTAINER COM FUNDO BRANCO */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          padding: '12px 24px',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.15)',
          marginBottom: '24px'
        }}>
          <img 
            src="/img/ksi.png" 
            alt="KSI" 
            style={{ 
              height: '42px', 
              width: 'auto',
              display: 'block',
              objectFit: 'contain'
            }} 
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <span className="sidebar-brand-badge" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
            PORTAL ADMINISTRATIVO
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: '14px 0 8px 0', letterSpacing: '0.5px' }}>
          KSI <span style={{ color: 'var(--admin-accent)' }}>WORKSPACE</span>
        </h1>
        
        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '32px' }}>
          Acesso restrito para gestão e inteligência corporativa. Autentique-se com sua conta credenciada.
        </p>
        
        {/* BOTÃO GOOGLE */}
        <button 
          onClick={() => {
            setLoading(true);
            loginAdmin();
          }} 
          disabled={loading}
          className="btn btn-primary" 
          style={{ 
            width: '100%', 
            padding: '16px', 
            background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', 
            color: '#fff', 
            boxShadow: '0 8px 25px rgba(56, 189, 248, 0.35)', 
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontSize: '0.92rem',
            cursor: 'pointer'
          }}
        >
          {loading ? (
            <div style={{ width: '20px', height: '20px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          ) : (
            <>
              {/* Google G icon */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Acessar com Google</span>
            </>
          )}
        </button>

        {/* BADGE DE SEGURANÇA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '28px', color: 'var(--admin-text-dim)', fontSize: '0.75rem' }}>
          <ShieldCheck size={14} color="var(--admin-success)" />
          <span>Conexão Segura & Criptografada KSI Cloud</span>
        </div>
      </motion.div>
    </div>
  );
}