'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserData,
  LoginPayload,
  RegisterPayload,
  loginApi,
  loginTherapistApi,
  registerApi,
  logoutApi,
  getMeApi,
  refreshApi,
} from '../services/authApi';
import { loginAdminApi, refreshAdminApi, logoutAdminApi } from '../services/adminApi';
import { setAccessToken } from '../services/apiClient';

interface AuthContextType {
  user: UserData | null;
  accessToken: string | null;
  loading: boolean;
  login: (credentials: LoginPayload) => Promise<UserData>;
  loginTherapist: (credentials: LoginPayload) => Promise<UserData>;
  loginAdmin: (credentials: LoginPayload) => Promise<UserData>;
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

  // Check initial session on mount via domain-aware HTTP-only cookie refresh
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const path = typeof window !== 'undefined' ? window.location.pathname : '';
        const isAdminRoute = path.startsWith('/admin');

        let res: { accessToken: string | null; user: UserData };
        if (isAdminRoute) {
          const adminRes = await refreshAdminApi();
          res = { accessToken: adminRes.accessToken, user: adminRes.admin };
        } else {
          const userRes = await refreshApi();
          res = { accessToken: userRes.accessToken, user: userRes.user };
        }

        if (res.accessToken && res.user) {
          updateAccessToken(res.accessToken);
          setUser(res.user);
        }
      } catch (err) {
        // Active session missing or expired for target domain
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

  const loginTherapist = async (credentials: LoginPayload): Promise<UserData> => {
    const res = await loginTherapistApi(credentials);
    if (res.accessToken) {
      updateAccessToken(res.accessToken);
    }
    setUser(res.user);
    return res.user;
  };

  const loginAdmin = async (credentials: LoginPayload): Promise<UserData> => {
    const res = await loginAdminApi(credentials);
    if (res.accessToken) {
      updateAccessToken(res.accessToken);
    }
    setUser(res.admin);
    return res.admin;
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
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      const isAdminRoute = path.startsWith('/admin') || user?.role === 'admin' || user?.role === 'supervisor' || user?.role === 'superadmin';

      if (isAdminRoute) {
        await logoutAdminApi();
      } else {
        await logoutApi();
      }
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
        loginTherapist,
        loginAdmin,
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
