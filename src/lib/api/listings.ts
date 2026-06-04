import { Category, Brand, Condition, Location, Model, Type, ListingData, Size, ListingStatus } from "@/types"
import { ApiError, ApiErrorCode } from "@/lib/errors"

interface ListingImage {
  url: string
  order: number
}

interface ApiListing {
  title: string
  description: string
  price: number
  category: Category
  brand: Brand
  size: Size | ""
  condition: Condition
  location: Location
  status: ListingStatus
  images: ListingImage[]
  motorcycle?: {
    model: Model
    type: Type
    year: number
    mileage: number
    engineSize: number
  }
}

const API_TIMEOUTS = {
  FETCH: 10000,
  SUBMIT: 15000,
} as const

async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again.', ApiErrorCode.TIMEOUT_ERROR)
    }
    throw error
  }
}

async function getCSRFToken(): Promise<string> {
  const response = await fetch('/api/csrf')
  if (!response.ok) {
    throw new ApiError('Failed to fetch CSRF token', ApiErrorCode.INTERNAL_SERVER_ERROR)
  }
  const data = await response.json()
  return data.csrfToken
}

export async function fetchListing(listingId: string): Promise<ApiListing> {
  if (!listingId) {
    throw new ApiError('Listing ID is required', ApiErrorCode.BAD_REQUEST)
  }

  const response = await fetchWithTimeout(
    `/api/listings/${listingId}`,
    {},
    API_TIMEOUTS.FETCH
  )

  if (!response.ok) {
    throw new ApiError('Failed to fetch listing', ApiErrorCode.INTERNAL_SERVER_ERROR, { statusCode: response.status })
  }

  try {
    return await response.json()
  } catch (error) {
    throw new ApiError('Failed to parse response data', ApiErrorCode.PARSE_ERROR)
  }
}

export async function createListing(data: ListingData): Promise<void> {
  const csrfToken = await getCSRFToken()
  const response = await fetchWithTimeout(
    '/api/listings',
    {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken,
      },
      body: JSON.stringify(data),
    },
    API_TIMEOUTS.SUBMIT
  )

  if (!response.ok) {
    let errorMessage = 'Failed to create listing'
    try {
      const data = await response.json()
      errorMessage = data.error || errorMessage
    } catch {
      // Use default error message
    }
    throw new ApiError(errorMessage, ApiErrorCode.INTERNAL_SERVER_ERROR, { statusCode: response.status })
  }
}

export async function updateListing(listingId: string, data: ListingData): Promise<void> {
  const csrfToken = await getCSRFToken()
  const response = await fetchWithTimeout(
    `/api/listings/${listingId}`,
    {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken,
      },
      body: JSON.stringify(data),
    },
    API_TIMEOUTS.SUBMIT
  )

  if (!response.ok) {
    let errorMessage = 'Failed to update listing'
    try {
      const data = await response.json()
      errorMessage = data.error || errorMessage
    } catch {
      // Use default error message
    }
    throw new ApiError(errorMessage, ApiErrorCode.INTERNAL_SERVER_ERROR, { statusCode: response.status })
  }
}
