"use client"

import { Button } from "@/components/ui/button"
import { Crown, Pencil, Share2, Trash } from "lucide-react"
import Link from "next/link"
import { useUserFavorites, useToggleFavorite } from "@/features/listings/hooks/use-favorites"
import { toast } from "@/hooks/use-toast"
import { copyToClipboard } from "@/lib/clipboard"

interface ManageListingButtonsProps {
  listingId: string
  isOwner: boolean
  isAuthenticated: boolean
}

export function ManageListingButtons({ listingId, isOwner, isAuthenticated }: ManageListingButtonsProps) {
  const contactHref = isAuthenticated
    ? `/messaging?listingId=${listingId}`
    : `/auth/signin?callbackUrl=${encodeURIComponent(`/listings/${listingId}`)}`

  const { data: favoriteIds = [] } = useUserFavorites()
  const toggleFavorite = useToggleFavorite()
  const isFavorited = favoriteIds.includes(listingId)

  const handleFavoriteClick = () => {
    if (!isAuthenticated) return
    toggleFavorite.mutate(listingId)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/listings/${listingId}`
    const success = await copyToClipboard(url)
    if (success) {
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this listing with others",
      })
    } else {
      toast({
        title: "Failed to copy link",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex gap-2 w-full mx-auto">
      {/* Favourites — redirect to sign-in if not authenticated */}
      {!isAuthenticated ? (
        <Link href={`/auth/signin?callbackUrl=${encodeURIComponent(`/listings/${listingId}`)}`}>
          <Button variant="secondary" size="icon-lg">
            <Crown className="h-5 w-5" />
          </Button>
        </Link>
      ) : (
        <Button
          variant={isFavorited ? "accent" : "secondary"}
          size="icon-lg"
          onClick={handleFavoriteClick}
        >
          <Crown className={`h-5 w-5 ${isFavorited ? "fill-background text-background" : ""}`} />
        </Button>
      )}
      {/* Owner: Edit + Delete | Others: Contact Seller */}
      {isOwner ? (
        <>
          <Link href={`/listings/${listingId}/edit`} className="flex-2">
            <Button variant="secondary" size="lg" className="w-full text-xs"><Pencil /> Edit</Button>
          </Link>
          <Link href={`/listings/${listingId}/delete`} className="flex-2">
            <Button variant="accent" size="lg" className="w-full text-xs"><Trash /> Delete</Button>
          </Link>
        </>
      ) : (
        <Link href={contactHref} className="flex-2">
          <Button className="w-full" size="lg">Contact Seller</Button>
        </Link>
      )}
      {/* Share */}
      <Button variant="secondary" size="icon-lg" onClick={handleShare}>
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  )
}
