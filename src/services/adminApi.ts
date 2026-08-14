import apiClient from './apiClient';
import { UserData } from './authApi';

export interface AdminPayload {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'supervisor' | 'superadmin';
}

export interface AdminAuthResponse {
  success: boolean;
  message: string;
  admin: UserData;
  accessToken: string;
}

export interface PendingStaffResponse {
  success: boolean;
  count: number;
  pendingTherapists: UserData[];
  pendingAdmins: UserData[];
}

export interface PaginationMetadata {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UsersListResponse {
  success: boolean;
  count: number;
  pagination?: PaginationMetadata;
  stats: {
    total: number;
    patients: number;
    therapists: number;
    active: number;
    inactive: number;
  };
  users: UserData[];
}

export interface UserDetailsResponse {
  success: boolean;
  user: UserData;
}

/**
 * Register Admin or Supervisor application (pending approval)
 */
export const registerAdminApi = async (payload: AdminPayload) => {
  const response = await apiClient.post('/api/admin/auth/register', payload);
  return response.data;
};

/**
 * Admin / Supervisor Login
 */
export const loginAdminApi = async (payload: { email: string; password: string }): Promise<AdminAuthResponse> => {
  const response = await apiClient.post<AdminAuthResponse>('/api/admin/auth/login', payload);
  return response.data;
};

/**
 * Silent refresh for Admin / Supervisor
 */
export const refreshAdminApi = async (): Promise<AdminAuthResponse> => {
  const response = await apiClient.post<AdminAuthResponse>('/api/admin/auth/refresh');
  return response.data;
};

/**
 * Logout Admin session
 */
export const logoutAdminApi = async () => {
  const response = await apiClient.post('/api/admin/auth/logout');
  return response.data;
};

/**
 * Get pending staff applications (Therapists, Admins)
 */
export const getPendingStaffApi = async (): Promise<PendingStaffResponse> => {
  const response = await apiClient.get<PendingStaffResponse>('/api/admin/staff/pending');
  return response.data;
};

/**
 * Approve pending staff/admin
 */
export const approveStaffApi = async (id: string) => {
  const response = await apiClient.patch(`/api/admin/staff/${id}/approve`);
  return response.data;
};

/**
 * Reject pending staff/admin
 */
export const rejectStaffApi = async (id: string) => {
  const response = await apiClient.patch(`/api/admin/staff/${id}/reject`);
  return response.data;
};

/**
 * Get all registered patient and therapist users with pagination, search, role & status filters
 */
export const getUsersApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
}): Promise<UsersListResponse> => {
  const response = await apiClient.get<UsersListResponse>('/api/admin/users', { params });
  return response.data;
};

/**
 * Get detailed profile info for a user
 */
export const getUserDetailsApi = async (id: string): Promise<UserDetailsResponse> => {
  const response = await apiClient.get<UserDetailsResponse>(`/api/admin/users/${id}`);
  return response.data;
};

/**
 * Update user status (active, inactive, rejected)
 */
export const updateUserStatusApi = async (id: string, status: string) => {
  const response = await apiClient.patch(`/api/admin/users/${id}/status`, { status });
  return response.data;
};

/**
 * Delete user account
 */
export const deleteUserApi = async (id: string) => {
  const response = await apiClient.delete(`/api/admin/users/${id}`);
  return response.data;
};
