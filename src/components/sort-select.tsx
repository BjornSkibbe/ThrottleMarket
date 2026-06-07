"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownNarrowWide, ArrowDownWideNarrow, ArrowUpDown, ArrowDownAZ } from "lucide-react"

export function SortSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", value)
    router.push(`/marketplace?${params.toString()}`)
  }

  const currentSort = searchParams.get("sortBy") || "title-asc"

  return (
    <Select value={currentSort} onValueChange={updateSort}>
      <SelectTrigger size="default" className="w-auto text-xs border-border">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent className="text-xs p-2">
        <SelectItem value="newest"><ArrowUpDown className="text-accent"/> Newest First</SelectItem>
        <SelectItem value="title-asc"><ArrowDownAZ className="text-accent" /> Title: A-Z</SelectItem>
        <SelectItem value="price-asc"><ArrowDownNarrowWide className="text-accent" /> Price: Low to High</SelectItem>
        <SelectItem value="price-desc"><ArrowDownWideNarrow className="text-accent" /> Price: High to Low</SelectItem>
      </SelectContent>
    </Select>
  )
}
