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
      <section className="relative overflow-hidden py-24 md:py-48">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-images/hero3.jpg"
            alt="Motorcycle hero"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="bg-linear-to-br from-primary/0 via-primary/0 to-background/80" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-primary italic">
              Find Your <span className="text-accent block text-7xl">Perfect Ride</span>
            </h1>
            <p className="text-sm text-primary/90 max-w-2xl mx-auto tracking-wide">
              The premium marketplace for motorcycles and riding gear. Buy and sell with confidence.
            </p>
            <div className="flex gap-4 justify-center pt-6">
              <Link href="/marketplace">
                <Button size="lg" variant="accent" className="italic duration-300">
                  <Store className="h-4 w-4" />Browse Marketplace
                </Button>
              </Link>
              <Link href="/listings/create">
                <Button size="lg" variant="default" className="italic duration-300">
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
        <div className="max-w-7xl mx-auto text-center text-primary-foreground space-y-12">
          <h2 className="text-4xl font-extrabold italic tracking-tighter">Ready to <span className="text-accent">Get Started?</span></h2>
          <p className="text-lg font-bold tracking-tight">
            Join thousands of riders buying and selling on ThrottleMarket today
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/marketplace">
              <Button size="lg" variant="accent">
                <Store className="h-4 w-4" />Browse Marketplace
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary">
                <LogIn className="h-4 w-4" />Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
