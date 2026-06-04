/**
 * React Query Keys
 * 
 * Query key factory for consistent query key generation.
 */

/**
 * Query key factory
 */
export const queryKeys = {
  // Auth keys
  auth: {
    all: ['auth'] as const,
    user: (userId: string) => ['auth', 'user', userId] as const,
    session: () => ['auth', 'session'] as const,
  },
  
  // Listings keys
  listings: {
    all: ['listings'] as const,
    lists: () => ['listings', 'list'] as const,
    list: (filters: Record<string, unknown>) => ['listings', 'list', filters] as const,
    details: () => ['listings', 'detail'] as const,
    detail: (id: string) => ['listings', 'detail', id] as const,
    user: (userId: string) => ['listings', 'user', userId] as const,
  },
  
  // Marketplace keys
  marketplace: {
    all: ['marketplace'] as const,
    filters: () => ['marketplace', 'filters'] as const,
    search: (query: string) => ['marketplace', 'search', query] as const,
    counts: () => ['marketplace', 'counts'] as const,
  },
  
  // Categories keys
  categories: {
    all: ['categories'] as const,
    list: () => ['categories', 'list'] as const,
  },
  
  // User keys
  users: {
    all: ['users'] as const,
    profile: (userId: string) => ['users', 'profile', userId] as const,
    settings: (userId: string) => ['users', 'settings', userId] as const,
  },
  
  // Images keys
  images: {
    all: ['images'] as const,
    upload: () => ['images', 'upload'] as const,
  },

  // Messaging keys
  messaging: {
    all: ['messaging'] as const,
    conversations: (options?: { page?: number; limit?: number }) => ['messaging', 'conversations', options] as const,
    conversation: (conversationId: string) => ['messaging', 'conversation', conversationId] as const,
    messages: (conversationId: string, options?: { page?: number; limit?: number }) => ['messaging', 'messages', conversationId, options] as const,
  },

  // Favorites keys
  favorites: {
    all: ['favorites'] as const,
    user: () => ['favorites', 'user'] as const,
  },
}

/**
 * Type helpers for query keys
 */
export type QueryKey = typeof queryKeys
