import { useState } from 'react';
import { Modal, SearchBar, AccessBadge, EmptyState } from '../components/UI';

const ALL_LOGS = [
  { id: 1, tagId: 'TAG-0042', userName: 'Arjun Kumar', zone: 'Server Room A', status: 'GRANTED', timestamp: '2026-04-06T10:15:30', reader: 'RDR-001', ipAddress: '192.168.1.12' },
  { id: 2, tagId: 'TAG-0099', userName: 'Unknown', zone: 'Lab Block B', status: 'DENIED', timestamp: '2026-04-06T10:12:44', reader: 'RDR-003', ipAddress: '192.168.1.14' },
  { id: 3, tagId: 'TAG-0017', userName: 'Priya Sharma', zone: 'Main Gate', status: 'GRANTED', timestamp: '2026-04-06T10:08:21', reader: 'RDR-001', ipAddress: '192.168.1.10' },
  { id: 4, tagId: 'TAG-0031', userName: 'Rahul Verma', zone: 'Library', status: 'GRANTED', timestamp: '2026-04-06T10:05:10', reader: 'RDR-005', ipAddress: '192.168.1.15' },
  { id: 5, tagId: 'TAG-0055', userName: 'Unknown', zone: 'Admin Wing', status: 'DENIED', timestamp: '2026-04-06T09:58:33', reader: 'RDR-002', ipAddress: '192.168.1.13' },
  { id: 6, tagId: 'TAG-0081', userName: 'Sneha Nair', zone: 'Cafeteria', status: 'GRANTED', timestamp: '2026-04-06T09:55:07', reader: 'RDR-006', ipAddress: '192.168.1.16' },
  { id: 7, tagId: 'TAG-0012', userName: 'Dev Patel', zone: 'Server Room A', status: 'GRANTED', timestamp: '2026-04-06T09:50:44', reader: 'RDR-001', ipAddress: '192.168.1.12' },
  { id: 8, tagId: 'TAG-0099', userName: 'Unknown', zone: 'Server Room A', status: 'DENIED', timestamp: '2026-04-06T09:45:00', reader: 'RDR-001', ipAddress: '192.168.1.12' },
  { id: 9, tagId: 'TAG-0042', userName: 'Arjun Kumar', zone: 'Main Gate', status: 'GRANTED', timestamp: '2026-04-06T08:30:00', reader: 'RDR-001', ipAddress: '192.168.1.10' },
  { id: 10, tagId: 'TAG-0017', userName: 'Priya Sharma', zone: 'Library', status: 'GRANTED', timestamp: '2026-04-06T08:15:44', reader: 'RDR-005', ipAddress: '192.168.1.15' },
];

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'medium' });
}

export default function AccessLogs() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);

  const filtered = ALL_LOGS.filter((l) => {
    const matchSearch =
      l.tagId.toLowerCase().includes(search.toLowerCase()) ||
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.zone.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Access Logs</h1>
        <p>Full audit trail of all RFID access events</p>
      </div>

      <div className="card">
        {/* Filters */}
        <div className="filter-bar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search tag, user, zone…" />
          <select className="form-select" style={{ width: 150 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="GRANTED">Granted</option>
            <option value="DENIED">Denied</option>
          </select>
          <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
            {filtered.length} records
          </div>
          <button className="btn btn-ghost btn-sm">
            ⬇️ Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tag UID</th>
                <th>User</th>
                <th>Access Point</th>
                <th>Reader</th>
                <th>Status</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}><EmptyState icon="📋" title="No logs found" /></td></tr>
              ) : filtered.map((log) => (
                <tr key={log.id}>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{String(log.id).padStart(4, '0')}</td>
                  <td>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--primary)', background: 'rgba(0,212,255,0.08)', padding: '2px 8px', borderRadius: 4 }}>
                      {log.tagId}
                    </span>
                  </td>
                  <td>{log.userName}</td>
                  <td>🚪 {log.zone}</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)' }}>{log.reader}</td>
                  <td><AccessBadge status={log.status} /></td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(log)}>👁 View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Access Event Details" icon="📋"
        footer={<button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>}
      >
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['Tag UID', selected.tagId],
              ['User', selected.userName],
              ['Zone', selected.zone],
              ['Reader ID', selected.reader],
              ['IP Address', selected.ipAddress],
              ['Status', <AccessBadge status={selected.status} />],
              ['Timestamp', formatDateTime(selected.timestamp)],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
