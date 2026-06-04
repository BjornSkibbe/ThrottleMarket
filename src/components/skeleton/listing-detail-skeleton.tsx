/**
 * Listing Detail Skeleton Component
 * 
 * Skeleton loading state for listing detail page during data fetching.
 * Provides visual feedback while listing details are being loaded.
 */

'use client'

import { Card, CardContent } from '@/components/ui/card'

export function ListingDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images section */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-lg bg-muted animate-pulse" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square w-full rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        </div>

        {/* Details section */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <div className="h-8 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-6 w-1/2 rounded bg-muted animate-pulse" />
              </div>

              {/* Price */}
              <div className="h-8 w-1/3 rounded bg-muted animate-pulse" />

              {/* Location and condition */}
              <div className="flex gap-4">
                <div className="h-5 w-1/4 rounded bg-muted animate-pulse" />
                <div className="h-5 w-1/4 rounded bg-muted animate-pulse" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-muted animate-pulse" />
                <div className="h-4 w-full rounded bg-muted animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
              </div>

              {/* Seller info */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motorcycle details */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="h-6 w-1/3 rounded bg-muted animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
