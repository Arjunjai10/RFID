import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import { MOCK_TREND, MOCK_ACCESS_POINTS } from '../data/mockData';

const DEPT_DATA = [
  { dept: 'IT', accesses: 42 },
  { dept: 'HR', accesses: 28 },
  { dept: 'Finance', accesses: 19 },
  { dept: 'Ops', accesses: 35 },
  { dept: 'Security', accesses: 57 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></div>
      ))}
    </div>
  );
};

export default function Reports() {
  const [range, setRange] = useState('7d');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <p>Access statistics, trends, and compliance reports</p>
      </div>

      <div className="filter-bar" style={{ marginBottom: 20 }}>
        {['7d', '30d', '90d'].map((r) => (
          <button key={r} className={`btn btn-sm ${range === r ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setRange(r)}>
            {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
          </button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-ghost btn-sm">⬇️ Download PDF Report</button>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Weekly trend */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📈 Daily Access Trend</div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={MOCK_TREND} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#475569" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fill: '#475569', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="granted" name="Granted" fill="#10b981" radius={[4,4,0,0]} />
                <Bar dataKey="denied" name="Denied" fill="#ef4444" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dept Access */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🏢 Access by Department</div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={DEPT_DATA} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#475569" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis dataKey="dept" type="category" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} width={50} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="accesses" name="Accesses" fill="#00d4ff" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Access by zone */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title">🚪 Access by Zone (This Week)</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
          {MOCK_ACCESS_POINTS.map((p, i) => {
            const count = [120, 45, 88, 23, 67, 110][i] || 30;
            const max = 120;
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 120, fontSize: 12, color: 'var(--text-secondary)', flexShrink: 0 }}>{p.name}</div>
                <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(count/max)*100}%`, height: '100%',
                    background: `linear-gradient(90deg, var(--primary), var(--accent))`,
                    borderRadius: 4, transition: 'width 0.8s ease'
                  }} />
                </div>
                <div style={{ width: 40, textAlign: 'right', fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: 'var(--primary)' }}>{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">📊 Summary Statistics</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Today</th>
                <th>This Week</th>
                <th>This Month</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Total Access Events', 87, 439, 1842],
                ['Access Granted', 82, 418, 1774],
                ['Access Denied', 5, 21, 68],
                ['Unique Users', 34, 98, 142],
                ['Security Alerts', 3, 8, 24],
                ['Avg Response Time (ms)', 320, 315, 312],
              ].map(([m, t, w, mo]) => (
                <tr key={m}>
                  <td style={{ color: 'var(--text-primary)' }}>{m}</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--primary)', fontWeight: 600 }}>{t}</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>{w}</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>{mo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
