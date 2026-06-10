"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LISTING_ACTIONS } from "@/features/dashboard/lib/constants"

interface ListingActionsProps {
  listingId: string
}

export function ListingActions({ listingId }: ListingActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2 space-y-2 bg-background ring-0">
        {LISTING_ACTIONS.map(({ label, href, icon: Icon }) => (
          <DropdownMenuItem key={label} asChild>
            <Link className="text-xs" href={href(listingId)}>
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
