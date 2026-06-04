'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logErrorWithStrategy } from '@/lib/logger/client'
import { authService } from '@/features/auth/services/auth.service'

export function useSignOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const result = await authService.signOut()

      if (result.isFailure()) {
        throw result.error
      }

      return result.value
    },
    onSuccess: () => {
      queryClient.clear()
    },
    onError: (error) => {
      logErrorWithStrategy(error, { action: 'sign_out' })
    },
  })
}
