import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Store } from "lucide-react"

export function HeroSection() {
  return (
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
          <h1 className="text-6xl font-black tracking-tight text-primary italic flex flex-col sm:flex-row text-center sm:justify-center">
            Find It. <span className="text-accent">Ride It.</span> Love It.
          </h1>
          <p className="text-md sm:text-lg font-bold tracking-tight">
            Browse motorcycles and gear from fellow riders and start your next journey today.
          </p>
          <div className="flex flex-col gap-4 justify-center pt-6 w-full max-w-sm mx-auto">
            <Link href="/marketplace">
              <Button size="lg" variant="accent" className="duration-300 w-full">
                <Store className="h-4 w-4" />Browse Marketplace
              </Button>
            </Link>
            <Link href="/listings/create">
              <Button size="lg" variant="default">
                <Plus className="h-4 w-4" />List Your Item
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
