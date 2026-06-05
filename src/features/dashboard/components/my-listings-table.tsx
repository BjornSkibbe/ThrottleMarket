"use client"

import { Location, Category, Condition, Brand, Type, Model } from "@/types"
import { formatBrand, formatCategory, formatModel, formatStatus } from "@/lib/formatters"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Eye, Edit, MoreHorizontal, Trash2, Check, MessageSquare } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MyListingsTableProps {
  listings: {
    id: string
    title: string | null
    description: string
    category: Category
    price: number
    brand: Brand
    condition: Condition
    location: Location
    status: string
    createdAt: Date
    seller: {
      id: string
      name: string | null
      email: string
      image: string | null
    }
    images: {
      id: string
      url: string
      order: number
      listingId: string
    }[]
    motorcycle?: {
      mileage: number | null
      year: number | null
      model: Model
      type: Type
      engineSize: number | null
    } | null
  }[]
  viewCounts?: Record<string, number>
  conversationCounts?: Record<string, number>
}

export function MyListingsTable({ listings, viewCounts = {}, conversationCounts = {} }: MyListingsTableProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No listings found</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Conversations</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => {
              const mainImage = listing.images?.[0] || null
              const statusColor =
                listing.status === "ACTIVE" ? "accent" :
                listing.status === "SOLD" ? "sold" :
                listing.status === "DRAFT" ? "secondary" : "outline"

              return (
                <TableRow key={listing.id}>
                  <TableCell className="py-4">
                    <div className="relative w-16 h-16 bg-muted rounded-xl overflow-hidden">
                      {mainImage ? (
                        <Image
                          src={mainImage.url}
                          alt={listing.title || 'Listing image'}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <Camera className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="max-w-100">
                      {listing.title || `${formatBrand(listing.brand)} ${formatModel(listing.motorcycle?.model || "")}`}
                    </div>
                    <span className="text-primary/50">{formatCategory(listing.category || 'N/A')}</span>
                  </TableCell>
                  <TableCell>R {listing.price?.toLocaleString('en-ZA') || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={statusColor}>{formatStatus(listing.status || 'Unknown')}</Badge>
                  </TableCell>
                  <TableCell>
                    {conversationCounts[listing.id] ?? 0}
                  </TableCell>
                  <TableCell>
                    {viewCounts[listing.id] ?? 0}
                  </TableCell>
                  <TableCell>
                    {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('en-ZA') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="p-2 space-y-2">
                        <DropdownMenuItem asChild>
                          <Link className="text-xs" href={`/listings/${listing.id}`}>
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link className="text-xs" href={`/listings/${listing.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link className="text-xs" href={`/listings/${listing.id}/delete`}>
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-6">
        {listings.map((listing) => {
          const mainImage = listing.images?.[0] || null
          const statusColor =
            listing.status === "ACTIVE" ? "default" :
            listing.status === "SOLD" ? "destructive" :
            listing.status === "DRAFT" ? "secondary" : "outline"
          const displayTitle = listing.title || `${formatBrand(listing.brand)} ${formatModel(listing.motorcycle?.model || "")}`

          return (
            <div
              key={listing.id}
              className="flex gap-3"
            >
              <div className="relative w-24 h-24 shrink-0 bg-muted rounded-xl overflow-hidden">
                {mainImage ? (
                  <Image
                    src={mainImage.url}
                    alt={displayTitle}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <Camera className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-bold text-sm truncate">
                  {displayTitle}
                </p>
                <p className="text-xs font-normal text-primary/50 mt-0.5">
                  <span className="text-primary/50">{formatCategory(listing.category || 'N/A')}</span>
                </p>
                <p className="text-xs font-normal text-primary/50 mt-0.5">
                  R {listing.price?.toLocaleString('en-ZA') || 'N/A'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={statusColor} className="text-xs">
                    {formatStatus(listing.status || 'Unknown')}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    <MessageSquare className="inline w-4 h-4" /> {conversationCounts[listing.id] ?? 0}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    <Eye className="inline w-4 h-4" /> {viewCounts[listing.id] ?? 0} 
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/listings/${listing.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/listings/${listing.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/listings/${listing.id}/delete`}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        })}
      </div>
    </>
  )
}
