"use client"

import { CATEGORY } from "@/lib/constants"
import { formatCategory } from "@/lib/formatters"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchBoxProps {
  placeholder?: string
  searchCount?: number
}

export function SearchBox({ placeholder = "Search listings...", searchCount }: SearchBoxProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all")

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchQuery) {
      params.set("search", searchQuery)
    } else {
      params.delete("search")
    }
    
    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory)
    } else {
      params.delete("category")
    }
    
    router.push(`/marketplace?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 bg-transparent border border-border rounded-2xl p-2">

      {/* Category Dropdown */}
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="sm:w-35 h-12 bg-background border-0 w-full">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent className="p-2.5">
          <SelectItem value="all">All</SelectItem>
          {Object.values(CATEGORY).map((category) => (
            <SelectItem key={category} value={category}>
              {formatCategory(category)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Search Input */}
      <div className="flex-1 relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent" />
        <Input
          type="text"
          placeholder={placeholder}
          className="h-12 pl-10 bg-background border-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="flex gap-2 w-full sm:w-auto">

        {/* Filters Button */}
        <Button
          variant="outline"
          className="h-12 w-12 bg-background border-0 p-0"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString())
            params.set("showFilters", "true")
            router.push(`/marketplace?${params.toString()}`)
          }}
        >
          <SlidersHorizontal className="h-4 w-4 text-accent" />
        </Button>
        
        {/* Search Button */}
        <Button className="h-12 flex-1 px-12" onClick={handleSearch}>
          {searchCount
            ? `Search ${searchCount.toLocaleString()} listings`
            : <Search />}
        </Button>

      </div>
    </div>
  )
}
