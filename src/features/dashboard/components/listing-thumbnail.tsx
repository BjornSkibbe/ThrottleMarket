"use client"

import Image from "next/image"
import { Camera } from "lucide-react"

interface ListingThumbnailProps {
  image: { url: string } | null
  alt: string
  size?: "sm" | "md"
}

export function ListingThumbnail({ image, alt, size = "md" }: ListingThumbnailProps) {
  const sizeClass = size === "sm" ? "w-16 h-16" : "w-24 h-24"

  return (
    <div className={`relative ${sizeClass} shrink-0 bg-muted rounded-xl overflow-hidden`}>
      {image ? (
        <Image src={image.url} alt={alt} fill className="object-cover" sizes="64px" />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <Camera className="w-6 h-6" />
        </div>
      )}
    </div>
  )
}
