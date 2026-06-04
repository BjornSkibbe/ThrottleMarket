/**
 * React Query Cache Configuration
 * 
 * Cache strategies and stale time configurations for different data types.
 */

/**
 * Cache time configurations (in milliseconds)
 */
export const CacheTimes = {
  // Static data that rarely changes
  STATIC: 1000 * 60 * 60, // 1 hour
  
  // User profile data
  USER_PROFILE: 1000 * 60 * 5, // 5 minutes
  
  // Listings data
  LISTINGS: 1000 * 60 * 2, // 2 minutes
  LISTING_DETAIL: 1000 * 60 * 5, // 5 minutes
  
  // Marketplace filters
  MARKETPLACE_FILTERS: 1000 * 60 * 10, // 10 minutes
  
  // Categories and enums
  CATEGORIES: 1000 * 60 * 60, // 1 hour
  
  // User's own listings
  USER_LISTINGS: 1000 * 60, // 1 minute
  
  // Search results
  SEARCH_RESULTS: 1000 * 60, // 1 minute
}

/**
 * Stale time configurations (in milliseconds)
 */
export const StaleTimes = {
  // Static data
  STATIC: 1000 * 60 * 30, // 30 minutes
  
  // User data
  USER_PROFILE: 1000 * 60 * 2, // 2 minutes
  
  // Listings
  LISTINGS: 1000 * 60, // 1 minute
  LISTING_DETAIL: 1000 * 60 * 3, // 3 minutes
  
  // Marketplace
  MARKETPLACE_FILTERS: 1000 * 60 * 5, // 5 minutes
  
  // Categories
  CATEGORIES: 1000 * 60 * 60, // 1 hour
  
  // User's own data
  USER_LISTINGS: 1000 * 30, // 30 seconds
  
  // Search
  SEARCH_RESULTS: 1000 * 30, // 30 seconds
}

/**
 * Get cache configuration for a specific data type
 */
export function getCacheConfig(dataType: keyof typeof CacheTimes) {
  return {
    staleTime: StaleTimes[dataType],
    gcTime: CacheTimes[dataType],
  }
}

/**
 * Cache invalidation strategies
 */
export const CacheInvalidation = {
  // Invalidate all listings
  invalidateListings: () => ['listings'],
  
  // Invalidate specific listing
  invalidateListing: (id: string) => ['listings', id],
  
  // Invalidate user's listings
  invalidateUserListings: (userId: string) => ['listings', 'user', userId],
  
  // Invalidate marketplace data
  invalidateMarketplace: () => ['marketplace'],
  
  // Invalidate user data
  invalidateUser: (userId: string) => ['user', userId],
  
  // Invalidate all
  invalidateAll: () => [],
}
