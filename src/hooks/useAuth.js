import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authState = localStorage.getItem('isAuthenticated') === 'true';
    if (authState) {
      setUser({ isAdmin: true });
    }
    setLoading(false);
  }, []);

  const loginWithPassword = async (password) => {
    try {
      const adminDoc = await getDoc(doc(db, 'admin', 'config'));
      if (!adminDoc.exists()) {
        throw new Error('Admin configuration not found');
      }

      const { adminPassword } = adminDoc.data();

      if (password !== adminPassword) {
        throw new Error('Invalid password');
      }

      setUser({ isAdmin: true });
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('isAuthenticated');
  };

  const value = {
    user,
    loading,
    loginWithPassword,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}