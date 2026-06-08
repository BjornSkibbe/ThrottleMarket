"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatBrand, formatModel, formatSize } from "@/lib/formatters"
import { ListingDetails } from "@/features/listings/components/listing-details"
import { Location, Category, Condition, Brand, Type, Model, Size } from "@/types"
import { memo } from "react"
import { useUserFavorites, useToggleFavorite } from "@/features/listings/hooks/use-favorites"

interface ListingCardProps {
  listing: {
    id: string
    title: string | null
    description: string
    category: Category
    price: number
    size: Size | null
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
      mileage: number
      year: number | null
      model: Model
      type: Type
      engineSize: number
    } | null
  }
}

export const ListingCard = memo(function ListingCard({ listing }: ListingCardProps) {
  const mainImage = listing.images[0] || null
  const { data: favoriteIds = [] } = useUserFavorites()
  const toggleFavorite = useToggleFavorite()
  const isFavorited = favoriteIds.includes(listing.id)

  return (
    <div className="rounded-2xl overflow-hidden bg-muted/30">
      <Link href={`/listings/${listing.id}`}>
        {/* 
          IMAGE CONTAINER 
          Displays the main image of the listing in a square aspect ratio
        */}
        <div className="flex flex-col relative aspect-square overflow-hidden mx-auto group">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={listing.title || 'Listing image'}
              fill
              className="object-cover object-center transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <Camera className="w-8 h-8" />
            </div>
          )}
          {/* 
            OVERLAY & BADGES
          */}
          {listing.status === "SOLD" && (
            <Badge className="absolute top-2 left-2 z-10" variant="destructive">
              SOLD
            </Badge>
          )}
          {isFavorited && (
            <Button
              size="icon"
              variant="outline"
              className="rounded-full absolute top-2 right-2 z-10 text-background hover:text-background opacity-100"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleFavorite.mutate(listing.id)
              }}
            >
              <Crown className="h-5 w-5 fill-background text-background" />
            </Button>
          )}
        </div>

        <CardContent className="p-6">
          {/* 
            ListingDetails COMPONENT 
            Displays all the details of the listing
          */}
          <ListingDetails
            condition={listing.condition}
            category={listing.category}
            brand={listing.brand}
            title={listing.title}
            price={listing.price}
            size={listing.size}
            location={listing.location}
            createdAt={listing.createdAt}
            motorcycle={listing.motorcycle}
          />
        </CardContent>

        {/* <CardFooter className="p-4">
          <Link href={`/listings/${listing.id}`} className="w-full">
            <Button className="w-full h-12" variant="outline">
              View Details
            </Button>
          </Link>
        </CardFooter> */}
      </Link>
    </div>
  )
})
