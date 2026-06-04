"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, useCallback, useState, useEffect, useTransition } from "react"

export interface FilterState {
  category: string
  minPrice: string
  maxPrice: string
  location: string
  condition: string
  brand: string
  type: string
  model: string
  size: string
  search: string
  sortBy: string
}

function normalizeFilters(source?: Record<string, string | undefined>): FilterState {
  return {
    category: source?.category || "",
    minPrice: source?.minPrice || "",
    maxPrice: source?.maxPrice || "",
    location: source?.location || "",
    condition: source?.condition || "",
    brand: source?.brand || "",
    type: source?.type || "",
    model: source?.model || "",
    size: source?.size || "",
    search: source?.search || "",
    sortBy: source?.sortBy || "",
  }
}

const DEBOUNCE_MS = 300

export function useMarketplaceFilters(currentFilters?: Record<string, string | undefined>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const filters = useMemo(() => normalizeFilters(currentFilters), [currentFilters])

  const [pendingQuery, setPendingQuery] = useState<string | null>(null)

  useEffect(() => {
    if (!pendingQuery) return

    const timer = setTimeout(() => {
      startTransition(() => {
        router.push(pendingQuery)
      })
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [pendingQuery, router])

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page")

      setPendingQuery(`/marketplace?${params.toString()}`)
    },
    [searchParams]
  )

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push("/marketplace")
    })
  }, [router])

  const hasActiveFilters = useMemo(
    () =>
      Object.entries(filters).some(
        ([key, value]) => value && value !== "" && !(key === "sortBy" && value === "newest")
      ),
    [filters]
  )

  return { filters, updateFilter, clearFilters, hasActiveFilters, isPending }
}
