import { useState } from 'react';
import { Modal, SearchBar, TagDisplay, ConfirmDialog, EmptyState } from '../components/UI';
import { MOCK_USERS } from '../data/mockData';

const DEPT_OPTIONS = ['IT', 'HR', 'Finance', 'Operations', 'Security', 'Management'];
const ROLE_OPTIONS = ['EMPLOYEE', 'ADMIN', 'SUPER_ADMIN'];

function StatusBadge({ status }) {
  return (
    <span className={`badge ${status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>{status}</span>
  );
}

export default function Users() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'EMPLOYEE', department: 'IT', tagId: '' });

  const filtered = users.filter((u) => {
    const s = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || (u.tagId || '').toLowerCase().includes(s);
    const matchFilter = filter === 'ALL' || u.status === filter;
    return matchSearch && matchFilter;
  });

  const openAdd = () => { setEditUser(null); setForm({ name: '', email: '', role: 'EMPLOYEE', department: 'IT', tagId: '' }); setShowModal(true); };
  const openEdit = (u) => { setEditUser(u); setForm({ name: u.name, email: u.email, role: u.role, department: u.department, tagId: u.tagId || '' }); setShowModal(true); };

  const handleSave = () => {
    if (editUser) {
      setUsers((prev) => prev.map((u) => u.id === editUser.id ? { ...u, ...form } : u));
    } else {
      setUsers((prev) => [...prev, { id: Date.now(), ...form, status: 'ACTIVE', createdAt: new Date().toISOString().slice(0,10) }]);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== deleteId));
    setDeleteId(null);
  };

  const toggleStatus = (id) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Register, manage and control RFID user access</p>
      </div>

      <div className="card">
        <div className="filter-bar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search name, email, tag…" />
          <select className="form-select" style={{ width: 140 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>{filtered.length} users</span>
            <button className="btn btn-primary btn-sm" onClick={openAdd} id="add-user-btn">
              ➕ Add User
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>RFID Tag</th>
                <th>Status</th>
                <th>Since</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}><EmptyState icon="👤" title="No users found" /></td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000', flexShrink: 0 }}>
                      {u.name[0]}
                    </div>
                    {u.name}
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</td>
                  <td>{u.department}</td>
                  <td>
                    <span className={`badge ${u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' ? 'badge-purple' : 'badge-primary'}`}>{u.role}</span>
                  </td>
                  <td><TagDisplay tagId={u.tagId} /></td>
                  <td><StatusBadge status={u.status} /></td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{u.createdAt}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}>✏️</button>
                      <button className={`btn btn-sm ${u.status === 'ACTIVE' ? 'btn-warning' : 'btn-success'}`}
                        style={u.status === 'ACTIVE' ? { background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', borderColor: 'rgba(245,158,11,0.3)' } : {}}
                        onClick={() => toggleStatus(u.id)}>
                        {u.status === 'ACTIVE' ? '🔒' : '🔓'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(u.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editUser ? 'Edit User' : 'Register New User'}
        icon={editUser ? '✏️' : '➕'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {editUser ? 'Save Changes' : 'Register User'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="user@company.com" />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLE_OPTIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="form-select" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                {DEPT_OPTIONS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">RFID Tag UID</label>
            <input className="form-input" value={form.tagId} onChange={(e) => setForm({ ...form, tagId: e.target.value })} placeholder="TAG-0000 or leave blank to assign later" style={{ fontFamily: 'JetBrains Mono, monospace' }} />
          </div>
        </div>
      </Modal>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to permanently delete this user? Their RFID tag access will also be revoked. This action cannot be undone."
      />
    </div>
  );
}
