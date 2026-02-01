import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, logoutUser, CurrentUser } from '@/lib/auth';

interface AuthContextType {
  user: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshUser: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  useEffect(() => {
    refreshUser();
    setIsLoading(false);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    refreshUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
