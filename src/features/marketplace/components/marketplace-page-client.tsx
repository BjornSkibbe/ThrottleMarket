"use client"

import { useEffect } from "react"
import { useSidebarContext } from "@/contexts/sidebar-props-context"
import type { SidebarProps } from "@/features/marketplace/lib/marketplace/page-helpers"

interface MarketplacePageClientProps {
  children: React.ReactNode
  sidebarProps: SidebarProps
}

export function MarketplacePageClient({ children, sidebarProps }: MarketplacePageClientProps) {
  const { setSidebarProps } = useSidebarContext()

  useEffect(() => {
    setSidebarProps(sidebarProps)
  }, [sidebarProps, setSidebarProps])

  return <>{children}</>
}
