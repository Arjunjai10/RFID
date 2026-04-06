import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLiveClock } from '../hooks/hooks';

const NAV_ITEMS = [
  { to: '/dashboard', icon: '⬛', label: 'Dashboard' },
  { to: '/access-logs', icon: '📋', label: 'Access Logs', badge: null },
  { to: '/users', icon: '👥', label: 'User Management' },
  { to: '/rfid-tags', icon: '🏷️', label: 'RFID Tags' },
  { to: '/access-points', icon: '🚪', label: 'Access Points' },
  { to: '/alerts', icon: '🚨', label: 'Alerts' },
  { to: '/reports', icon: '📊', label: 'Reports' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function Sidebar({ alertCount = 0 }) {
  const { user, logout } = useAuth();
  const time = useLiveClock();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">📡</div>
        <div className="sidebar-logo-text">
          <h2>RFID SecureOps</h2>
          <span>Security System v1.0</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span>{item.label}</span>
            {item.to === '/alerts' && alertCount > 0 && (
              <span className="nav-badge">{alertCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>
            {(user?.name || 'A')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name || 'Administrator'}</div>
            <div style={{ fontSize: 11, color: 'var(--primary)' }}>{user?.role || 'ADMIN'}</div>
          </div>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, textAlign: 'center' }}>
          🕐 {time}
        </div>
        <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 12 }} onClick={logout}>
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}
