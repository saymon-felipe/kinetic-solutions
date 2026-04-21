import { useEffect, useState } from 'react';
import { Users, Eye, BarChart2 } from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    visitasMes: 0,
    acessosBlog: 0,
    origens: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then(res => setStats(res.data.returnObj || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = [
    { title: 'Sessões no Mês', value: stats.visitasMes, icon: <Users size={24} color="#3b82f6" /> },
    { title: 'Leituras do Blog', value: stats.acessosBlog, icon: <Eye size={24} color="#3b82f6" /> },
  ];

  if (loading) return <div style={{ color: '#a1a1aa' }}>Carregando dados analíticos...</div>;

  return (
    <div>
      <h1 className="blog-title" style={{ fontSize: '2.5rem' }}>Visão Geral</h1>
      <p className="blog-subtitle">Métricas em tempo real da Kinetic Solutions.</p>

      <div className="metrics-grid">
        {metrics.map((m, i) => (
          <div key={i} className="admin-card metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              {m.icon}
            </div>
            <h3 style={{ color: '#a1a1aa', fontSize: '1rem', fontWeight: 'normal' }}>{m.title}</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{m.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '24px', marginTop: '40px', flexWrap: 'wrap' }}>
        <div className="admin-card" style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={20} color="#3b82f6"/> Fontes de Tráfego (UTM)
          </h2>
          
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ paddingBottom: '16px' }}>Origem (utm_source)</th>
                  <th style={{ paddingBottom: '16px', textAlign: 'right' }}>Acessos</th>
                </tr>
              </thead>
              <tbody>
                {stats.origens.length > 0 ? stats.origens.map((origem: any, index: number) => (
                  <tr key={index} style={{ borderTop: '1px solid #27272a' }}>
                    <td style={{ padding: '16px 0', textTransform: 'capitalize', fontWeight: 'bold' }}>{origem.utm_source}</td>
                    <td style={{ padding: '16px 0', textAlign: 'right', color: '#10b981' }}>{origem.acessos}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={2} style={{ padding: '20px 0', textAlign: 'center', color: '#a1a1aa' }}>Nenhuma campanha UTM mapeada neste mês.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}