import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_URL || '';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('pos_token');
    if (!savedToken) {
      setLoading(false);
      return;
    }
    // Restore token immediately so ProtectedRoute doesn't flash /login
    setToken(savedToken);

    // Refresh user from DB — picks up any changes made on another device
    fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${savedToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(({ user: freshUser }) => {
        setUser(freshUser);
        localStorage.setItem('pos_user', JSON.stringify(freshUser));
      })
      .catch(() => {
        // Token expired or invalid — clear everything and force re-login
        setToken(null);
        setUser(null);
        localStorage.removeItem('pos_token');
        localStorage.removeItem('pos_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('pos_token', newToken);
    localStorage.setItem('pos_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('pos_token');
    localStorage.removeItem('pos_user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('pos_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
