import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell,
} from 'recharts';
import { StatCard, AccessBadge, LiveDot, EmptyState } from '../components/UI';
import { MOCK_STATS, MOCK_RECENT_LOGS, MOCK_TREND } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function Dashboard() {
  const [stats] = useState(MOCK_STATS);
  const [logs, setLogs] = useState(MOCK_RECENT_LOGS);
  const [trend] = useState(MOCK_TREND);

  // Simulate live updates
  useEffect(() => {
    const zones = ['Main Gate', 'Library', 'Cafeteria', 'Lab Block B', 'Server Room A'];
    const names = ['Arjun Kumar', 'Priya Sharma', 'Dev Patel', 'Rahul Verma', 'Sneha Nair', 'Unknown'];
    const interval = setInterval(() => {
      const isGranted = Math.random() > 0.25;
      const newLog = {
        id: Date.now(),
        tagId: 'TAG-' + String(Math.floor(Math.random() * 9999)).padStart(4, '0'),
        userName: isGranted ? names[Math.floor(Math.random()*5)] : 'Unknown',
        zone: zones[Math.floor(Math.random()*zones.length)],
        status: isGranted ? 'GRANTED' : 'DENIED',
        timestamp: new Date().toISOString(),
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 9)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const pieData = [
    { name: 'Granted', value: stats.todayAccess - stats.deniedToday },
    { name: 'Denied', value: stats.deniedToday },
  ];
  const PIE_COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Security Dashboard</h1>
        <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LiveDot /> Live monitoring — updates every 5 seconds
        </p>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <StatCard icon="👥" label="Total Users" value={stats.totalUsers} change="+4 this week" color="var(--primary)" glow="var(--primary-glow)" iconBg="rgba(0,212,255,0.12)" />
        <StatCard icon="✅" label="Active Users" value={stats.activeUsers} color="var(--success)" glow="var(--success-glow)" iconBg="rgba(16,185,129,0.12)" />
        <StatCard icon="🚪" label="Access Today" value={stats.todayAccess} change="+12%" color="var(--accent)" glow="var(--accent-glow)" iconBg="rgba(124,58,237,0.12)" />
        <StatCard icon="🚫" label="Denied Today" value={stats.deniedToday} color="var(--danger)" glow="var(--danger-glow)" iconBg="rgba(239,68,68,0.12)" />
        <StatCard icon="📡" label="Active Points" value={stats.activePoints} color="var(--warning)" glow="var(--warning-glow)" iconBg="rgba(245,158,11,0.12)" />
        <StatCard icon="🚨" label="Alerts Today" value={stats.alertsToday} color="var(--danger)" glow="var(--danger-glow)" iconBg="rgba(239,68,68,0.12)" />
      </div>

      {/* Charts row */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Area chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📈 Access Activity (Last 7 Days)</div>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="grantGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="denyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="granted" name="Granted" stroke="#10b981" fill="url(#grantGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="denied" name="Denied" stroke="#ef4444" fill="url(#denyGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🎯 Today's Access Distribution</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', height: 200 }}>
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pieData.map((entry, i) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: PIE_COLORS[i], display: 'inline-block' }} />
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{entry.name}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: PIE_COLORS[i] }}>{entry.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Log */}
      <div className="card">
        <div className="card-header">
          <div className="card-title" style={{ gap: 10 }}>
            📋 Live Access Feed
            <LiveDot />
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Tag UID</th>
                <th>User</th>
                <th>Zone / Access Point</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--primary)', background: 'rgba(0,212,255,0.08)', padding: '2px 8px', borderRadius: 4 }}>
                      {log.tagId}
                    </span>
                  </td>
                  <td>{log.userName}</td>
                  <td>🚪 {log.zone}</td>
                  <td><AccessBadge status={log.status} /></td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                    {formatTime(log.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
