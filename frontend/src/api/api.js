import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rfid_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rfid_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────
export const login = (credentials) => api.post('/auth/login', credentials);
export const getProfile = () => api.get('/auth/profile');

// ─── Users ───────────────────────────────────────────────────
export const getUsers = (params) => api.get('/users', { params });
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const deactivateUser = (id) => api.put(`/users/${id}/deactivate`);
export const activateUser = (id) => api.put(`/users/${id}/activate`);

// ─── RFID Tags ────────────────────────────────────────────────
export const getTags = (params) => api.get('/tags', { params });
export const registerTag = (data) => api.post('/tags', data);
export const unassignTag = (tagId) => api.put(`/tags/${tagId}/unassign`);
export const deleteTag = (tagId) => api.delete(`/tags/${tagId}`);

// ─── Access Logs ──────────────────────────────────────────────
export const getAccessLogs = (params) => api.get('/access-logs', { params });
export const getRecentLogs = (limit = 10) => api.get('/access-logs/recent', { params: { limit } });

// ─── Access Points (Zones/Doors) ──────────────────────────────
export const getAccessPoints = () => api.get('/access-points');
export const createAccessPoint = (data) => api.post('/access-points', data);
export const updateAccessPoint = (id, data) => api.put(`/access-points/${id}`, data);
export const deleteAccessPoint = (id) => api.delete(`/access-points/${id}`);

// ─── Alerts ───────────────────────────────────────────────────
export const getAlerts = (params) => api.get('/alerts', { params });
export const acknowledgeAlert = (id) => api.put(`/alerts/${id}/acknowledge`);
export const getUnacknowledgedCount = () => api.get('/alerts/unacknowledged/count');

// ─── Dashboard Stats ──────────────────────────────────────────
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getAccessTrend = (days = 7) => api.get('/dashboard/trend', { params: { days } });

export default api;
