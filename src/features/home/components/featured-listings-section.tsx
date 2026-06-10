import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FeaturedListingCard } from "./featured-listing-card"
import { getFeaturedListings } from "@/features/listings/lib/listings"

interface FeaturedListingsSectionProps {
  listings: Awaited<ReturnType<typeof getFeaturedListings>>
}

export function FeaturedListingsSection({ listings }: FeaturedListingsSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {listings.length > 0 ? (
          <>
            <div className="text-center mb-8 space-y-2">
              <h2 className="text-4xl font-extrabold tracking-tight">Featured</h2>
              <p className="text-primary/50 text-sm tracking-wide">Check out the latest additions to our marketplace</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <FeaturedListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm tracking-wide">No listings yet. Be the first to list an item!</p>
            <Link href="/listings/create" className="mt-4 inline-block">
              <Button variant="default" size="lg" ><Plus />Create Listing</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
