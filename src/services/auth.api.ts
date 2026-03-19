import api from '@/lib/axios'
import type { AuthResponse, User, LoginCredentials, RegisterCredentials } from '@/types'

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', credentials),

  register: (credentials: RegisterCredentials) =>
    api.post<User>('/auth/register', credentials),

  logout: () =>
    api.post('/auth/logout'),
}
