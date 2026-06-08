"use client"

import Link from "next/link"
import Image from "next/image"
import { Camera, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCondition, formatLocation } from "@/lib/formatters"
import { useToggleFavorite } from "@/features/listings/hooks/use-favorites"
import { Location, Category, Condition, Brand, Type, Model } from "@/types"

interface FavoritesTableProps {
  listings: {
    id: string
    title: string | null
    description: string
    category: Category
    price: number
    condition: Condition
    location: Location
    status: string
    createdAt: Date
    images: {
      id: string
      url: string
      order: number
      listingId: string
    }[]
  }[]
}

export function FavoritesTable({ listings }: FavoritesTableProps) {
  const toggleFavorite = useToggleFavorite()

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No favorites found</p>
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
              <TableHead>Condition</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => {
              const mainImage = listing.images?.[0] || null

              return (
                <TableRow key={listing.id}>
                  <TableCell className="py-4">
                    <div className="relative w-16 h-16 bg-muted rounded-xl overflow-hidden">
                      {mainImage ? (
                        <Image
                          src={mainImage.url}
                          alt={listing.title || "Listing image"}
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
                    {listing.title || "Untitled listing"}
                  </TableCell>
                  <TableCell>
                    R {listing.price?.toLocaleString("en-ZA") || "N/A"}
                  </TableCell>
                  <TableCell>{formatCondition(listing.condition)}</TableCell>
                  <TableCell>{formatLocation(listing.location)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/listings/${listing.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite.mutate(listing.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

          return (
            <div key={listing.id} className="flex gap-3">
              <div className="relative w-24 h-24 shrink-0 bg-muted rounded-xl overflow-hidden">
                {mainImage ? (
                  <Image
                    src={mainImage.url}
                    alt={listing.title || "Listing image"}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <Camera className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-bold text-sm truncate">
                  {listing.title || "Untitled listing"}
                </p>
                <p className="text-xs text-muted-foreground">
                  R {listing.price?.toLocaleString("en-ZA") || "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCondition(listing.condition)} · {formatLocation(listing.location)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={() => window.location.href = `/listings/${listing.id}`}
                  >
                    <Eye className="h-4 w-4" /> View
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={() => toggleFavorite.mutate(listing.id)}
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
