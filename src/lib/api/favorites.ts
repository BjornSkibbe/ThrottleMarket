import { fetchClient } from './client'

const API_TIMEOUTS = {
  FETCH: 10000,
  SUBMIT: 15000,
} as const

interface FavoritesResponse {
  listingIds: string[]
}

interface ToggleFavoriteResponse {
  isFavorited: boolean
}

export async function fetchUserFavorites(): Promise<string[]> {
  const response = await fetchClient.get<FavoritesResponse>('/api/favorites', {
    timeout: API_TIMEOUTS.FETCH,
  })

  return response.data.listingIds
}

export async function toggleFavorite(listingId: string): Promise<boolean> {
  const response = await fetchClient.post<ToggleFavoriteResponse>(
    '/api/favorites',
    { listingId },
    {
      timeout: API_TIMEOUTS.SUBMIT,
    }
  )

  return response.data.isFavorited
}
