import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn, Store } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative bg-primary py-12 md:py-24">
      <div className="max-w-7xl mx-auto text-center text-primary-foreground space-y-12 px-3 sm:px-6">
        <h2 className="text-4xl font-black tracking-tight">Ready to Get Started?</h2>
        <p className="text-md sm:text-lg font-bold tracking-tight">
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
  )
}
