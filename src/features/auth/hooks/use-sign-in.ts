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
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() })
      
      // Wait a moment for the session to be established
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Check for callback URL from query parameters
      const urlParams = new URLSearchParams(window.location.search)
      const callbackUrl = urlParams.get('callbackUrl')
      
      // Redirect to callback URL or default to marketplace
      const redirectUrl = callbackUrl || '/marketplace-dashboard'
      router.push(redirectUrl)
      router.refresh()
    },
    onError: (error) => {
      logErrorWithStrategy(error, { action: 'sign_in' })
    },
  })
}
