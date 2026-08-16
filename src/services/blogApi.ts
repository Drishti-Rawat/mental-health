import apiClient from './apiClient';

export interface BlogPost {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  category: 'Mental Health' | 'Therapy' | 'Self Care' | 'Mindfulness' | 'Psychology' | 'Wellness' | 'General';
  tags: string[];
  status: 'published' | 'draft' | 'archived';
  readTime: number;
  views: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMetadata {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BlogStats {
  total: number;
  published: number;
  drafts: number;
  totalViews: number;
}

export interface BlogsListResponse {
  success: boolean;
  count: number;
  pagination?: PaginationMetadata;
  stats?: BlogStats;
  blogs: BlogPost[];
}

export interface SingleBlogResponse {
  success: boolean;
  blog: BlogPost;
}

/**
 * Fetch all blogs with optional search, category, status, and pagination
 */
export const getBlogsApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}): Promise<BlogsListResponse> => {
  const response = await apiClient.get<BlogsListResponse>('/api/blogs', { params });
  return response.data;
};

/**
 * Fetch single blog by ID or Slug
 */
export const getBlogByIdOrSlugApi = async (idOrSlug: string): Promise<SingleBlogResponse> => {
  const response = await apiClient.get<SingleBlogResponse>(`/api/blogs/${idOrSlug}`);
  return response.data;
};

/**
 * Upload Blog Cover Image to Cloudinary via backend endpoint
 */
export const uploadBlogImageApi = async (file: File, folder = 'blogs'): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post<{ success: boolean; url: string }>('/api/upload/image', formData, {
    params: { folder },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Create a new blog post
 */
export const createBlogApi = async (payload: Partial<BlogPost>): Promise<SingleBlogResponse> => {
  const response = await apiClient.post<SingleBlogResponse>('/api/blogs', payload);
  return response.data;
};

/**
 * Update an existing blog post
 */
export const updateBlogApi = async (id: string, payload: Partial<BlogPost>): Promise<SingleBlogResponse> => {
  const response = await apiClient.put<SingleBlogResponse>(`/api/blogs/${id}`, payload);
  return response.data;
};

/**
 * Delete a blog post
 */
export const deleteBlogApi = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete<{ success: boolean; message: string }>(`/api/blogs/${id}`);
  return response.data;
};
