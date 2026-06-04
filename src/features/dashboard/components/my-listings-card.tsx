"use client"

import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera } from "lucide-react"
import { formatModel } from "@/lib/formatters"
import { Location, Category, Condition, Brand, Type, Model } from "@/types"

interface MyListingsCardProps {
  listing: {
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
  }
}

export function MyListingsCard({ listing }: MyListingsCardProps) {
  const mainImage = listing.images[0] || null

  return (
    <Card className="border-2 border-border/50 hover:border-border">
      <Link href={`/listings/${listing.id}`}>

        {/* IMAGE CONTAINER */}
        <div className="relative aspect-square overflow-hidden bg-muted mx-auto">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={listing.title || 'Listing image'}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <Camera className="w-8 h-8" />
            </div>
          )}
          <div className="absolute inset-0 bg-card/10 pointer-events-none" />
          {listing.status === "SOLD" && (
            <Badge className="absolute top-2 right-2" variant="destructive">
              SOLD
            </Badge>
          )}

          {/* MOTORCYCLE MODEL */}
          <span className="absolute bottom-2 left-4 text-2xl font-black italic text-muted-foreground tracking-tighter">
            {formatModel(listing.motorcycle?.model || "")}
          </span>
          
        </div>
      </Link>
    </Card>
  )
}
