import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query/keys'
import { fetchUserFavorites, toggleFavorite } from '@/lib/api/favorites'
import { toast } from '@/hooks/use-toast'

export function useUserFavorites() {
  return useQuery({
    queryKey: queryKeys.favorites.user(),
    queryFn: fetchUserFavorites,
    staleTime: 60 * 1000,
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (listingId: string) => {
      return toggleFavorite(listingId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.user() })
    },
    onError: () => {
      toast({ title: 'Failed to update favorite', variant: 'destructive' })
    },
  })
}
