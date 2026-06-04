import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn, Plus, Shield, Store, TrendingUp, Users } from "lucide-react"
import { ListingCard } from "@/features/listings/components/listing-card"
import { getFeaturedListings } from "@/features/listings/lib/listings"

export const metadata: Metadata = {
  title: "ThrottleMarket — Buy & Sell Motorcycles",
  description:
    "The premium marketplace for motorcycles and riding gear. Buy and sell with confidence.",
}

const features = [
  {
    icon: Shield,
    title: "Secure Transactions",
    description:
      "Safe and secure buying and selling with verified sellers and buyer protection",
  },
  {
    icon: TrendingUp,
    title: "Wide Selection",
    description:
      "Thousands of motorcycles and riding gear listings from sellers countrywide",
  },
  {
    icon: Users,
    title: "Trusted Community",
    description: "Join a community of passionate riders and enthusiasts",
  },
]

export default async function Home() {
  let featuredListings: Awaited<ReturnType<typeof getFeaturedListings>> = []

  try {
    featuredListings = await getFeaturedListings()
  } catch {
    // Silently fail — homepage still renders without listings
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 md:py-48 px-3 sm:px-6">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-images/hero4.jpg"
            alt="Motorcycle hero"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-primary italic">
              Find It. <span className="text-accent">Ride It.</span> Love It.
            </h1>
            <p className="text-sm text-primary/90 max-w-2xl mx-auto tracking-wide">
              Browse motorcycles and gear from fellow riders and start your next journey today.
            </p>
            <div className="flex flex-col gap-4 justify-center pt-6 w-full max-w-sm mx-auto">
              <Link href="/marketplace" className="w-full">
                <Button size="lg" variant="accent" className="italic duration-300 w-full">
                  <Store className="h-4 w-4" />Browse Marketplace
                </Button>
              </Link>
              <Link href="/listings/create" className="w-full">
                <Button size="lg" variant="default" className="italic duration-300 w-full">
                  <Plus className="h-4 w-4" />List Your Item
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-6 bg-muted/30">
        <div className="mx-auto px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center space-y-3 p-6 lg:p-12 rounded-4xl bg-background"
              >
                <div className="p-3 rounded-full bg-muted">
                  <Icon className="h-8 w-8 text-accent" />
                </div>

                <h3 className="text-xl font-extrabold italic tracking-tight">{title}</h3>

                <p className="text-primary/50 text-xs tracking-wider">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Featured Listings */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          {/* <div className="text-center mb-8 space-y-2">
            <h2 className="text-4xl font-extrabold italic tracking-tighter">Featured</h2>
            <p className="text-primary/50 text-sm tracking-wide">Check out the latest additions to our marketplace</p>
          </div> */}
          {featuredListings.length > 0 ? (
            <>
              <div className="text-center mb-8 space-y-2">
                  <h2 className="text-4xl font-extrabold italic tracking-tighter">Featured</h2>
                  <p className="text-primary/50 text-sm tracking-wide">Check out the latest additions to our marketplace</p>
                </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
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
      {/* CTA Section */}
      <section className="relative bg-primary py-12 md:py-24">
        <div className="max-w-7xl mx-auto text-center text-primary-foreground space-y-12 px-3 sm:px-6">
          <h2 className="text-4xl font-extrabold italic tracking-tighter">Ready to Get Started?</h2>
          <p className="text-lg font-bold tracking-tight">
            Join thousands of riders buying and selling on ThrottleMarket today
          </p>
          <div className="flex flex-col gap-4 justify-center w-full max-w-sm mx-auto">
            <Link href="/marketplace" className="w-full">
              <Button size="lg" variant="accent" className="w-full">
                <Store className="h-4 w-4" />Browse Marketplace
              </Button>
            </Link>
            <Link href="/auth/signup" className="w-full">
              <Button size="lg" variant="secondary" className="w-full">
                <LogIn className="h-4 w-4" />Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
