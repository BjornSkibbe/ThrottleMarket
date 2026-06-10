"use client"

import { Badge } from "@/components/ui/badge"
import { formatCategory, formatStatus } from "@/lib/formatters"
import {
  formatPrice,
  getStatusVariant,
  getDisplayTitle,
  getMainImage,
} from "@/features/dashboard/lib/helpers"
import type { MyListingsTableProps } from "@/features/dashboard/lib/types"
import { Eye, MessageSquare } from "lucide-react"
import { ListingThumbnail } from "./listing-thumbnail"
import { ListingActions } from "./listing-actions"

export function MobileListingsCards({
  listings,
  viewCounts = {},
  conversationCounts = {},
}: MyListingsTableProps) {
  return (
    <div className="sm:hidden space-y-6">
      {listings.map((listing) => {
        const mainImage = getMainImage(listing)
        const displayTitle = getDisplayTitle(listing)
        const statusVariant = getStatusVariant(listing.status)

        return (
          <div key={listing.id} className="flex gap-3">
            <ListingThumbnail image={mainImage} alt={displayTitle} size="md" />
            <div className="flex-1 min-w-0 space-y-1">
              <p className="font-bold text-sm truncate">{displayTitle}</p>
              <p className="text-xs font-normal text-primary/50">
                {formatCategory(listing.category || "N/A")}
              </p>
              <p className="text-xs font-normal text-primary/50">
                {formatPrice(listing.price)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={statusVariant as "default"} className="text-xs">
                  {formatStatus(listing.status || "Unknown")}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  <MessageSquare className="inline w-4 h-4" /> {conversationCounts[listing.id] ?? 0}
                </span>
                <span className="text-xs text-muted-foreground">
                  <Eye className="inline w-4 h-4" /> {viewCounts[listing.id] ?? 0}
                </span>
              </div>
            </div>
            <ListingActions listingId={listing.id} />
          </div>
        )
      })}
    </div>
  )
}
