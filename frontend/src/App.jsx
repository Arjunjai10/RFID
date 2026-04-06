import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useToast } from './hooks/hooks';
import { ToastContainer } from './components/UI';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AccessLogs from './pages/AccessLogs';
import Users from './pages/Users';
import RFIDTags from './pages/RFIDTags';
import AccessPoints from './pages/AccessPoints';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { MOCK_ALERTS } from './data/mockData';

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();
  const { toasts } = useToast();
  const unackAlerts = MOCK_ALERTS.filter((a) => !a.acknowledged).length;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16, animation: 'pulse 1.5s ease infinite' }}>📡</div>
          <div style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>Initializing RFID SecureOps…</div>
        </div>
      </div>
    );
  }

  // Demo: bypass auth check — in production check isAuthenticated
  return (
    <div className="app-layout">
      <Sidebar alertCount={unackAlerts} />
      <div className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/access-logs" element={<AccessLogs />} />
          <Route path="/users" element={<Users />} />
          <Route path="/rfid-tags" element={<RFIDTags />} />
          <Route path="/access-points" element={<AccessPoints />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
