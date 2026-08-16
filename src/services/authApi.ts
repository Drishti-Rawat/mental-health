import apiClient from './apiClient';

export type UserRole = 'user' | 'therapist' | 'admin' | 'supervisor' | 'superadmin';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'pending_approval' | 'approved' | 'inactive' | 'rejected' | string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: UserData;
  accessToken: string | null;
  isPendingApproval?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'therapist';
}

export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Register new patient or therapist application
 */
export const registerApi = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/auth/register', payload);
  return response.data;
};

/**
 * Patient Login (standard)
 */
export const loginApi = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/auth/login', payload);
  return response.data;
};

/**
 * Dedicated Therapist Clinical Portal Login
 */
export const loginTherapistApi = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/auth/therapist-login', payload);
  return response.data;
};

/**
 * Refresh access token using HTTP-only cookie
 */
export const refreshApi = async (): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/auth/refresh');
  return response.data;
};

/**
 * Single device logout
 */
export const logoutApi = async (): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>('/api/auth/logout');
  return response.data;
};

/**
 * Fetch authenticated user profile
 */
export const getMeApi = async (): Promise<{ success: boolean; user: UserData }> => {
  const response = await apiClient.get<{ success: boolean; user: UserData }>('/api/auth/me');
  return response.data;
};
