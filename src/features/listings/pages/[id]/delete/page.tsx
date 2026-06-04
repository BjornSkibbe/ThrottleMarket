"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useDeleteListing } from "@/features/listings/hooks/use-delete-listing"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, Check, X } from "lucide-react"

export default function DeleteListingPage() {
  const router = useRouter()
  const params = useParams()
  const listingId = params.id as string

  const [error, setError] = useState("")

  const deleteListing = useDeleteListing()

  const handleDelete = async () => {
    try {
      await deleteListing.mutateAsync(listingId)
      router.push("/marketplace-dashboard")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred"
      setError(message)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Link href={`/listings/${listingId}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to listing
        </Link>
        <h1 className="text-3xl font-bold mb-2">Delete Listing</h1>
        <p className="text-muted-foreground">This action cannot be undone</p>
      </div>

      <Card className="p-6 space-y-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <AlertTriangle className="h-5 w-5" />
            Confirm Deletion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-accent bg-accent/10 rounded-md">
              {error}
            </div>
          )}

          {deleteListing.error && (
            <div className="p-3 text-sm text-accent bg-accent/10 rounded-md">
              {deleteListing.error.message || "Failed to delete listing"}
            </div>
          )}

          <p className="text-muted-foreground">
            Are you sure you want to delete this listing? This action cannot be undone and all data associated with this listing will be permanently removed.
          </p>

          <div className="flex gap-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.back()}
              disabled={deleteListing.isPending}
              className="flex-1 tracking-tight"
            >
              <X/>Cancel
            </Button>
            <Button
              size="lg"
              variant="default"
              onClick={handleDelete}
              disabled={deleteListing.isPending}
              className="flex-1 tracking-tight"
            >
              <Check />{deleteListing.isPending ? "Deleting..." : "Delete Listing"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
