import { useState, useEffect } from 'react';
import { useToast } from '../hooks/hooks';

// ─── Toast Provider ──────────────────────────────────────────────────────────
export function ToastContainer({ toasts }) {
  const icons = { success: '✅', danger: '❌', warning: '⚠️', info: 'ℹ️' };
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{icons[t.type] || '•'}</span>
          <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, icon, children, footer }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">
            {icon && <span>{icon}</span>}
            {title}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
export function StatCard({ icon, label, value, change, color = 'var(--primary)', glow = 'var(--primary-glow)', iconBg = 'rgba(0,212,255,0.12)' }) {
  return (
    <div className="stat-card" style={{ '--accent-color': color, '--accent-glow-color': glow }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="stat-card-icon" style={{ '--icon-bg': iconBg }}>{icon}</div>
        {change && (
          <span className={`stat-change ${change.startsWith('+') ? 'up' : 'down'}`}>
            {change.startsWith('+') ? '▲' : '▼'} {change}
          </span>
        )}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────
export function Badge({ type, children }) {
  return <span className={`badge badge-${type}`}>{children}</span>;
}

// ─── Status Badge for access ─────────────────────────────────────────────────
export function AccessBadge({ status }) {
  const map = { GRANTED: 'success', DENIED: 'danger', PENDING: 'warning' };
  return <Badge type={map[status] || 'primary'}>{status}</Badge>;
}

// ─── Severity Badge ───────────────────────────────────────────────────────────
export function SeverityBadge({ severity }) {
  const map = { HIGH: 'danger', MEDIUM: 'warning', LOW: 'primary' };
  return <Badge type={map[severity] || 'primary'}>{severity}</Badge>;
}

// ─── Live Dot ────────────────────────────────────────────────────────────────
export function LiveDot() {
  return <span className="live-dot" />;
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return <div className="spinner" style={{ width: size, height: size }} />;
}

// ─── Empty State ─────────────────────────────────────────────────────────────
export function EmptyState({ icon = '📭', title = 'No data found', description = '' }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}

// ─── Search Bar ──────────────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
      <span className="search-icon">🔍</span>
      <input className="form-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message, danger = true }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      icon={danger ? '⚠️' : '❓'}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>Confirm</button>
        </>
      }
    >
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{message}</p>
    </Modal>
  );
}

// ─── RFID Tag display ────────────────────────────────────────────────────────
export function TagDisplay({ tagId }) {
  if (!tagId) return <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 12 }}>No tag</span>;
  return (
    <span className="tag" style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--primary)', border: '1px solid rgba(0,212,255,0.2)' }}>
      📡 {tagId}
    </span>
  );
}

// ─── Online/Offline Dot ──────────────────────────────────────────────────────
export function StatusDot({ status }) {
  const c = status === 'ONLINE' ? 'var(--success)' : status === 'OFFLINE' ? 'var(--danger)' : 'var(--warning)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block', boxShadow: `0 0 6px ${c}` }} />
      <span style={{ fontSize: 12, color: c, fontWeight: 600 }}>{status}</span>
    </span>
  );
}

// ─── RFID Scan Simulator ─────────────────────────────────────────────────────
export function RFIDScanBox({ onScan }) {
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      const fakeTag = 'TAG-' + String(Math.floor(Math.random() * 9999)).padStart(4, '0');
      setScanning(false);
      onScan?.(fakeTag);
    }, 1800);
  };

  return (
    <div className="rfid-scanner" onClick={handleScan} title="Click to simulate RFID scan">
      {scanning && <div className="scan-line" />}
      <div className="rfid-scanner-icon">{scanning ? '📡' : '🏷️'}</div>
      <div className="rfid-scanner-text">
        {scanning ? 'SCANNING...' : 'CLICK TO SCAN RFID TAG'}
      </div>
      {!scanning && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>or enter UID manually below</div>}
    </div>
  );
}
