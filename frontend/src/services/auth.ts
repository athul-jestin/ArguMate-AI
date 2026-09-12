import api from '@services/api'
import type { TokenResponse, User } from '@apptypes/index'

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const authService = {
  register: (data: RegisterPayload) => api.post<User>('/auth/register', data).then((r) => r.data),

  login: (data: LoginPayload) => api.post<TokenResponse>('/auth/login', data).then((r) => r.data),

  getMe: () => api.get<User>('/auth/me').then((r) => r.data),
}
