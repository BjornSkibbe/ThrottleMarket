/**
 * Form Header Component
 * 
 * Header section for the listing form with navigation and title.
 */

'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface FormHeaderProps {
  mode: 'create' | 'edit'
  listingId?: string
}

export function FormHeader({ mode, listingId }: FormHeaderProps) {
  return (
    <div className="mb-8">
      {mode === 'edit' && listingId && (
        <Link href={`/listings/${listingId}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to listing
        </Link>
      )}
      {mode === 'create' && (
        <Link href="/marketplace-dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to dashboard
        </Link>
      )}
      <h1 className="text-4xl font-black tracking-tighter italic mb-2">
        {mode === 'create' ? (
          <>
            <span className="text-accent">Create</span> Listing
          </>
        ) : (
          <>
            <span className="text-accent">Edit</span> Listing
          </>
        )}
      </h1>
      <p className="text-muted-foreground italic">
        {mode === 'create' ? 'List your motorcycle or riding gear for sale' : 'Update your listing details'}
      </p>
    </div>
  )
}
