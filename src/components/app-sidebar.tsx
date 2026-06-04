"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FilterSelect } from "@/components/filter-select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatLocation, formatCondition, formatType, formatBrand, formatCategory } from "@/lib/formatters"
import { CONDITION, LOCATION, SIZE, TYPE, MODEL, BRAND, CATEGORY, CATEGORY_TO_BRANDS } from "@/lib/constants"
import { PackageX, X } from "lucide-react"
import { BrandFilter } from "@/components/brand-filter"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Searchbar } from "./searchbar"
import { PageTitle } from "./page-title"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
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
}

export function AppSidebar({ currentFilters = {}, categoryCounts, brandCounts, locationCounts, conditionCounts, typeCounts, filteredCategoryOptions, filteredBrandOptions, filteredLocationOptions, filteredConditionOptions, filteredTypeOptions, ...props }: AppSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/marketplace?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/marketplace")
  }

  const isValidFilterValue = (value: unknown) =>
  typeof value === "string" && value !== "" && value !== "newest"

  const hasActiveFilters = Object.values({
    category: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    condition: "",
    brand: "",
    type: "",
    model: "",
    size: "",
    search: "",
    sortBy: "",
    ...currentFilters,
  }).some(isValidFilterValue)

  return (
    <Sidebar {...props}>
      <SidebarContent className="p-6 sm:p-12 space-y-6 bg-muted/30">
        <Card className="bg-transparent gap-6 rounded-none">
          {/* 
            Page Title + Description
          */} 
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                <PageTitle 
                  icon={PackageX} 
                  title="Marketplace"
                  description="Browse and discover motorcycles and gear" 
                />
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-12">
            {/* 
              Search Bar COMPONENT
            */}
            <Searchbar />

            {/* 
              Condition FILTER - Radio Group
            */}
            <div className="relative">
              <Label className="pb-4 text-xs font-medium">Condition</Label>
              <RadioGroup
                value={currentFilters.condition || "all"}
                onValueChange={(value) => {
                  updateFilter("condition", value === "all" ? "" : value)
                }}
                className="flex flex-row gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="condition-all" />
                  <Label htmlFor="condition-all" className="font-normal cursor-pointer">All</Label>
                </div>
                {Object.values(filteredConditionOptions || CONDITION).map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <RadioGroupItem value={condition} id={`condition-${condition}`} />
                    <Label htmlFor={`condition-${condition}`} className="font-normal cursor-pointer">
                      {formatCondition(condition)}
                      {conditionCounts && conditionCounts[condition] !== undefined && (
                        <span className="text-accent text-xs">{conditionCounts[condition]}</span>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* 
              Category FILTER - Select Dropdown 
            */}
            <FilterSelect
              label="Category"
              id="category"
              value={currentFilters.category || ""}
              onValueChange={(value) => updateFilter("category", value === "all" ? "" : value)}
              options={filteredCategoryOptions || CATEGORY}
              formatFn={formatCategory}
              placeholder="All categories"
              counts={categoryCounts}
            />
            {currentFilters.category === 'MOTORCYCLE' && (
              /* 
                Type FILTER - Select Dropdown 
              */
              <FilterSelect
                label="Type"
                id="type"
                value={currentFilters.type || ""}
                onValueChange={(value) => updateFilter("type", value === "all" ? "" : value)}
                options={filteredTypeOptions || TYPE}
                formatFn={formatType}
                placeholder="All types"
                counts={typeCounts}
              />
            )}
            {/* 
              Brand FILTER - BrandFilter COMPONENT 
            */}
            <BrandFilter
              brands={
                currentFilters.category
                  ? Object.fromEntries(
                      (CATEGORY_TO_BRANDS[currentFilters.category] || [])
                        .filter(
                          brand => brandCounts && brandCounts[brand] > 0
                        )
                        .map(brand => [brand, brand])
                    )
                  : (filteredBrandOptions || BRAND)
              }
              selectedBrand={currentFilters.brand}
              onSelect={(brand) => updateFilter("brand", brand)}
              formatFn={formatBrand}
              counts={brandCounts}
            />
            {/* 
              Location FILTER - Select Dropdown 
            */}
            <FilterSelect
              label="Location"
              id="location"
              value={currentFilters.location || ""}
              onValueChange={(value) => updateFilter("location", value === "all" ? "" : value)}
              options={filteredLocationOptions || LOCATION}
              formatFn={formatLocation}
              placeholder="All locations"
              counts={locationCounts}
            />
      
            {hasActiveFilters && (
              <Button
                variant="default"
                size="lg"
                onClick={clearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-1" />
                Reset Filters
              </Button>
            )}
          </CardContent>
        </Card>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
