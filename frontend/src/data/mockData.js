// Mock data for demonstration when backend is not connected
export const MOCK_STATS = {
  totalUsers: 142,
  activeUsers: 128,
  todayAccess: 87,
  deniedToday: 5,
  activePoints: 12,
  alertsToday: 3,
};

export const MOCK_RECENT_LOGS = [
  { id: 1, tagId: 'TAG-0042', userName: 'Arjun Kumar', zone: 'Server Room A', status: 'GRANTED', timestamp: '2026-04-06T10:15:30' },
  { id: 2, tagId: 'TAG-0099', userName: 'Unknown', zone: 'Lab Block B', status: 'DENIED', timestamp: '2026-04-06T10:12:44' },
  { id: 3, tagId: 'TAG-0017', userName: 'Priya Sharma', zone: 'Main Gate', status: 'GRANTED', timestamp: '2026-04-06T10:08:21' },
  { id: 4, tagId: 'TAG-0031', userName: 'Rahul Verma', zone: 'Library', status: 'GRANTED', timestamp: '2026-04-06T10:05:10' },
  { id: 5, tagId: 'TAG-0055', userName: 'Unknown', zone: 'Admin Wing', status: 'DENIED', timestamp: '2026-04-06T09:58:33' },
  { id: 6, tagId: 'TAG-0081', userName: 'Sneha Nair', zone: 'Cafeteria', status: 'GRANTED', timestamp: '2026-04-06T09:55:07' },
  { id: 7, tagId: 'TAG-0012', userName: 'Dev Patel', zone: 'Server Room A', status: 'GRANTED', timestamp: '2026-04-06T09:50:44' },
];

export const MOCK_USERS = [
  { id: 1, name: 'Arjun Kumar', email: 'arjun@rfid.local', role: 'EMPLOYEE', department: 'IT', status: 'ACTIVE', tagId: 'TAG-0042', createdAt: '2025-01-15' },
  { id: 2, name: 'Priya Sharma', email: 'priya@rfid.local', role: 'EMPLOYEE', department: 'HR', status: 'ACTIVE', tagId: 'TAG-0017', createdAt: '2025-02-20' },
  { id: 3, name: 'Rahul Verma', email: 'rahul@rfid.local', role: 'ADMIN', department: 'Security', status: 'ACTIVE', tagId: 'TAG-0031', createdAt: '2024-12-01' },
  { id: 4, name: 'Sneha Nair', email: 'sneha@rfid.local', role: 'EMPLOYEE', department: 'Finance', status: 'ACTIVE', tagId: 'TAG-0081', createdAt: '2025-03-10' },
  { id: 5, name: 'Dev Patel', email: 'dev@rfid.local', role: 'EMPLOYEE', department: 'Operations', status: 'ACTIVE', tagId: 'TAG-0012', createdAt: '2025-01-28' },
  { id: 6, name: 'Kavya Reddy', email: 'kavya@rfid.local', role: 'EMPLOYEE', department: 'IT', status: 'INACTIVE', tagId: null, createdAt: '2024-11-05' },
];

export const MOCK_ACCESS_POINTS = [
  { id: 1, name: 'Main Gate', location: 'Building A - Entry', status: 'ONLINE', type: 'ENTRY_EXIT', accessLevel: 'ALL' },
  { id: 2, name: 'Server Room A', location: 'IT Block, Floor 2', status: 'ONLINE', type: 'RESTRICTED', accessLevel: 'IT_ADMIN' },
  { id: 3, name: 'Lab Block B', location: 'Science Wing, Floor 1', status: 'ONLINE', type: 'ENTRY_EXIT', accessLevel: 'STAFF' },
  { id: 4, name: 'Admin Wing', location: 'Building B, Floor 3', status: 'OFFLINE', type: 'RESTRICTED', accessLevel: 'ADMIN' },
  { id: 5, name: 'Library', location: 'Central Block', status: 'ONLINE', type: 'ENTRY_EXIT', accessLevel: 'ALL' },
  { id: 6, name: 'Cafeteria', location: 'Ground Floor Block C', status: 'ONLINE', type: 'ENTRY_EXIT', accessLevel: 'ALL' },
];

export const MOCK_ALERTS = [
  { id: 1, type: 'UNAUTHORIZED_ACCESS', message: 'Multiple failed attempts at Admin Wing', zone: 'Admin Wing', tagId: 'TAG-0099', severity: 'HIGH', acknowledged: false, timestamp: '2026-04-06T10:12:44' },
  { id: 2, type: 'READER_OFFLINE', message: 'RFID Reader at Admin Wing is offline', zone: 'Admin Wing', severity: 'MEDIUM', acknowledged: false, timestamp: '2026-04-06T09:30:00' },
  { id: 3, type: 'UNAUTHORIZED_ACCESS', message: 'Unknown tag presented at Server Room A', zone: 'Server Room A', tagId: 'TAG-0055', severity: 'HIGH', acknowledged: true, timestamp: '2026-04-06T08:45:22' },
];

export const MOCK_TREND = [
  { day: 'Mon', granted: 65, denied: 3 },
  { day: 'Tue', granted: 78, denied: 7 },
  { day: 'Wed', granted: 53, denied: 2 },
  { day: 'Thu', granted: 91, denied: 5 },
  { day: 'Fri', granted: 87, denied: 8 },
  { day: 'Sat', granted: 42, denied: 1 },
  { day: 'Sun', granted: 23, denied: 0 },
];
