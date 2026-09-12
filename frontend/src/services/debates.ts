import api from '@services/api'
import type { TurnResponse } from '@apptypes/index'

export const debatesService = {
  postTurn: (sessionId: string) =>
    api.post<TurnResponse>(`/sessions/${sessionId}/turns`).then((r) => r.data),
}
