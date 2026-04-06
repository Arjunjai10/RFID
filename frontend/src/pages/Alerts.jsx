import { useState } from 'react';
import { SeverityBadge, EmptyState } from '../components/UI';
import { MOCK_ALERTS } from '../data/mockData';

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

const TYPE_ICON = {
  UNAUTHORIZED_ACCESS: '🚨',
  READER_OFFLINE: '📡',
  TAILGATING: '⚠️',
  SYSTEM_ERROR: '⚙️',
};

export default function Alerts() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [filter, setFilter] = useState('ALL');

  const filtered = alerts.filter((a) => {
    if (filter === 'UNACKNOWLEDGED') return !a.acknowledged;
    if (filter === 'ACKNOWLEDGED') return a.acknowledged;
    return true;
  });

  const acknowledge = (id) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, acknowledged: true } : a));
  const deleteAlert = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));
  const acknowledgeAll = () => setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));

  const unackCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Security Alerts</h1>
        <p>Monitor and respond to security incidents</p>
      </div>

      {/* Alert summary */}
      {unackCount > 0 && (
        <div className="alert alert-danger" style={{ marginBottom: 20 }}>
          <span>🚨</span>
          <span>
            <strong>{unackCount} unacknowledged alert{unackCount > 1 ? 's' : ''}</strong> require your attention.{' '}
            <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }} onClick={acknowledgeAll}>
              Acknowledge all
            </button>
          </span>
        </div>
      )}

      <div className="card">
        <div className="filter-bar">
          <div style={{ display: 'flex', gap: 8 }}>
            {['ALL', 'UNACKNOWLEDGED', 'ACKNOWLEDGED'].map((f) => (
              <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)}>
                {f === 'ALL' ? 'All' : f === 'UNACKNOWLEDGED' ? `Unread (${unackCount})` : 'Resolved'}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} alerts</div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="✅" title="No alerts" description="All security alerts have been resolved." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((alert) => (
              <div
                key={alert.id}
                style={{
                  display: 'flex',
                  gap: 16,
                  padding: '16px 18px',
                  background: alert.acknowledged ? 'rgba(255,255,255,0.02)' : 'rgba(239,68,68,0.04)',
                  border: `1px solid ${alert.acknowledged ? 'var(--border)' : 'rgba(239,68,68,0.2)'}`,
                  borderRadius: 'var(--radius)',
                  borderLeft: `4px solid ${alert.severity === 'HIGH' ? 'var(--danger)' : alert.severity === 'MEDIUM' ? 'var(--warning)' : 'var(--primary)'}`,
                  opacity: alert.acknowledged ? 0.7 : 1,
                  transition: 'var(--transition)',
                }}
              >
                <div style={{ fontSize: 24, flexShrink: 0 }}>{TYPE_ICON[alert.type] || '⚠️'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{alert.message}</span>
                    <SeverityBadge severity={alert.severity} />
                    {alert.acknowledged && <span className="badge badge-success" style={{ fontSize: 10 }}>✓ RESOLVED</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>🚪 {alert.zone}</span>
                    {alert.tagId && <span>📡 {alert.tagId}</span>}
                    <span>🕐 {formatDateTime(alert.timestamp)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignSelf: 'center', flexShrink: 0 }}>
                  {!alert.acknowledged && (
                    <button className="btn btn-success btn-sm" onClick={() => acknowledge(alert.id)}>✓ Acknowledge</button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => deleteAlert(alert.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
