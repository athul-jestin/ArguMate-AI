import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { debatesService } from '@services/debates'
import { sessionsService, type CreateSessionPayload } from '@services/sessions'

const SESSIONS_KEY = ['sessions'] as const

export function useSessions() {
  return useQuery({
    queryKey: SESSIONS_KEY,
    queryFn: sessionsService.list,
  })
}

export function useSession(sessionId: string | null) {
  return useQuery({
    queryKey: ['sessions', sessionId],
    queryFn: () => sessionsService.get(sessionId as string),
    enabled: !!sessionId,
  })
}

export function useCreateSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSessionPayload) => sessionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY })
    },
  })
}

export function useDeleteSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => sessionsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY })
    },
  })
}

export function usePostTurn() {
  return useMutation({
    mutationFn: (sessionId: string) => debatesService.postTurn(sessionId),
  })
}
