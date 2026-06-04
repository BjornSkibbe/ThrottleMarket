"use client"

import { useEffect } from "react"
import { SessionProvider } from "next-auth/react"
import { QueryClientProvider } from "@/lib/react-query"
import { initializeGlobalErrorHandler } from "@/lib/error-handling"

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize global error handler on mount
  useEffect(() => {
    initializeGlobalErrorHandler()
  }, [])

  return (
    <SessionProvider>
      <QueryClientProvider>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}
