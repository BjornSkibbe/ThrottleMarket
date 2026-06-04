/**
 * Auth Query Hooks
 * 
 * Custom React Query hooks for authentication-related data fetching.
 * 
 * NOTE: Requires @tanstack/react-query to be installed.
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../keys'
import { CacheTimes, StaleTimes } from '../cache'
import { logErrorWithStrategy } from '../../logger/client'
import { ApiError, ApiErrorCode } from '../../errors'
import { authService } from '@/features/auth/services/auth.service'
import type { LoginInput, RegisterInput } from '@/features/auth/lib/auth.schema'

/**
 * Fetch current user session
 */
export function useSession() {
  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: async () => {
      const response = await fetch('/api/auth/session')
      if (!response.ok) {
        throw new ApiError('Failed to fetch session', ApiErrorCode.INTERNAL_SERVER_ERROR, { statusCode: response.status })
      }
      return response.json()
    },
    staleTime: StaleTimes.USER_PROFILE,
    gcTime: CacheTimes.USER_PROFILE,
    retry: false, // Don't retry auth errors
  })
}

/**
 * Fetch user profile
 */
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: queryKeys.auth.user(userId),
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) {
        throw new ApiError('Failed to fetch user profile', ApiErrorCode.INTERNAL_SERVER_ERROR, { statusCode: response.status })
      }
      return response.json()
    },
    staleTime: StaleTimes.USER_PROFILE,
    gcTime: CacheTimes.USER_PROFILE,
    enabled: !!userId,
  })
}

/**
 * Login mutation
 */
export function useLogin() {
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
      // Invalidate session query
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() })
    },
    onError: (error: unknown) => {
      logErrorWithStrategy(error, { action: 'login' })
    },
  })
}

/**
 * Register mutation
 */
export function useRegister() {
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
      // Invalidate session query
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() })
    },
    onError: (error: unknown) => {
      logErrorWithStrategy(error, { action: 'register' })
    },
  })
}

/**
 * Logout mutation
 */
export function useLogout() {
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
      // Clear all queries
      queryClient.clear()
    },
    onError: (error: unknown) => {
      logErrorWithStrategy(error, { action: 'logout' })
    },
  })
}
