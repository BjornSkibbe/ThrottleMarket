"use client"

import { MyListingsTableProps } from "@/features/dashboard/lib/types"
import { DesktopListingsTable } from "./desktop-listings-table"
import { MobileListingsCards } from "./mobile-listings-cards"

export function MyListingsTable({
  listings,
  viewCounts = {},
  conversationCounts = {},
}: MyListingsTableProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No listings found</p>
      </div>
    )
  }

  const sharedProps = { listings, viewCounts, conversationCounts }

  return (
    <>
      <DesktopListingsTable {...sharedProps} />
      <MobileListingsCards {...sharedProps} />
    </>
  )
}
