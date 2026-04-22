import { useEffect, useState } from 'react';
import { Users, Eye, BarChart2, MapPin, UserPlus, LogIn } from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    visitasMes: 0,
    acessosBlog: 0,
    origens: [],
    localidades: [],
    demografia: [], 
    users: { total: 0, novos_mes: 0, logins_mes: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then(res => setStats(res.data.returnObj || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = [
    { title: 'Sessões (Mês)', value: stats.visitasMes, icon: <Users size={24} color="#3b82f6" /> },
    { title: 'Views do Blog', value: stats.acessosBlog, icon: <Eye size={24} color="#3b82f6" /> },
    { title: 'Total Utilizadores', value: stats.users.total, icon: <Users size={24} color="#10b981" /> },
    { title: 'Novos Registos (Mês)', value: stats.users.novos_mes, icon: <UserPlus size={24} color="#10b981" /> },
    { title: 'Logins (Mês)', value: stats.users.logins_mes, icon: <LogIn size={24} color="#8b5cf6" /> }
  ];

  if (loading) return <div style={{ color: '#a1a1aa' }}>A carregar dados analíticos...</div>;

  return (
    <div>
      <h1 className="blog-title" style={{ fontSize: '2.5rem' }}>Visão Geral</h1>
      <p className="blog-subtitle">Inteligência de Tráfego e Utilizadores KSI.</p>

      {/* Cards de KPIs Principais */}
      <div className="metrics-grid">
        {metrics.map((m, i) => (
          <div key={i} className="admin-card metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              {m.icon}
            </div>
            <h3 style={{ color: '#a1a1aa', fontSize: '0.95rem', fontWeight: 'normal' }}>{m.title}</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Grid de Tabelas Secundárias */}
      <div style={{ display: 'flex', gap: '24px', marginTop: '40px', flexWrap: 'wrap' }}>
        
        {/* Tabela de Geolocalização */}
        <div className="admin-card" style={{ flex: 1.5, minWidth: '350px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="#f43f5e"/> Acessos por Região
          </h2>
          
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ paddingBottom: '16px' }}>Localidade</th>
                  <th style={{ paddingBottom: '16px', textAlign: 'right' }}>Sessões</th>
                </tr>
              </thead>
              <tbody>
                {stats.localidades.length > 0 ? stats.localidades.map((loc: any, index: number) => (
                  <tr key={index} style={{ borderTop: '1px solid #27272a' }}>
                    <td style={{ padding: '16px 0', fontWeight: 'bold' }}>
                      {loc.city}, {loc.region} <span style={{ color: '#a1a1aa', fontSize: '0.8rem', marginLeft: '6px' }}>({loc.country})</span>
                    </td>
                    <td style={{ padding: '16px 0', textAlign: 'right', color: '#f43f5e' }}>{loc.acessos}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={2} style={{ padding: '20px 0', textAlign: 'center', color: '#a1a1aa' }}>Sem dados de localidade registados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Tabela de Demografia (Género) */}
            <div className="admin-card" style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="#8b5cf6"/> Perfil Demográfico
              </h2>
              
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ paddingBottom: '16px' }}>Género</th>
                      <th style={{ paddingBottom: '16px', textAlign: 'right' }}>Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.demografia && stats.demografia.length > 0 ? stats.demografia.map((demo: any, index: number) => (
                      <tr key={index} style={{ borderTop: '1px solid #27272a' }}>
                        <td style={{ padding: '16px 0', fontWeight: 'bold' }}>{demo.sexo}</td>
                        <td style={{ padding: '16px 0', textAlign: 'right', color: '#8b5cf6' }}>{demo.quantidade}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={2} style={{ padding: '20px 0', textAlign: 'center', color: '#a1a1aa' }}>A recolher demografia...</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabela de Origens UTM */}
            <div className="admin-card" style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={20} color="#3b82f6"/> Tráfego (UTM)
              </h2>
              
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ paddingBottom: '16px' }}>Origem</th>
                      <th style={{ paddingBottom: '16px', textAlign: 'right' }}>Acessos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.origens.length > 0 ? stats.origens.map((origem: any, index: number) => (
                      <tr key={index} style={{ borderTop: '1px solid #27272a' }}>
                        <td style={{ padding: '16px 0', textTransform: 'capitalize', fontWeight: 'bold' }}>{origem.utm_source}</td>
                        <td style={{ padding: '16px 0', textAlign: 'right', color: '#3b82f6' }}>{origem.acessos}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={2} style={{ padding: '20px 0', textAlign: 'center', color: '#a1a1aa' }}>Sem campanhas mapeadas.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
}