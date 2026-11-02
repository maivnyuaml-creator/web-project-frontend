'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { authApi } from '@/lib/api';
import { setAuthToken, removeAuthToken, getAuthToken } from '@/lib/auth/token';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password?: string; rememberMe?: boolean }) => Promise<{ success: boolean; error?: string }>;
  register: (payload: { username: string; email: string; password?: string; ageConsent: boolean }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateTokenBalance: (newBalance: number) => void;
  // Dev switch to easily preview different user views (Viewer, Creator, Admin) when local backend isn't running
  devSwitchRole?: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        const currentToken = getAuthToken() || 'jwt-active-session';
        setAuthToken(currentToken, res.data.role);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    authApi
      .getMe()
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data) {
          setUser(res.data);
          const currentToken = getAuthToken() || 'jwt-active-session';
          setAuthToken(currentToken, res.data.role);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: { email: string; password?: string; rememberMe?: boolean }) => {
    try {
      const res = await authApi.login(credentials);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        const token = (res.data as { token?: string }).token || 'jwt-active-token';
        setAuthToken(token, res.data.user.role);
        return { success: true };
      }
      return { success: false, error: res.message || 'Login failed' };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Invalid credentials';
      return { success: false, error: errorMsg };
    }
  };

  const register = async (payload: { username: string; email: string; password?: string; ageConsent: boolean }) => {
    try {
      const res = await authApi.register(payload);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        const token = (res.data as { token?: string }).token || 'jwt-active-token';
        setAuthToken(token, res.data.user.role);
        return { success: true };
      }
      return { success: false, error: res.message || 'Registration failed' };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Registration failed';
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      removeAuthToken();
      setUser(null);
    }
  };

  const updateTokenBalance = (newBalance: number) => {
    setUser(prev => prev ? { ...prev, tokenBalance: newBalance } : null);
  };

  // Development convenience role switcher for testing all interfaces without backend seed
  const devSwitchRole = (role: UserRole) => {
    const mockUser: User = {
      id: `dev-${role.toLowerCase()}-1`,
      email: `${role.toLowerCase()}@veloralive.com`,
      username: `${role.toLowerCase()}_demo`,
      displayName: role === 'CREATOR' ? 'Aurora Velvet' : role === 'ADMIN' ? 'Compliance Admin' : 'VIP Viewer Alex',
      role,
      status: 'ACTIVE',
      emailVerified: true,
      twoFactorEnabled: false,
      tokenBalance: role === 'VIEWER' ? 1250 : role === 'CREATOR' ? 84200 : 0,
      avatarUrl: role === 'CREATOR'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUser(mockUser);
    setAuthToken(`mock-dev-jwt-${role.toLowerCase()}`, role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateTokenBalance,
        devSwitchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
