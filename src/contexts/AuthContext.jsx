import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);
const KEY = 'accoupal';

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => {
    const s = localStorage.getItem(`${KEY}_userId`);
    return s ? JSON.parse(s) : null;
  });
  const [username, setUsername] = useState(() => {
    const s = localStorage.getItem(`${KEY}_username`);
    return s ? JSON.parse(s) : '';
  });
  const [isGuest, setIsGuest] = useState(() => {
    const s = localStorage.getItem(`${KEY}_guest`);
    return s === 'true';
  });

  useEffect(() => { localStorage.setItem(`${KEY}_userId`, JSON.stringify(userId)); }, [userId]);
  useEffect(() => { localStorage.setItem(`${KEY}_username`, JSON.stringify(username)); }, [username]);
  useEffect(() => { localStorage.setItem(`${KEY}_guest`, isGuest ? 'true' : ''); }, [isGuest]);

  const login = useCallback(async (name, password) => {
    const res = await fetch(api('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error (${res.status})`);
    }
    const { userId: uid } = await res.json();
    localStorage.removeItem(`${KEY}_msgs`);
    localStorage.removeItem(`${KEY}_session`);
    localStorage.removeItem(`${KEY}_personality`);
    localStorage.removeItem(`${KEY}_guest`);
    setUserId(uid);
    setUsername(name);
    setIsGuest(false);
  }, []);

  const register = useCallback(async (name, password) => {
    const res = await fetch(api('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error (${res.status})`);
    }
    const { userId: uid } = await res.json();
    localStorage.removeItem(`${KEY}_msgs`);
    localStorage.removeItem(`${KEY}_session`);
    localStorage.removeItem(`${KEY}_personality`);
    localStorage.removeItem(`${KEY}_guest`);
    setUserId(uid);
    setUsername(name);
    setIsGuest(false);
  }, []);

  const guestLogin = useCallback(async () => {
    const res = await fetch(api('/api/auth/guest'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error (${res.status})`);
    }
    const { userId: uid, username: name } = await res.json();
    localStorage.removeItem(`${KEY}_msgs`);
    localStorage.removeItem(`${KEY}_session`);
    localStorage.removeItem(`${KEY}_personality`);
    setUserId(uid);
    setUsername(name || 'Guest');
    setIsGuest(true);
  }, []);

  const logout = useCallback(() => {
    if (userId) {
      fetch(api('/api/auth/logout'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      }).catch(() => {});
    }
    setUserId(null);
    setUsername('');
    setIsGuest(false);
    localStorage.removeItem(`${KEY}_userId`);
    localStorage.removeItem(`${KEY}_username`);
    localStorage.removeItem(`${KEY}_guest`);
    localStorage.removeItem(`${KEY}_session`);
    localStorage.removeItem(`${KEY}_msgs`);
    localStorage.removeItem(`${KEY}_personality`);
  }, [userId]);

  return (
    <AuthContext.Provider value={{ userId, username, isGuest, isAuthenticated: !!userId, login, register, guestLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
