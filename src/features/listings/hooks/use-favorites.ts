import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query/keys'
import { fetchUserFavorites, toggleFavorite } from '@/lib/api/favorites'
import { toast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function useUserFavorites() {
  const { data: session } = useSession()

  return useQuery({
    queryKey: queryKeys.favorites.user(),
    queryFn: async () => {
      try {
        return await fetchUserFavorites()
      } catch {
        // Always return empty array for any error to prevent undefined
        return []
      }
    },
    staleTime: 60 * 1000,
    retry: false, // Disable retries to avoid infinite loops
    enabled: !!session, // Only run query when user is authenticated
    select: (data) => {
      // Ensure we always return an array
      if (!data || !Array.isArray(data)) {
        return []
      }
      return data
    }
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const router = useRouter()

  return useMutation({
    mutationFn: async (listingId: string) => {
      // Check if user is authenticated before making API call
      if (!session) {
        // Redirect to sign-in page with current page as callback
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(currentPath)}`)
        return Promise.reject(new Error('Redirecting to sign-in'))
      }
      
      return toggleFavorite(listingId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.user() })
    },
    onError: (error) => {
      // Don't show error toast if we're redirecting
      if (error.message !== 'Redirecting to sign-in') {
        toast({ title: 'Failed to update favorite', variant: 'destructive' })
      }
    },
  })
}
