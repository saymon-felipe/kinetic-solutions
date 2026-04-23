import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/blog.css';

export default function AdminLogin() {
  const navigate = useNavigate();

  const loginAdmin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
        try {
            await api.post('/users/google-login', { token: codeResponse.code });
            
            const resUser = await api.get('/users');
            const user = resUser.data.returnObj || resUser.data;
            
            if (user && user.admin) {
                navigate('/admin');
            } else {
                await api.get('/users/logout');
                alert('Acesso negado. Sua conta não possui nível administrativo.');
            }
        } catch (error) {
            alert('Falha ao processar o login com o Google.');
        }
    },
    flow: 'auth-code',
    scope: 'openid email profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read',
    prompt: 'consent'
  });

  return (
    <div className="login-container">
      <div className="admin-card text-center login-card" style={{ maxWidth: '400px' }}>
        <img src="/img/ksi.png" alt="KSI" style={{ width: '100px', margin: '0 auto 24px', display: 'block' }} />
        <h2 className="blog-title" style={{ fontSize: '2rem', marginBottom: '32px' }}>Acesso Restrito</h2>
        
        <button 
          onClick={() => loginAdmin()} 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '16px' }}
        >
          Acessar Workspace
        </button>
      </div>
    </div>
  );
}