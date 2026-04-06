import { useState } from 'react';

export default function Settings() {
  const [general, setGeneral] = useState({ systemName: 'RFID SecureOps', orgName: 'My Organization', timezone: 'Asia/Kolkata', logRetention: '90' });
  const [security, setSecurity] = useState({ sessionTimeout: '30', maxFailedAttempts: '3', lockoutDuration: '15', requireMFA: false, encryptLogs: true });
  const [notif, setNotif] = useState({ emailAlerts: true, smsAlerts: false, emailAddress: 'admin@rfid.local', alertOnDenied: true, alertOnOffline: true });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>System Settings</h1>
        <p>Configure system-wide preferences and security parameters</p>
      </div>

      {saved && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          ✅ Settings saved successfully.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* General */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">⚙️ General Configuration</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">System Name</label>
                <input className="form-input" value={general.systemName} onChange={(e) => setGeneral({ ...general, systemName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Organization Name</label>
                <input className="form-input" value={general.orgName} onChange={(e) => setGeneral({ ...general, orgName: e.target.value })} />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Timezone</label>
                <select className="form-select" value={general.timezone} onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}>
                  <option>Asia/Kolkata</option>
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Log Retention (days)</label>
                <input className="form-input" type="number" value={general.logRetention} onChange={(e) => setGeneral({ ...general, logRetention: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🔒 Security Parameters</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Session Timeout (min)</label>
                <input className="form-input" type="number" value={security.sessionTimeout} onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Max Failed Attempts</label>
                <input className="form-input" type="number" value={security.maxFailedAttempts} onChange={(e) => setSecurity({ ...security, maxFailedAttempts: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Lockout Duration (min)</label>
                <input className="form-input" type="number" value={security.lockoutDuration} onChange={(e) => setSecurity({ ...security, lockoutDuration: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              {[
                { label: 'Require MFA for Admins', key: 'requireMFA' },
                { label: 'Encrypt Access Logs', key: 'encryptLogs' },
              ].map(({ label, key }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={security[key]} onChange={(e) => setSecurity({ ...security, [key]: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🔔 Alert & Notification Settings</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { label: 'Email Alerts', key: 'emailAlerts' },
                { label: 'SMS Alerts', key: 'smsAlerts' },
                { label: 'Alert on Denied Access', key: 'alertOnDenied' },
                { label: 'Alert on Reader Offline', key: 'alertOnOffline' },
              ].map(({ label, key }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={notif[key]} onChange={(e) => setNotif({ ...notif, [key]: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                  {label}
                </label>
              ))}
            </div>
            <div className="form-group" style={{ maxWidth: 360 }}>
              <label className="form-label">Alert Email Address</label>
              <input className="form-input" type="email" value={notif.emailAddress} onChange={(e) => setNotif({ ...notif, emailAddress: e.target.value })} />
            </div>
          </div>
        </div>

        {/* System info */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">ℹ️ System Information</div>
          </div>
          <div className="table-wrapper">
            <table>
              <tbody>
                {[
                  ['Frontend Version', 'React 18.x + Vite'],
                  ['Backend Version', 'Spring Boot 3.x'],
                  ['Database', 'MySQL 8.0'],
                  ['RFID Protocol', 'ISO 14443A / MIFARE'],
                  ['Authentication', 'JWT Bearer Token'],
                  ['Encryption', 'AES-256 / HTTPS'],
                  ['Compliance', 'GDPR, RBAC'],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ color: 'var(--text-muted)', width: 200 }}>{k}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--primary)' }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="btn btn-ghost">Reset to Defaults</button>
          <button className="btn btn-primary" onClick={handleSave} id="save-settings-btn">💾 Save Settings</button>
        </div>
      </div>
    </div>
  );
}
