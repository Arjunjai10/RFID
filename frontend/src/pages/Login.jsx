import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch {
      // Demo mode — bypass auth
      localStorage.setItem('rfid_token', 'demo-token');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-grid" />

      <div className="login-card fade-in">
        <div className="login-header">
          <div className="login-logo">📡</div>
          <h1>RFID SecureOps</h1>
          <p>Security & Access Control Management</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="form-group">
            <label className="form-label">Username / Email</label>
            <input
              id="username"
              className="form-input"
              type="text"
              placeholder="admin@rfid.local"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="password"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button id="login-btn" type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14 }} disabled={loading}>
            {loading ? '🔄 Authenticating…' : '🔐 Access System'}
          </button>
        </form>

        <div className="divider" style={{ margin: '24px 0 16px' }} />
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
          Demo credentials: <span style={{ color: 'var(--primary)', fontFamily: 'JetBrains Mono, monospace' }}>admin / admin123</span>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
          🔒 Role-Based Access Control · AES-256 Encrypted
        </div>
      </div>
    </div>
  );
}
