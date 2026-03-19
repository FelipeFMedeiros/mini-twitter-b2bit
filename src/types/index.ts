
export interface User {
  id: number
  name: string
  email: string
  username?: string
  avatar?: string
  createdAt: string
}

export interface Post {
  id: number
  title: string
  content: string
  image: string | null
  authorId: number
  authorName: string
  likesCount: number
  likedByMe?: boolean
  createdAt: string
  updatedAt?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export interface PaginatedResponse<T> {
  posts: T[]
  total: number
  page: number
  limit: number
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
