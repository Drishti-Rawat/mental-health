import apiClient from './apiClient';

export interface PsychologistData {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  specialties: string[];
  qualifications?: string;
  experienceYears: number;
  consultationFee: number;
  currency?: string;
  bio?: string;
  image?: string;
  languages?: string[];
  availableSlots?: string[];
  rating?: number;
  reviewCount?: number;
  status: 'pending_approval' | 'approved' | 'active' | 'inactive' | 'rejected' | string;
  createdAt?: string;
}

export interface PsychologistsStats {
  total: number;
  active: number;
  pending: number;
  inactive: number;
  avgFee: number;
  avgExperience: number;
}

export interface PsychologistsListResponse {
  success: boolean;
  count: number;
  pagination?: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  stats: PsychologistsStats;
  psychologists: PsychologistData[];
}

export interface SinglePsychologistResponse {
  success: boolean;
  message?: string;
  psychologist: PsychologistData;
  inviteUrl?: string;
  token?: string;
}

export interface PsychologistPayload {
  name: string;
  email: string;
  phone?: string;
  title?: string;
  specialties?: string[] | string;
  qualifications?: string;
  experienceYears?: number;
  consultationFee?: number;
  currency?: string;
  bio?: string;
  image?: string;
  languages?: string[] | string;
  status?: 'pending_approval' | 'approved' | 'active' | 'inactive' | 'rejected' | string;
}

/**
 * Fetch list of psychologists with pagination, search & status filter
 */
export const getPsychologistsApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  specialty?: string;
  minExperience?: number;
  maxFee?: number;
  language?: string;
  sort?: string;
}): Promise<PsychologistsListResponse> => {
  const response = await apiClient.get<PsychologistsListResponse>('/api/psychologists', { params });
  return response.data;
};

/**
 * Fetch distinct specialties directly from backend MongoDB
 */
export const getSpecialtiesApi = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; specialties: string[] }>('/api/psychologists/specialties');
    if (response.data.success && Array.isArray(response.data.specialties)) {
      return response.data.specialties;
    }
  } catch (err) {
    console.warn('Backend specialties fetch fallback note.');
  }
  return [
    'All Specializations',
    'Anxiety & Stress',
    'Depression & Mood',
    'Relationship Counselling',
    'Child & Adolescent Therapy',
    'Trauma & PTSD',
    'Career & Growth',
    'Self Care & Wellbeing',
  ];
};

/**
 * Fetch psychologist details by ID
 */
export const getPsychologistByIdApi = async (id: string): Promise<SinglePsychologistResponse> => {
  const response = await apiClient.get<SinglePsychologistResponse>(`/api/psychologists/${id}`);
  return response.data;
};

/**
 * Create a new psychologist (Admin action)
 */
export const createPsychologistApi = async (payload: PsychologistPayload): Promise<SinglePsychologistResponse> => {
  const response = await apiClient.post<SinglePsychologistResponse>('/api/psychologists', payload);
  return response.data;
};

/**
 * Approve a therapist & generate Magic Link (Admin action)
 */
export const approvePsychologistApi = async (id: string): Promise<SinglePsychologistResponse> => {
  const response = await apiClient.patch<SinglePsychologistResponse>(`/api/psychologists/${id}/approve`);
  return response.data;
};

/**
 * Reject a therapist application (Admin action)
 */
export const rejectPsychologistApi = async (id: string): Promise<SinglePsychologistResponse> => {
  const response = await apiClient.patch<SinglePsychologistResponse>(`/api/psychologists/${id}/reject`);
  return response.data;
};

/**
 * Therapist Public Self-Application
 */
export const applyPsychologistApi = async (payload: PsychologistPayload): Promise<SinglePsychologistResponse> => {
  const response = await apiClient.post<SinglePsychologistResponse>('/api/psychologists/apply', payload);
  return response.data;
};

/**
 * Verify Magic Invitation Link Token
 */
export const verifyInviteTokenApi = async (token: string): Promise<{
  success: boolean;
  valid: boolean;
  message?: string;
  practitioner?: { name: string; email: string; title: string };
}> => {
  const response = await apiClient.get('/api/auth/verify-invite-token', { params: { token } });
  return response.data;
};

/**
 * Set password with magic token and activate account
 */
export const setPasswordWithTokenApi = async (token: string, password: string): Promise<{
  success: boolean;
  message: string;
  user: any;
  accessToken: string;
}> => {
  const response = await apiClient.post('/api/auth/set-password-with-token', { token, password });
  return response.data;
};

/**
 * Update psychologist details by ID (Admin or Therapist action)
 */
export const updatePsychologistApi = async (id: string, payload: Partial<PsychologistPayload>): Promise<SinglePsychologistResponse> => {
  const response = await apiClient.put<SinglePsychologistResponse>(`/api/psychologists/${id}`, payload);
  return response.data;
};

/**
 * Delete a psychologist profile by ID (Admin action)
 */
export const deletePsychologistApi = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete(`/api/psychologists/${id}`);
  return response.data;
};
