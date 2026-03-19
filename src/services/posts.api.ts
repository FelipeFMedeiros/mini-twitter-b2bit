import api from '@/lib/axios'
import type { Post, PaginatedResponse } from '@/types'

export interface GetPostsParams {
  page?: number
  search?: string
}

export const postsApi = {
  getAll: (params?: GetPostsParams) =>
    api.get<PaginatedResponse<Post>>('/posts', { params }),

  getById: (id: number) =>
    api.get<Post>(`/posts/${id}`),

  create: (data: FormData | { title: string; content: string; image?: string }) =>
    api.post<Post>('/posts', data),

  update: (id: number, data: Partial<{ title: string; content: string; image?: string }>) =>
    api.put<Post>(`/posts/${id}`, data),

  remove: (id: number) =>
    api.delete(`/posts/${id}`),

  like: (id: number) =>
    api.post(`/posts/${id}/like`),
}
