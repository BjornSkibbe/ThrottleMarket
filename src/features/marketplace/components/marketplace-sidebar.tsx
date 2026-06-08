"use client"

import { Button } from "@/components/ui/button"
import { FilterSelect } from "@/components/filter-select"
import { formatLocation, formatCondition, formatType, formatBrand, formatCategory } from "@/lib/formatters"
import { CONDITION, LOCATION, TYPE, BRAND, CATEGORY, CATEGORY_TO_BRANDS } from "@/lib/constants"
import { RotateCcw, Store } from "lucide-react"
import { BrandFilter } from "@/components/brand-filter"
import { SidebarShell } from "@/components/sidebar-shell"
import { FilterButtonGroup } from "@/components/filter-button-group"
import { Searchbar } from "@/components/searchbar"
import { useMarketplaceFilters } from "@/hooks/use-marketplace-filters"

interface MarketplaceSidebarProps {
  currentFilters?: Record<string, string | undefined>
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

export function MarketplaceSidebar({
  currentFilters,
  categoryCounts,
  brandCounts,
  locationCounts,
  conditionCounts,
  typeCounts,
  filteredCategoryOptions,
  filteredBrandOptions,
  filteredLocationOptions,
  filteredConditionOptions,
  filteredTypeOptions,
}: MarketplaceSidebarProps) {
  const { filters, updateFilter, clearFilters, hasActiveFilters } =
    useMarketplaceFilters(currentFilters)

  return (
    <SidebarShell
      icon={Store}
      title="Marketplace"
      description="Browse and discover motorcycles and gear"
      transparent
      contentClassName="space-y-6"
    >
      <Searchbar />

      <FilterButtonGroup
        label="Condition"
        options={Object.values(filteredConditionOptions || CONDITION) as string[]}
        activeValue={filters.condition}
        onSelect={(value) => updateFilter("condition", value)}
        formatFn={formatCondition}
      />

      <FilterSelect
        label="Category"
        id="category"
        value={filters.category}
        onValueChange={(value) => updateFilter("category", value === "all" ? "" : value)}
        options={filteredCategoryOptions || CATEGORY}
        formatFn={formatCategory}
        placeholder="All categories"
        counts={categoryCounts}
      />

      {filters.category === "MOTORCYCLE" && (
        <FilterSelect
          label="Type"
          id="type"
          value={filters.type}
          onValueChange={(value) => updateFilter("type", value === "all" ? "" : value)}
          options={filteredTypeOptions || TYPE}
          formatFn={formatType}
          placeholder="All types"
          counts={typeCounts}
        />
      )}

      <BrandFilter
        brands={
          filters.category
            ? Object.fromEntries(
                (CATEGORY_TO_BRANDS[filters.category] || [])
                  .filter((brand) => brandCounts && brandCounts[brand] > 0)
                  .map((brand) => [brand, brand])
              )
            : (filteredBrandOptions || BRAND)
        }
        selectedBrand={filters.brand}
        onSelect={(brand) => updateFilter("brand", brand)}
        formatFn={formatBrand}
        counts={brandCounts}
      />

      <FilterSelect
        label="Location"
        id="location"
        value={filters.location}
        onValueChange={(value) => updateFilter("location", value === "all" ? "" : value)}
        options={filteredLocationOptions || LOCATION}
        formatFn={formatLocation}
        placeholder="All locations"
        counts={locationCounts}
      />

      {hasActiveFilters && (
        <Button variant="default" size="lg" onClick={clearFilters} className="w-full">
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset Filters
        </Button>
      )}
    </SidebarShell>
  )
}
