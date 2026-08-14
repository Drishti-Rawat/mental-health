import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// In-memory access token storage
let inMemoryAccessToken: string | null = null;
let onTokenRefreshedCallback: ((newToken: string | null) => void) | null = null;

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
  if (onTokenRefreshedCallback) {
    onTokenRefreshedCallback(token);
  }
};

export const getAccessToken = () => inMemoryAccessToken;

export const setOnTokenRefreshedListener = (callback: (newToken: string | null) => void) => {
  onTokenRefreshedCallback = callback;
};

// Create main Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send HTTP-only cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag and queue to handle concurrent request retries during token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach Access Token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (inMemoryAccessToken && config.headers) {
      config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor: Route-Aware 401 Unauthorized & Silent Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Bypass refresh for authentication endpoints (login, register, refresh, password setup)
    const reqUrl = (originalRequest?.url || '').toLowerCase();
    const isAuthEndpoint =
      reqUrl.includes('login') ||
      reqUrl.includes('register') ||
      reqUrl.includes('refresh') ||
      reqUrl.includes('set-password') ||
      reqUrl.includes('verify-invite-token');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Determine appropriate refresh endpoint based on target API domain
      const isAdminRequest = originalRequest?.url?.includes('/api/admin');
      const refreshEndpoint = isAdminRequest
        ? `${API_BASE_URL}/api/admin/auth/refresh`
        : `${API_BASE_URL}/api/auth/refresh`;

      try {
        // Attempt silent refresh using role-specific HTTP-only cookie
        const refreshResponse = await axios.post(
          refreshEndpoint,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.accessToken;
        setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr as Error, null);
        isRefreshing = false;
        setAccessToken(null);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
