"use client"

import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, ArrowUpRight } from "lucide-react"
import {
  formatBrand,
  formatModel,
  formatPrice,
  formatCondition,
  formatLocation,
} from "@/lib/formatters"
import type { Location, Category, Condition, Brand, Type, Model, Size } from "@/types"

interface FeaturedListingCardProps {
  listing: {
    id: string
    title: string | null
    category: Category
    price: number
    size: Size | null
    brand: Brand
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
    motorcycle?: {
      year: number | null
      model: Model
      mileage: number
      type: Type | null
      engineSize: number
    } | null
  }
}

export function FeaturedListingCard({ listing }: FeaturedListingCardProps) {
  const mainImage = listing.images[0] || null
  const displayTitle =
    listing.title || `${formatBrand(listing.brand)} ${formatModel(listing.motorcycle?.model || "")}`

  return (
    <Link href={`/listings/${listing.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-2 border-border/50 hover:border-border transition-colors duration-200">
        <div className="flex flex-col sm:flex-row h-full">
          {/* Image */}
          <div className="rounded-2xl relative w-full sm:w-[40%] aspect-square bg-muted shrink-0 overflow-hidden">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={displayTitle}
                fill
                className="object-cover transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Camera className="w-8 h-8" />
              </div>
            )}
            {listing.status === "SOLD" && (
              <Badge className="absolute top-2 left-2" variant="destructive">
                SOLD
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between p-5 flex-1 min-w-0">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="ghost" className="text-xs">
                  {formatCondition(listing.condition)}
                </Badge>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>

              <h3 className="font-bold text-sm leading-snug line-clamp-2">
                {displayTitle}
              </h3>

              {listing.motorcycle && (
                <p className="text-xs text-muted-foreground">
                  {listing.motorcycle.year} · {formatModel(listing.motorcycle.model)} ·{" "}
                  {listing.motorcycle.engineSize}cc
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                {formatLocation(listing.location)}
              </p>
            </div>

            <div className="pt-3 mt-2 border-t border-border/50">
              <p className="text-lg font-extrabold tracking-tight">
                {formatPrice(listing.price)}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
