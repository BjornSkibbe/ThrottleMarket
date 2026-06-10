"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCategory, formatStatus } from "@/lib/formatters"
import { TABLE_HEADINGS } from "@/features/dashboard/lib/constants"
import {
  formatPrice,
  formatDate,
  getStatusVariant,
  getDisplayTitle,
  getMainImage,
} from "@/features/dashboard/lib/helpers"
import type { MyListingsTableProps } from "@/features/dashboard/lib/types"
import { ListingThumbnail } from "./listing-thumbnail"
import { ListingActions } from "./listing-actions"

export function DesktopListingsTable({
  listings,
  viewCounts = {},
  conversationCounts = {},
}: MyListingsTableProps) {
  return (
    <div className="hidden sm:block">
      <Table>
        <TableHeader>
          <TableRow>
            {TABLE_HEADINGS.map((heading) => (
              <TableHead key={heading}>{heading}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => {
            const mainImage = getMainImage(listing)
            const displayTitle = getDisplayTitle(listing)
            const statusVariant = getStatusVariant(listing.status)

            return (
              <TableRow key={listing.id}>
                <TableCell className="py-4">
                  <ListingThumbnail image={mainImage} alt={displayTitle} size="sm" />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="max-w-100">{displayTitle}</div>
                  <span className="text-primary/50">
                    {formatCategory(listing.category || "N/A")}
                  </span>
                </TableCell>
                <TableCell>{formatPrice(listing.price)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant as "default"}>
                    {formatStatus(listing.status || "Unknown")}
                  </Badge>
                </TableCell>
                <TableCell>{conversationCounts[listing.id] ?? 0}</TableCell>
                <TableCell>{viewCounts[listing.id] ?? 0}</TableCell>
                <TableCell>{formatDate(listing.createdAt)}</TableCell>
                <TableCell>
                  <ListingActions listingId={listing.id} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
