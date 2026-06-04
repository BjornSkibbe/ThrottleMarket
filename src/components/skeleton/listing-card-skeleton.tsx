/**
 * Listing Card Skeleton Component
 * 
 * Skeleton loading state for listing cards during data fetching.
 * Provides visual feedback while listings are being loaded.
 */

'use client'

import { Card, CardContent } from '@/components/ui/card'

export function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Image skeleton */}
          <div className="aspect-square w-full rounded-lg bg-muted animate-pulse" />
          
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
          </div>
          
          {/* Price and location skeleton */}
          <div className="flex justify-between">
            <div className="h-4 w-1/4 rounded bg-muted animate-pulse" />
            <div className="h-4 w-1/4 rounded bg-muted animate-pulse" />
          </div>
          
          {/* Brand and condition skeleton */}
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
            <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  )
}
