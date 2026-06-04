'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { queryKeys } from '@/lib/react-query/keys'
import { logErrorWithStrategy } from '@/lib/logger/client'
import { authService } from '@/features/auth/services/auth.service'
import type { LoginInput } from '@/features/auth/lib/auth.schema'

export function useSignIn() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const result = await authService.signIn(credentials)

      if (result.isFailure()) {
        throw result.error
      }

      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() })
      router.push('/marketplace-dashboard')
      router.refresh()
    },
    onError: (error) => {
      logErrorWithStrategy(error, { action: 'sign_in' })
    },
  })
}
