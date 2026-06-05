import type { Metadata } from "next"
import { HeroSection } from "@/features/home/components/hero-section"
import { FeaturesSection } from "@/features/home/components/features-section"
import { FeaturedListingsSection } from "@/features/home/components/featured-listings-section"
import { CTASection } from "@/features/home/components/cta-section"
import { getFeaturedListings } from "@/features/listings/lib/listings"

export const metadata: Metadata = {
  title: "ThrottleMarket — Buy & Sell Motorcycles",
  description:
    "The premium marketplace for motorcycles and riding gear. Buy and sell with confidence.",
}

export default async function Home() {
  let featuredListings: Awaited<ReturnType<typeof getFeaturedListings>> = []

  try {
    featuredListings = await getFeaturedListings()
  } catch {
    // Silently fail — homepage still renders without listings
  }

  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <FeaturedListingsSection listings={featuredListings} />
      <CTASection />
    </div>
  )
}
