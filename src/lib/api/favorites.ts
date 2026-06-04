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
  try {
    const response = await fetchClient.get<FavoritesResponse>('/api/favorites', {
      timeout: API_TIMEOUTS.FETCH,
      // Prevent following redirects to avoid getting sign-in page HTML
      redirect: 'manual'
    })

    return response.data.listingIds
  } catch (error) {
    // Return empty array for any error to prevent undefined
    return []
  }
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
