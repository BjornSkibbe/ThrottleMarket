/**
 * Not Found Page
 * 
 * Custom 404 page for when a route is not found.
 */

import { Frown } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center bg-background p-4">
      <div className="max-w-md text-center">
        <Frown className="mx-auto mb-4 w-12 h-12" />
        <h2 className="mb-2 text-2xl font-bold italic tracking-tighter">Page Not Found</h2>
        <p className="mb-6 text-sm tracking-wide text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
