'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserData,
  LoginPayload,
  RegisterPayload,
  loginApi,
  registerApi,
  logoutApi,
  getMeApi,
  refreshApi,
} from '../services/authApi';
import { setAccessToken } from '../services/apiClient';

interface AuthContextType {
  user: UserData | null;
  accessToken: string | null;
  loading: boolean;
  login: (credentials: LoginPayload) => Promise<UserData>;
  register: (payload: RegisterPayload) => Promise<{ user: UserData; isPendingApproval?: boolean }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const updateAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    setAccessToken(token);
  };

  // Check initial session on mount via HTTP-only cookie refresh
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Attempt silent refresh
        const res = await refreshApi();
        if (res.accessToken && res.user) {
          updateAccessToken(res.accessToken);
          setUser(res.user);
        }
      } catch (err) {
        // No active session cookie or expired
        updateAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginPayload): Promise<UserData> => {
    const res = await loginApi(credentials);
    if (res.accessToken) {
      updateAccessToken(res.accessToken);
    }
    setUser(res.user);
    return res.user;
  };

  const register = async (payload: RegisterPayload) => {
    const res = await registerApi(payload);
    if (res.accessToken && res.user && res.user.status === 'active') {
      updateAccessToken(res.accessToken);
      setUser(res.user);
    }
    return { user: res.user, isPendingApproval: res.isPendingApproval };
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      updateAccessToken(null);
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await getMeApi();
      if (res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken: accessTokenState,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
