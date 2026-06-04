"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchbarProps {
  placeholder?: string
  searchCount?: number
}

export function Searchbar({ placeholder = "Search listings...", searchCount }: SearchbarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchQuery) {
      params.set("search", searchQuery)
    } else {
      params.delete("search")
    }
    
    router.push(`/marketplace?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* 
        Search Input 
      */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent" />
        <Input
          type="text"
          placeholder={placeholder}
          className="h-12 pl-10 rounded-full pr-16"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      
      {/* 
        Search Button 
      */}
      <Button variant="accent" className="absolute right-0 h-12 w-12 rounded-full" onClick={handleSearch} size="icon">
        {searchCount
          ? `Search ${searchCount.toLocaleString()} listings`
          : <Search />}
      </Button>
      </div>
    </div>
  )
}
