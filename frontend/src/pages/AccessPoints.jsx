import { useState } from 'react';
import { Modal, SearchBar, StatusDot, ConfirmDialog, EmptyState } from '../components/UI';
import { MOCK_ACCESS_POINTS } from '../data/mockData';

const ACCESS_LEVELS = ['ALL', 'STAFF', 'IT_ADMIN', 'ADMIN', 'SUPER_ADMIN'];
const POINT_TYPES = ['ENTRY_EXIT', 'ENTRY_ONLY', 'EXIT_ONLY', 'RESTRICTED'];

export default function AccessPoints() {
  const [points, setPoints] = useState(MOCK_ACCESS_POINTS);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editPoint, setEditPoint] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ name: '', location: '', type: 'ENTRY_EXIT', accessLevel: 'ALL', reader: '' });

  const filtered = points.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditPoint(null); setForm({ name: '', location: '', type: 'ENTRY_EXIT', accessLevel: 'ALL', reader: '' }); setShowModal(true); };
  const openEdit = (p) => { setEditPoint(p); setForm({ name: p.name, location: p.location, type: p.type, accessLevel: p.accessLevel, reader: p.reader || '' }); setShowModal(true); };

  const handleSave = () => {
    if (editPoint) {
      setPoints((prev) => prev.map((p) => p.id === editPoint.id ? { ...p, ...form } : p));
    } else {
      setPoints((prev) => [...prev, { id: Date.now(), ...form, status: 'ONLINE' }]);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setPoints((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

  const toggleStatus = (id) => {
    setPoints((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE' } : p));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Access Points</h1>
        <p>Configure and monitor RFID readers and secure zones</p>
      </div>

      {/* Summary cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        {[
          { label: 'Total Points', value: points.length, icon: '🚪', color: 'var(--primary)' },
          { label: 'Online', value: points.filter((p) => p.status === 'ONLINE').length, icon: '🟢', color: 'var(--success)' },
          { label: 'Offline', value: points.filter((p) => p.status === 'OFFLINE').length, icon: '🔴', color: 'var(--danger)' },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ '--accent-color': s.color }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="filter-bar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or location…" />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>{filtered.length} points</span>
            <button className="btn btn-primary btn-sm" onClick={openAdd} id="add-point-btn">➕ Add Point</button>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Type</th>
                <th>Access Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon="🚪" title="No access points found" /></td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,212,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🚪</div>
                    {p.name}
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {p.location}</td>
                  <td>
                    <span className="badge badge-primary" style={{ textTransform: 'none', letterSpacing: 0 }}>{p.type.replace('_', ' ')}</span>
                  </td>
                  <td>
                    <span className={`badge ${p.accessLevel === 'ALL' ? 'badge-success' : p.accessLevel.includes('ADMIN') ? 'badge-purple' : 'badge-warning'}`}>
                      {p.accessLevel.replace('_', ' ')}
                    </span>
                  </td>
                  <td><StatusDot status={p.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>✏️</button>
                      <button className={`btn btn-sm ${p.status === 'ONLINE' ? 'btn-danger' : 'btn-success'}`} onClick={() => toggleStatus(p.id)}>
                        {p.status === 'ONLINE' ? '⏸ Disable' : '▶ Enable'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(p.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editPoint ? 'Edit Access Point' : 'New Access Point'} icon="🚪"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>{editPoint ? 'Save Changes' : 'Create'}</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Point Name *</label>
            <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Server Room A" />
          </div>
          <div className="form-group">
            <label className="form-label">Location / Description</label>
            <input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. IT Block, Floor 2" />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {POINT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Access Level</label>
              <select className="form-select" value={form.accessLevel} onChange={(e) => setForm({ ...form, accessLevel: e.target.value })}>
                {ACCESS_LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Reader ID / Serial</label>
            <input className="form-input" value={form.reader} onChange={(e) => setForm({ ...form, reader: e.target.value })} placeholder="e.g. RDR-001" style={{ fontFamily: 'JetBrains Mono, monospace' }} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Access Point" message="Permanently delete this access point? All associated logs will be preserved but the reader will stop functioning." />
    </div>
  );
}
