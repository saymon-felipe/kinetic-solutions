import { useEffect, useState } from 'react';
import { 
  Users, Eye, BarChart2, MapPin, LogIn, Clock, MousePointer, 
  Monitor, Smartphone, Globe, Activity, BarChart, ChevronDown, 
  LayoutTemplate, ArrowUpRight, ShieldCheck, Flame, Radio, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import KsiLoader from '../../components/KsiLoader';

export default function AdminDashboard() {
  const [periodo, setPeriodo] = useState('mes');
  const [cidade, setCidade] = useState('todas');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeChartPoint, setActiveChartPoint] = useState<any>(null);

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
    if (!seconds && seconds !== 0) return '0s';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  if (loading && !stats) {
    return (
      <KsiLoader
        kicker="KSI WORKSPACE"
        title="Carregando Analytics"
        message="Sincronizando estatísticas de audiência, timeline e métricas em tempo real..."
        theme="dark"
        minHeight="60vh"
      />
    );
  }

  if (!stats) return null;

  const renderLineChart = () => {
    const data = stats.timeline || [];
    if (data.length < 2) {
      return (
        <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--admin-text-dim)' }}>
          <Activity size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p>Dados insuficientes para gerar a curva de tendência no período selecionado.</p>
        </div>
      );
    }

    const width = 800;
    const height = 220;
    const maxAcessos = Math.max(...data.map((d: any) => d.acessos)) || 1;
    const points = data.map((d: any, i: number) => `${(i / (data.length - 1)) * width},${height - (d.acessos / maxAcessos) * (height - 30) - 15}`).join(' ');

    return (
      <div style={{ marginTop: '24px', position: 'relative' }}>
        {/* Tooltip Overlay */}
        {activeChartPoint && (
          <div style={{
            position: 'absolute',
            left: `${(activeChartPoint.index / (data.length - 1)) * 100}%`,
            top: '0px',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--admin-accent)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(56, 189, 248, 0.3)',
            borderRadius: '8px',
            padding: '8px 12px',
            pointerEvents: 'none',
            zIndex: 10,
            whiteSpace: 'nowrap'
          }}>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>{activeChartPoint.label}</p>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{activeChartPoint.acessos} acessos</p>
          </div>
        )}

        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '220px', overflow: 'visible' }}>
          <defs>
            <linearGradient id="cyberNeonGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines horizontais */}
          <line x1="0" y1="20" x2={width} y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <line x1="0" y1={height - 20} x2={width} y2={height - 20} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

          {/* Área com Gradiente */}
          <polyline fill="url(#cyberNeonGradient)" stroke="none" points={`${width},${height} 0,${height} ${points}`} />

          {/* Linha Principal com Glow */}
          <polyline 
            fill="none" 
            stroke="#38bdf8" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            filter="url(#neonGlow)"
            points={points} 
          />

          {/* Pontos Interativos */}
          {data.map((d: any, i: number) => {
            const cx = (i / (data.length - 1)) * width;
            const cy = height - (d.acessos / maxAcessos) * (height - 30) - 15;
            const isActive = activeChartPoint?.index === i;
            return (
              <g key={i} onMouseEnter={() => setActiveChartPoint({ ...d, index: i })} onMouseLeave={() => setActiveChartPoint(null)} style={{ cursor: 'pointer' }}>
                <circle cx={cx} cy={cy} r={isActive ? "7" : "4"} fill="#060911" stroke="#38bdf8" strokeWidth={isActive ? "3" : "2"} />
                {isActive && <circle cx={cx} cy={cy} r="12" fill="none" stroke="#38bdf8" strokeOpacity="0.4" strokeWidth="1.5" />}
              </g>
            );
          })}
        </svg>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
          {data.filter((_: any, i: number) => i % Math.ceil(data.length / 6) === 0).map((d: any, i: number) => (
            <span key={i} style={{ color: 'var(--admin-text-dim)', fontSize: '0.75rem', fontFamily: 'var(--font-heading)' }}>{d.label}</span>
          ))}
        </div>
      </div>
    );
  };

  const totalBrowsers = stats.tecnologia?.browsers?.reduce((acc: number, curr: any) => acc + curr.acessos, 0) || 1;
  const totalOS = stats.tecnologia?.os?.reduce((acc: number, curr: any) => acc + curr.acessos, 0) || 1;

  const topCards = [
    { 
      title: 'Acessos Totais', 
      value: stats.visitasPeriodo, 
      trend: 'Ao vivo',
      color: '#38bdf8',
      icon: <Activity size={22} color="#38bdf8" /> 
    },
    { 
      title: 'Views do KSI Lab', 
      value: stats.acessosBlog, 
      trend: 'Artigos',
      color: '#10b981',
      icon: <Eye size={22} color="#10b981" /> 
    },
    { 
      title: 'Novos Usuários', 
      value: stats.users?.novos_periodo || 0, 
      trend: '+100% Google',
      color: '#a855f7',
      icon: <Users size={22} color="#a855f7" /> 
    },
    { 
      title: 'Logins Autenticados', 
      value: stats.users?.logins_periodo || 0, 
      trend: 'Sessões',
      color: '#f59e0b',
      icon: <LogIn size={22} color="#f59e0b" /> 
    }
  ];

  return (
    <div>
      {/* CABEÇALHO DO DASHBOARD COM FILTROS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, letterSpacing: '0.5px', color: '#fff', margin: 0 }}>
            Workspace <span style={{ color: 'var(--admin-accent)' }}>Analytics</span>
          </h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.92rem', marginTop: '6px', margin: 0 }}>
            Painel de inteligência de tráfego, telemetria comportamental e engajamento.
          </p>
        </div>

        {/* Filtros em Pílulas */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <select 
              value={cidade} 
              onChange={(e) => setCidade(e.target.value)}
              className="admin-select"
              style={{ paddingRight: '36px', height: '42px', minWidth: '180px' }}
            >
              <option value="todas">🌍 Todas Localidades</option>
              {stats.filtroCidades?.map((c: any, i: number) => (
                <option key={i} value={c.city}>{c.city} - {c.country}</option>
              ))}
            </select>
            <MapPin size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--admin-accent)' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <select 
              value={periodo} 
              onChange={handlePeriodChange}
              className="admin-select"
              style={{ paddingRight: '36px', height: '42px', minWidth: '170px' }}
            >
              <option value="dia">Últimas 24 Horas</option>
              <option value="semana">Últimos 7 Dias</option>
              <option value="mes">Últimos 30 Dias</option>
            </select>
            <ChevronDown size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--admin-text-muted)' }} />
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="metrics-grid">
        {topCards.map((card, i) => (
          <motion.div 
            key={i} 
            className="admin-card metric-card admin-card--interactive"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            style={{ '--card-accent-color': card.color } as any}
          >
            <div className="metric-header">
              <span className="metric-title">{card.title}</span>
              <div className="metric-icon-wrap" style={{ background: `${card.color}15`, borderColor: `${card.color}30` }}>
                {card.icon}
              </div>
            </div>
            
            <div className="metric-value">{card.value}</div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '8px' }}>
              <span className="metric-trend up">
                <ArrowUpRight size={12} /> {card.trend}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-dim)' }}>Período selecionado</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* GRÁFICO DE TENDÊNCIA */}
      <div className="admin-card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <BarChart size={20} color="var(--admin-accent)" /> Curva de Acessos e Telemetria
            </h2>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.84rem', marginTop: '4px', margin: 0 }}>
              {cidade === 'todas' ? 'Tráfego consolidado global' : `Filtro aplicado para: ${cidade}`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.08)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <Radio size={14} color="var(--admin-accent)" className="animate-pulse" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--admin-accent)', fontFamily: 'var(--font-heading)' }}>TEMPO REAL</span>
          </div>
        </div>
        {renderLineChart()}
      </div>

      {/* COMPORTAMENTO DE ENGAJAMENTO (TEMPO, SCROLL & MAPA DE CALOR HUD) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Painel Esquerdo: Tempo Médio & Profundidade */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={28} color="var(--admin-accent)" />
            </div>
            <div>
              <span className="admin-label" style={{ marginBottom: '2px' }}>Tempo Médio de Permanência</span>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>
                {formatTime(stats.engajamento?.avg_duration || 0)}
              </div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="admin-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={16} color="var(--admin-success)" /> Profundidade Média de Scroll
              </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--admin-success)', fontSize: '1.2rem' }}>
                {stats.engajamento?.avg_scroll || 0}%
              </span>
            </div>
            <div style={{ height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stats.engajamento?.avg_scroll || 0}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #38bdf8 0%, #10b981 100%)', borderRadius: '6px' }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)', marginTop: '8px', margin: 0 }}>
              Percentual médio de rolagem do usuário ao consumir conteúdos da página.
            </p>
          </div>
        </div>

        {/* Painel Direito: Mapa de Calor HUD */}
        <div className="admin-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MousePointer size={18} color="var(--admin-warning)" /> Radar de Atenção do Mouse
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--admin-warning)', background: 'var(--admin-warning-bg)', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
              4 QUADRANTES
            </span>
          </div>

          <div className="hud-grid">
            <div className="hud-quadrant" style={{ background: `rgba(245, 158, 11, ${(stats.engajamento?.quadrants?.q1 || 10) / 130 + 0.05})` }}>
              <span className="hud-quadrant-label">Superior Esquerdo</span>
              <span className="hud-quadrant-val">{stats.engajamento?.quadrants?.q1 || 0}%</span>
            </div>
            <div className="hud-quadrant" style={{ background: `rgba(245, 158, 11, ${(stats.engajamento?.quadrants?.q2 || 10) / 130 + 0.05})` }}>
              <span className="hud-quadrant-label">Superior Direito</span>
              <span className="hud-quadrant-val">{stats.engajamento?.quadrants?.q2 || 0}%</span>
            </div>
            <div className="hud-quadrant" style={{ background: `rgba(245, 158, 11, ${(stats.engajamento?.quadrants?.q3 || 10) / 130 + 0.05})` }}>
              <span className="hud-quadrant-label">Inferior Esquerdo</span>
              <span className="hud-quadrant-val">{stats.engajamento?.quadrants?.q3 || 0}%</span>
            </div>
            <div className="hud-quadrant" style={{ background: `rgba(245, 158, 11, ${(stats.engajamento?.quadrants?.q4 || 10) / 130 + 0.05})` }}>
              <span className="hud-quadrant-label">Inferior Direito</span>
              <span className="hud-quadrant-val">{stats.engajamento?.quadrants?.q4 || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABELA: DESEMPENHO E RETENÇÃO POR PÁGINA */}
      <div className="admin-card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <LayoutTemplate size={20} color="var(--admin-success)" /> Desempenho e Retenção por Página
            </h2>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.84rem', marginTop: '4px', margin: 0 }}>
              Mapeamento granular de sessões, visualizações únicas e eventos capturados.
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>URL da Página</th>
                <th style={{ textAlign: 'center' }}>Sessões</th>
                <th style={{ textAlign: 'center' }}>Visualizações</th>
                <th style={{ textAlign: 'center' }}>Retenção Média</th>
                <th style={{ textAlign: 'right' }}>Eventos</th>
              </tr>
            </thead>
            <tbody>
              {stats.paginas && stats.paginas.length > 0 ? stats.paginas.map((p: any, i: number) => (
                <tr key={i}>
                  <td style={{ color: 'var(--admin-text-dim)', fontWeight: 800 }}>{i + 1}</td>
                  <td style={{ fontWeight: 700, color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', fontSize: '0.78rem', color: 'var(--admin-accent)', fontFamily: 'monospace' }}>
                        {p.page_url === '/' ? '/ (Home Principal)' : p.page_url}
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--admin-text-muted)' }}>{p.sessoes}</td>
                  <td style={{ textAlign: 'center', color: 'var(--admin-success)', fontWeight: 700 }}>{p.visualizacoes}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', fontSize: '0.82rem' }}>
                      <Clock size={12} color="var(--admin-accent)" /> {formatTime(p.retencao)}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'var(--admin-purple-bg)', color: 'var(--admin-purple)', fontWeight: 800, fontSize: '0.82rem' }}>
                      {p.eventos}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} style={{ padding: '32px 0', textAlign: 'center', color: 'var(--admin-text-dim)' }}>Sem dados registrados no período.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TECNOLOGIA E DISPOSITIVOS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Navegadores */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="var(--admin-purple)" /> Navegadores
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {stats.tecnologia?.browsers?.map((b: any, i: number) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#fff' }}>{b.browser}</span>
                  <span style={{ color: 'var(--admin-text-muted)' }}>{b.acessos} ({Math.round((b.acessos / totalBrowsers) * 100)}%)</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${(b.acessos / totalBrowsers) * 100}%`, height: '100%', background: '#a855f7', borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sistemas Operacionais */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Monitor size={18} color="#06b6d4" /> Sistemas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {stats.tecnologia?.os?.map((o: any, i: number) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#fff' }}>{o.os}</span>
                  <span style={{ color: 'var(--admin-text-muted)' }}>{o.acessos} ({Math.round((o.acessos / totalOS) * 100)}%)</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${(o.acessos / totalOS) * 100}%`, height: '100%', background: '#06b6d4', borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dispositivos */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={18} color="var(--admin-danger)" /> Dispositivos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.tecnologia?.devices?.map((d: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--admin-card-border)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {d.device_type === 'Mobile' ? <Smartphone size={18} color="var(--admin-danger)" /> : <Monitor size={18} color="var(--admin-accent)" />}
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{d.device_type}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--admin-danger)', fontWeight: 800 }}>{d.acessos}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AUDIÊNCIA, CIDADES E ORIGEM UTM */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Cidades */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="var(--admin-danger)" /> Localidades & Cidades
          </h3>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr><th>Localidade</th><th style={{ textAlign: 'right' }}>Sessões</th></tr>
              </thead>
              <tbody>
                {stats.localidades?.length > 0 ? stats.localidades.map((loc: any, i: number) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{loc.city}, {loc.region}</td>
                    <td style={{ textAlign: 'right', color: 'var(--admin-danger)', fontWeight: 700 }}>{loc.acessos}</td>
                  </tr>
                )) : <tr><td colSpan={2} style={{ padding: '24px 0', textAlign: 'center', color: 'var(--admin-text-dim)' }}>Sem dados registrados.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tráfego de Campanhas UTM */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} color="var(--admin-accent)" /> Origens de Tráfego (UTM)
          </h3>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr><th>Origem / Canal</th><th style={{ textAlign: 'right' }}>Acessos</th></tr>
              </thead>
              <tbody>
                {stats.origens?.length > 0 ? stats.origens.map((origem: any, i: number) => (
                  <tr key={i}>
                    <td style={{ textTransform: 'capitalize', fontWeight: 600, color: '#fff' }}>
                      <span className="category-badge" style={{ textTransform: 'none' }}>{origem.utm_source || 'Direto / Orgânico'}</span>
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--admin-accent)', fontWeight: 700 }}>{origem.acessos}</td>
                  </tr>
                )) : <tr><td colSpan={2} style={{ padding: '24px 0', textAlign: 'center', color: 'var(--admin-text-dim)' }}>Nenhuma campanha UTM capturada.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}