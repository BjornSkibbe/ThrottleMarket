import { Listing } from '@/types'

export interface DashboardStats {
  activeListings: Listing[]
  soldListings: Listing[]
  draftListings: Listing[]
}

export function calculateDashboardStats(listings: Listing[]): DashboardStats {
  const activeListings = listings.filter((l) => l.status === 'ACTIVE')
  const soldListings = listings.filter((l) => l.status === 'SOLD')
  const draftListings = listings.filter((l) => l.status === 'DRAFT')

  return {
    activeListings,
    soldListings,
    draftListings,
  }
}
