'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { queryKeys } from '@/lib/react-query/keys'
import { logErrorWithStrategy } from '@/lib/logger/client'
import { authService } from '@/features/auth/services/auth.service'
import type { RegisterInput } from '@/features/auth/lib/auth.schema'

export function useSignUp() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const result = await authService.signUp(data)

      if (result.isFailure()) {
        throw result.error
      }

      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() })
      router.push('/auth/signin?registered=true')
    },
    onError: (error) => {
      logErrorWithStrategy(error, { action: 'sign_up' })
    },
  })
}
