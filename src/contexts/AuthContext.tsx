'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncedUid, setSyncedUid] = useState<string | null>(null);

  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL as string) || 'http://127.0.0.1:8787';

  const ensureUserInBackend = async (uid: string) => {
    try {
      await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: uid }),
      });
      setSyncedUid(uid);
    } catch (error) {
      console.error('Error sincronizando usuario en backend:', error);
    }
  };

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      const current = auth.currentUser;
      if (current?.uid) {
        await ensureUserInBackend(current.uid);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
      if (user?.uid && user.uid !== syncedUid) {
        ensureUserInBackend(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
};
