"use client"

import * as React from "react"

interface SidebarProps {
  currentFilters?: {
    category?: string
    minPrice?: string
    maxPrice?: string
    location?: string
    condition?: string
    brand?: string
    type?: string
    model?: string
    size?: string
    search?: string
    sortBy?: string
  }
  categoryCounts?: Record<string, number>
  brandCounts?: Record<string, number>
  locationCounts?: Record<string, number>
  conditionCounts?: Record<string, number>
  typeCounts?: Record<string, number>
  filteredCategoryOptions?: Record<string, string>
  filteredBrandOptions?: Record<string, string>
  filteredLocationOptions?: Record<string, string>
  filteredConditionOptions?: Record<string, string>
  filteredTypeOptions?: Record<string, string>
  activeTab?: string
  // Dashboard stats
  activeListingsCount?: number
  soldListingsCount?: number
  favoritesCount?: number
  recentlyViewedCount?: number
  // Messaging
  selectedConversationId?: string | null
}

interface SidebarContextValue {
  sidebarProps: SidebarProps
  setSidebarProps: (props: SidebarProps) => void
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarProps, setSidebarProps] = React.useState<SidebarProps>({})

  const handleSetSidebarProps = React.useCallback((props: SidebarProps) => {
    setSidebarProps(prev => ({
      ...prev,
      ...props
    }))
  }, [])

  return (
    <SidebarContext.Provider value={{ sidebarProps, setSidebarProps: handleSetSidebarProps }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebarContext() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}
