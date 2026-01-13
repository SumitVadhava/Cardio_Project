// src/providers/AuthProvider.tsx - Layout provider (auth removed)

'use client';

import { createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { User } from '../types';
import { MobileNav } from '../components/layout/MobileNav';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default user for demo mode
const defaultUser: User = {
  id: 'user-1',
  email: 'doctor@hospital.com',
  name: 'Dr. Demo User',
  role: 'doctor',
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Mock auth functions (no-op since auth is disabled)
  const login = async (email: string, password: string) => {
    // No-op
  };

  const logout = async () => {
    // No-op
  };

  const value = {
    user: defaultUser,
    isLoading: false,
    isAuthenticated: true,
    login,
    logout,
  };

  // Always show main app with layout (no login required)
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

