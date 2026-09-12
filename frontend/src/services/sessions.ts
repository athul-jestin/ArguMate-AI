import api from '@services/api'
import type { SessionFull, SessionMinimal } from '@apptypes/index'

export interface CreateSessionPayload {
  topic: string
  keyPoints?: string
}

export const sessionsService = {
  list: () => api.get<SessionMinimal[]>('/sessions/').then((r) => r.data),

  create: (data: CreateSessionPayload) =>
    api.post<SessionMinimal>('/sessions/', data).then((r) => r.data),

  get: (id: string) => api.get<SessionFull>(`/sessions/${id}`).then((r) => r.data),

  remove: (id: string) => api.delete<{ message: string }>(`/sessions/${id}`).then((r) => r.data),
}
