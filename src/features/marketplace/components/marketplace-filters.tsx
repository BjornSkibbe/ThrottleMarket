"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FilterSelect } from "@/components/filter-select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatLocation, formatCondition, formatType, formatBrand, formatCategory } from "@/lib/formatters"
import { CONDITION, LOCATION, SIZE, TYPE, MODEL, BRAND, CATEGORY, CATEGORY_TO_BRANDS } from "@/lib/constants"
import { X } from "lucide-react"
import { BrandFilter } from "@/components/brand-filter"
import { useMarketplaceFilters } from "@/hooks/use-marketplace-filters"

interface MarketplaceFiltersProps {
  currentFilters: {
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

export function MarketplaceFilters({ currentFilters, categoryCounts, brandCounts, locationCounts, conditionCounts, typeCounts, filteredCategoryOptions, filteredBrandOptions, filteredLocationOptions, filteredConditionOptions, filteredTypeOptions }: MarketplaceFiltersProps) {
  const { updateFilter, clearFilters, hasActiveFilters, isPending } = useMarketplaceFilters(currentFilters)

  return (
    <Card className={`sticky top-17.5 bg-background rounded-none py-6 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sr-only">Filters</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 
          Condition - Radio Group:
          Displays condition options
          Displayed in a radio group component on the frontend
        */}
        <div className="relative">
          <Label className="text-xs font-medium pb-4">Condition</Label>
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
          Category - FilterSelect Dropdown COMPONENT:
          Displays category options
          Displayed in a select dropdown component on the frontend
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
            Type - FilterSelect Dropdown COMPONENT:
            Only shown when category is MOTORCYCLE
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
          BrandFilter COMPONENT:
          Displays brand options based on selected category
          Displayed in a <Badge /> component on the frontend
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
          Location - Select Dropdown
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
          size="default"
          onClick={clearFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
      </CardContent>

      
    </Card>
  )
}
