import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, getProfile } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rfid_token');
    if (token) {
      getProfile()
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('rfid_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await apiLogin({ username, password });
    localStorage.setItem('rfid_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('rfid_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
