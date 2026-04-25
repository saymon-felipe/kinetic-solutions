import { useEffect, useState } from 'react';
import { Users, Eye, BarChart2, MapPin, UserPlus, LogIn, Clock, MousePointer, Monitor, Smartphone, Globe, Activity, BarChart, ChevronDown, LayoutTemplate } from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [periodo, setPeriodo] = useState('mes');
  const [cidade, setCidade] = useState('todas');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/analytics/dashboard?periodo=${periodo}&cidade=${cidade}`)
      .then(res => setStats(res.data.returnObj || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [periodo, cidade]);

  const handlePeriodChange = (e: any) => {
    setPeriodo(e.target.value);
    setCidade('todas');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  if (loading && !stats) return <div style={{ color: '#a1a1aa', padding: '40px' }}>Sincronizando dados...</div>;
  if (!stats) return null;

  const renderLineChart = () => {
    const data = stats.timeline || [];
    if (data.length < 2) return <p style={{ color: '#52525b', textAlign: 'center', padding: '40px' }}>Dados insuficientes para gerar tendência.</p>;

    const width = 800;
    const height = 200;
    const maxAcessos = Math.max(...data.map((d: any) => d.acessos)) || 1;
    const points = data.map((d: any, i: number) => `${(i / (data.length - 1)) * width},${height - (d.acessos / maxAcessos) * height}`).join(' ');

    return (
      <div style={{ marginTop: '32px' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '200px', overflow: 'visible' }}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline fill="url(#lineGradient)" stroke="none" points={`${width},${height} 0,${height} ${points}`} />
          <polyline fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />
          {data.map((d: any, i: number) => (
            <circle key={i} cx={(i / (data.length - 1)) * width} cy={height - (d.acessos / maxAcessos) * height} r="4" fill="#3b82f6" />
          ))}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
          {data.filter((_: any, i: number) => i % Math.ceil(data.length / 6) === 0).map((d: any, i: number) => (
            <span key={i} style={{ color: '#71717a', fontSize: '0.75rem' }}>{d.label}</span>
          ))}
        </div>
      </div>
    );
  };

  const totalBrowsers = stats.tecnologia.browsers.reduce((acc: number, curr: any) => acc + curr.acessos, 0) || 1;
  const totalOS = stats.tecnologia.os.reduce((acc: number, curr: any) => acc + curr.acessos, 0) || 1;

  const topCards = [
    { title: 'Acessos Únicos', value: stats.visitasPeriodo, icon: <Activity size={24} color="#3b82f6" /> },
    { title: 'Views do Blog (Geral)', value: stats.acessosBlog, icon: <Eye size={24} color="#3b82f6" /> },
    { title: 'Novos Usuários', value: stats.users.novos_periodo, icon: <Users size={24} color="#10b981" /> },
    { title: 'Logins Realizados', value: stats.users.logins_periodo, icon: <LogIn size={24} color="#8b5cf6" /> }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 className="blog-title" style={{ fontSize: '2.5rem' }}>Workspace Analytics</h1>
          <p className="blog-subtitle">Inteligência de Tráfego e Comportamento KSI.</p>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <select 
              value={cidade} 
              onChange={(e) => setCidade(e.target.value)}
              style={{ appearance: 'none', background: '#18181b', color: '#fff', border: '1px solid #3f3f46', padding: '10px 40px 10px 16px', borderRadius: '8px', cursor: 'pointer', outline: 'none' }}
            >
              <option value="todas">🌍 Todas as Localidades</option>
              {stats.filtroCidades?.map((c: any, i: number) => (
                <option key={i} value={c.city}>{c.city} - {c.country}</option>
              ))}
            </select>
            <MapPin size={16} style={{ position: 'absolute', right: '12px', top: '14px', pointerEvents: 'none', color: '#71717a' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <select 
              value={periodo} 
              onChange={handlePeriodChange}
              style={{ appearance: 'none', background: '#18181b', color: '#fff', border: '1px solid #3f3f46', padding: '10px 40px 10px 16px', borderRadius: '8px', cursor: 'pointer', outline: 'none' }}
            >
              <option value="dia">Últimas 24 Horas</option>
              <option value="semana">Últimos 7 Dias</option>
              <option value="mes">Últimos 30 Dias</option>
            </select>
            <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '14px', pointerEvents: 'none', color: '#71717a' }} />
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        {topCards.map((card, i) => (
          <div key={i} className="admin-card metric-card">
            <div style={{ marginBottom: '12px' }}>{card.icon}</div>
            <h3 style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>{card.title}</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="admin-card" style={{ marginTop: '24px', padding: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart size={20} color="#3b82f6" /> Tendência de Acessos
        </h2>
        <p style={{ color: '#71717a', fontSize: '0.9rem', marginBottom: '24px' }}>
          {cidade === 'todas' ? 'Tráfego global' : `Tráfego filtrado por ${cidade}`} no período selecionado.
        </p>
        {renderLineChart()}
      </div>

      {/* --- NOVA TABELA: DESEMPENHO POR PÁGINA --- */}
      <div className="admin-card" style={{ marginTop: '40px', padding: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LayoutTemplate size={20} color="#10b981" /> Desempenho e Retenção por Página
        </h2>
        <p style={{ color: '#71717a', fontSize: '0.9rem', marginBottom: '24px' }}>Métricas detalhadas de engajamento por URL (Visualizações, Sessões, Tempo de Leitura e Cliques).</p>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ paddingBottom: '16px', textAlign: 'left' }}>URL da Página</th>
                <th style={{ paddingBottom: '16px', textAlign: 'center' }}>Sessões</th>
                <th style={{ paddingBottom: '16px', textAlign: 'center' }}>Visualizações</th>
                <th style={{ paddingBottom: '16px', textAlign: 'center' }}>Retenção (Média)</th>
                <th style={{ paddingBottom: '16px', textAlign: 'right', color: '#8b5cf6' }}>Eventos Capturados</th>
              </tr>
            </thead>
            <tbody>
              {stats.paginas && stats.paginas.length > 0 ? stats.paginas.map((p: any, i: number) => (
                <tr key={i} style={{ borderTop: '1px solid #27272a' }}>
                  <td style={{ padding: '16px 0', fontWeight: 'bold', color: '#fff' }}>
                    {p.page_url === '/' ? '/ (Home)' : p.page_url}
                  </td>
                  <td style={{ padding: '16px 0', textAlign: 'center' }}>{p.sessoes}</td>
                  <td style={{ padding: '16px 0', textAlign: 'center', color: '#10b981' }}>{p.visualizacoes}</td>
                  <td style={{ padding: '16px 0', textAlign: 'center' }}>{formatTime(p.retencao)}</td>
                  <td style={{ padding: '16px 0', textAlign: 'right', color: '#8b5cf6', fontWeight: 'bold' }}>{p.eventos}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} style={{ padding: '20px 0', textAlign: 'center', color: '#a1a1aa' }}>Sem dados no período.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', margin: '40px 0 24px 0', color: '#fff' }}>Comportamento de Engajamento</h2>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '40px' }}>
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="admin-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}><Clock size={32} color="#3b82f6" /></div>
                <div>
                    <h3 style={{ color: '#a1a1aa', fontSize: '1rem', fontWeight: 'normal', margin: 0 }}>Tempo Médio na Página</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>{formatTime(stats.engajamento.avg_duration)}</p>
                </div>
            </div>
            <div className="admin-card" style={{ padding: '24px' }}>
                <h3 style={{ color: '#a1a1aa', fontSize: '1rem', fontWeight: 'normal', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={20} color="#10b981" /> Profundidade de Scroll (Média)</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ flex: 1, height: '12px', background: '#27272a', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${stats.engajamento.avg_scroll}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #10b981)', borderRadius: '6px' }}></div>
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.engajamento.avg_scroll}%</span>
                </div>
            </div>
        </div>

        <div className="admin-card" style={{ flex: 1, minWidth: '300px', padding: '24px' }}>
            <h3 style={{ color: '#a1a1aa', fontSize: '1rem', fontWeight: 'normal', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><MousePointer size={20} color="#f59e0b" /> Mapa de Calor da Atenção (Mouse)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', height: '180px' }}>
                <div style={{ background: `rgba(245, 158, 11, ${stats.engajamento.quadrants.q1 / 100})`, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#fff', opacity: 0.8 }}>Canto Sup. Esq.</span><span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{stats.engajamento.quadrants.q1}%</span>
                </div>
                <div style={{ background: `rgba(245, 158, 11, ${stats.engajamento.quadrants.q2 / 100})`, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#fff', opacity: 0.8 }}>Canto Sup. Dir.</span><span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{stats.engajamento.quadrants.q2}%</span>
                </div>
                <div style={{ background: `rgba(245, 158, 11, ${stats.engajamento.quadrants.q3 / 100})`, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#fff', opacity: 0.8 }}>Canto Inf. Esq.</span><span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{stats.engajamento.quadrants.q3}%</span>
                </div>
                <div style={{ background: `rgba(245, 158, 11, ${stats.engajamento.quadrants.q4 / 100})`, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#fff', opacity: 0.8 }}>Canto Inf. Dir.</span><span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{stats.engajamento.quadrants.q4}%</span>
                </div>
            </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#fff' }}>Tecnologia e Dispositivos</h2>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '40px' }}>
        <div className="admin-card" style={{ flex: 1, minWidth: '300px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={20} color="#8b5cf6"/> Navegadores</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats.tecnologia.browsers.map((b: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '100px', fontSize: '0.9rem', fontWeight: 'bold' }}>{b.browser}</span>
                <div style={{ flex: 1, height: '8px', background: '#27272a', borderRadius: '4px' }}>
                    <div style={{ width: `${(b.acessos / totalBrowsers) * 100}%`, height: '100%', background: '#8b5cf6', borderRadius: '4px' }}></div>
                </div>
                <span style={{ width: '40px', textAlign: 'right', color: '#a1a1aa', fontSize: '0.9rem' }}>{b.acessos}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card" style={{ flex: 1, minWidth: '300px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Monitor size={20} color="#06b6d4"/> Sistemas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats.tecnologia.os.map((o: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '80px', fontSize: '0.9rem', fontWeight: 'bold' }}>{o.os}</span>
                <div style={{ flex: 1, height: '8px', background: '#27272a', borderRadius: '4px' }}>
                    <div style={{ width: `${(o.acessos / totalOS) * 100}%`, height: '100%', background: '#06b6d4', borderRadius: '4px' }}></div>
                </div>
                <span style={{ width: '40px', textAlign: 'right', color: '#a1a1aa', fontSize: '0.9rem' }}>{o.acessos}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card" style={{ flex: 1, minWidth: '300px', padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Smartphone size={20} color="#f43f5e"/> Dispositivos</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {stats.tecnologia.devices.map((d: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid #27272a', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {d.device_type === 'Mobile' ? <Smartphone size={20} color="#a1a1aa" /> : <Monitor size={20} color="#a1a1aa" />}
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{d.device_type}</span>
                        </div>
                        <span style={{ fontSize: '1.2rem', color: '#f43f5e', fontWeight: 'bold' }}>{d.acessos}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <hr style={{ borderTop: '1px solid #27272a', margin: '40px 0' }} />

      <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#fff' }}>Audiência e Origem</h2>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div className="admin-card" style={{ flex: 1.5, minWidth: '350px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={20} color="#f43f5e"/> Cidades</h2>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr><th style={{ paddingBottom: '16px', textAlign: 'left' }}>Localidade</th><th style={{ paddingBottom: '16px', textAlign: 'right' }}>Sessões</th></tr>
              </thead>
              <tbody>
                {stats.localidades.length > 0 ? stats.localidades.map((loc: any, i: number) => (
                  <tr key={i} style={{ borderTop: '1px solid #27272a' }}>
                    <td style={{ padding: '16px 0', fontWeight: 'bold' }}>{loc.city}, {loc.region}</td>
                    <td style={{ padding: '16px 0', textAlign: 'right', color: '#f43f5e' }}>{loc.acessos}</td>
                  </tr>
                )) : <tr><td colSpan={2} style={{ padding: '20px 0', textAlign: 'center', color: '#a1a1aa' }}>Nenhum dado registrado.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="admin-card" style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={20} color="#8b5cf6"/> Demografia</h2>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th style={{ paddingBottom: '16px', textAlign: 'left' }}>Gênero</th><th style={{ paddingBottom: '16px', textAlign: 'right' }}>Qtd</th></tr></thead>
                  <tbody>
                    {stats.demografia && stats.demografia.length > 0 ? stats.demografia.map((demo: any, i: number) => (
                      <tr key={i} style={{ borderTop: '1px solid #27272a' }}>
                        <td style={{ padding: '16px 0', fontWeight: 'bold' }}>{demo.sexo}</td>
                        <td style={{ padding: '16px 0', textAlign: 'right', color: '#8b5cf6' }}>{demo.quantidade}</td>
                      </tr>
                    )) : <tr><td colSpan={2} style={{ padding: '20px 0', textAlign: 'center', color: '#a1a1aa' }}>Sem dados.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="admin-card" style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><BarChart2 size={20} color="#3b82f6"/> Tráfego (UTM)</h2>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th style={{ paddingBottom: '16px', textAlign: 'left' }}>Origem</th><th style={{ paddingBottom: '16px', textAlign: 'right' }}>Acessos</th></tr></thead>
                  <tbody>
                    {stats.origens.length > 0 ? stats.origens.map((origem: any, i: number) => (
                      <tr key={i} style={{ borderTop: '1px solid #27272a' }}>
                        <td style={{ padding: '16px 0', textTransform: 'capitalize', fontWeight: 'bold' }}>{origem.utm_source}</td>
                        <td style={{ padding: '16px 0', textAlign: 'right', color: '#3b82f6' }}>{origem.acessos}</td>
                      </tr>
                    )) : <tr><td colSpan={2} style={{ padding: '20px 0', textAlign: 'center', color: '#a1a1aa' }}>Sem campanhas.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}