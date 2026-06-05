/**
 * Form Loading State Component
 * 
 * Loading state for the listing form during data fetching.
 */

'use client'

import { Loader2 } from 'lucide-react'
import { LOADING_TEXT } from '@/lib/constants/form'

export function FormLoadingState() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl h-[calc(100vh-100px)] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="font-extrabold text-4xl text-muted-foreground tracking-tight">{LOADING_TEXT.listing}</p>
      </div>
    </div>
  )
}
