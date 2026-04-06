import { useState } from 'react';
import { Modal, SearchBar, ConfirmDialog, EmptyState, RFIDScanBox } from '../components/UI';
import { MOCK_USERS } from '../data/mockData';

const INIT_TAGS = [
  { id: 1, tagId: 'TAG-0042', userId: 1, userName: 'Arjun Kumar', type: 'MIFARE_CLASSIC', assignedAt: '2025-01-15', status: 'ACTIVE', lastUsed: '2026-04-06T10:15:30' },
  { id: 2, tagId: 'TAG-0017', userId: 2, userName: 'Priya Sharma', type: 'MIFARE_CLASSIC', assignedAt: '2025-02-20', status: 'ACTIVE', lastUsed: '2026-04-06T10:08:21' },
  { id: 3, tagId: 'TAG-0031', userId: 3, userName: 'Rahul Verma', type: 'MIFARE_ULTRALIGHT', assignedAt: '2024-12-01', status: 'ACTIVE', lastUsed: '2026-04-06T10:05:10' },
  { id: 4, tagId: 'TAG-0081', userId: 4, userName: 'Sneha Nair', type: 'MIFARE_CLASSIC', assignedAt: '2025-03-10', status: 'ACTIVE', lastUsed: '2026-04-06T09:55:07' },
  { id: 5, tagId: 'TAG-0012', userId: 5, userName: 'Dev Patel', type: 'ISO14443A', assignedAt: '2025-01-28', status: 'ACTIVE', lastUsed: '2026-04-06T09:50:44' },
  { id: 6, tagId: 'TAG-0099', userId: null, userName: null, type: 'MIFARE_CLASSIC', assignedAt: null, status: 'UNASSIGNED', lastUsed: null },
  { id: 7, tagId: 'TAG-0205', userId: null, userName: null, type: 'ISO14443A', assignedAt: null, status: 'UNASSIGNED', lastUsed: null },
];

const TAG_TYPES = ['MIFARE_CLASSIC', 'MIFARE_ULTRALIGHT', 'ISO14443A', 'ISO15693'];

export default function RFIDTags() {
  const [tags, setTags] = useState(INIT_TAGS);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showAssign, setShowAssign] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ tagId: '', type: 'MIFARE_CLASSIC' });
  const [assignUserId, setAssignUserId] = useState('');

  const filtered = tags.filter((t) =>
    t.tagId.toLowerCase().includes(search.toLowerCase()) ||
    (t.userName || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleScan = (scannedId) => setForm((prev) => ({ ...prev, tagId: scannedId }));

  const handleAddTag = () => {
    if (!form.tagId.trim()) return;
    setTags((prev) => [...prev, {
      id: Date.now(), tagId: form.tagId.toUpperCase(), type: form.type,
      userId: null, userName: null, assignedAt: null, status: 'UNASSIGNED', lastUsed: null,
    }]);
    setShowAdd(false);
    setForm({ tagId: '', type: 'MIFARE_CLASSIC' });
  };

  const handleAssign = () => {
    const user = MOCK_USERS.find((u) => String(u.id) === String(assignUserId));
    if (!user) return;
    setTags((prev) => prev.map((t) =>
      t.id === showAssign.id
        ? { ...t, userId: user.id, userName: user.name, status: 'ACTIVE', assignedAt: new Date().toISOString().slice(0,10) }
        : t
    ));
    setShowAssign(null);
    setAssignUserId('');
  };

  const handleUnassign = (tagId) => {
    setTags((prev) => prev.map((t) =>
      t.id === tagId ? { ...t, userId: null, userName: null, status: 'UNASSIGNED', assignedAt: null } : t
    ));
  };

  const handleDelete = () => {
    setTags((prev) => prev.filter((t) => t.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>RFID Tag Management</h1>
        <p>Register, assign and manage RFID tags/cards</p>
      </div>

      <div className="card">
        <div className="filter-bar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search tag UID or user…" />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} tags</span>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)} id="register-tag-btn">
              ➕ Register Tag
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Tag UID</th>
                <th>Type</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Assigned On</th>
                <th>Last Used</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}><EmptyState icon="🏷️" title="No tags found" /></td></tr>
              ) : filtered.map((tag) => (
                <tr key={tag.id}>
                  <td>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'var(--primary)', background: 'rgba(0,212,255,0.08)', padding: '3px 10px', borderRadius: 5 }}>
                      📡 {tag.tagId}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tag.type}</td>
                  <td>
                    {tag.userName
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg,var(--primary),var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#000' }}>{tag.userName[0]}</div>
                          {tag.userName}
                        </span>
                      : <span style={{ color: 'var(--text-muted)', fontSize: 12, fontStyle: 'italic' }}>Unassigned</span>
                    }
                  </td>
                  <td>
                    <span className={`badge ${tag.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>{tag.status}</span>
                  </td>
                  <td style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>{tag.assignedAt || '—'}</td>
                  <td style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
                    {tag.lastUsed ? new Date(tag.lastUsed).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {!tag.userName
                        ? <button className="btn btn-primary btn-sm" onClick={() => setShowAssign(tag)}>Assign</button>
                        : <button className="btn btn-ghost btn-sm" onClick={() => handleUnassign(tag.id)}>Unassign</button>
                      }
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(tag.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Tag Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Register RFID Tag" icon="🏷️"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddTag}>Register Tag</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <RFIDScanBox onScan={handleScan} />
          <div className="form-group">
            <label className="form-label">Tag UID *</label>
            <input className="form-input" value={form.tagId} onChange={(e) => setForm({ ...form, tagId: e.target.value })} placeholder="e.g. TAG-0001 or ABC123" style={{ fontFamily: 'JetBrains Mono, monospace' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Tag Type</label>
            <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {TAG_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Assign Modal */}
      <Modal open={!!showAssign} onClose={() => setShowAssign(null)} title="Assign Tag to User" icon="👤"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowAssign(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAssign} disabled={!assignUserId}>Assign</button>
          </>
        }
      >
        {showAssign && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="alert alert-info">
              📡 Tag: <strong style={{ fontFamily: 'JetBrains Mono, monospace' }}>{showAssign.tagId}</strong> will be assigned to the selected user.
            </div>
            <div className="form-group">
              <label className="form-label">Select User</label>
              <select className="form-select" value={assignUserId} onChange={(e) => setAssignUserId(e.target.value)}>
                <option value="">— Select user —</option>
                {MOCK_USERS.filter((u) => u.status === 'ACTIVE').map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Tag" message="Permanently delete this RFID tag? If assigned, the user will lose access immediately." />
    </div>
  );
}
