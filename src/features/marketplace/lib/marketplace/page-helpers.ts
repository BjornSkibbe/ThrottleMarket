import { BRAND, LOCATION, CONDITION, TYPE, CATEGORY, SIZE } from "@/lib/constants"
import { filterOptionsByCounts } from "./fetch-listings"
import type { MarketplaceFilters } from "./query-builder"
import type { ValidatedSearchParams } from "./validation"

export interface FilterCounts {
  categoryCounts: Record<string, number>
  brandCounts: Record<string, number>
  locationCounts: Record<string, number>
  conditionCounts: Record<string, number>
  typeCounts: Record<string, number>
  sizeCounts: Record<string, number>
}

export interface SidebarProps {
  currentFilters: {
    category?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    location?: string
    condition?: string
    type?: string
    size?: string
    search?: string
    sortBy?: string
  }
  categoryCounts: Record<string, number>
  brandCounts: Record<string, number>
  locationCounts: Record<string, number>
  conditionCounts: Record<string, number>
  typeCounts: Record<string, number>
  sizeCounts: Record<string, number>
  filteredCategoryOptions: Record<string, string>
  filteredBrandOptions: Record<string, string>
  filteredLocationOptions: Record<string, string>
  filteredConditionOptions: Record<string, string>
  filteredTypeOptions: Record<string, string>
  filteredSizeOptions: Record<string, string>
}

export function createEmptyCounts(): FilterCounts {
  return {
    categoryCounts: {},
    brandCounts: {},
    locationCounts: {},
    conditionCounts: {},
    typeCounts: {},
    sizeCounts: {},
  }
}

export function buildMarketplaceFilters(validatedParams: ValidatedSearchParams): MarketplaceFilters {
  return {
    category: validatedParams.category,
    brand: validatedParams.brand,
    minPrice: validatedParams.minPrice,
    maxPrice: validatedParams.maxPrice,
    location: validatedParams.location,
    condition: validatedParams.condition,
    type: validatedParams.type,
    size: validatedParams.size,
    search: validatedParams.search,
  }
}

export function buildFilteredOptions(counts: FilterCounts) {
  return {
    filteredCategoryOptions: filterOptionsByCounts(CATEGORY, counts.categoryCounts),
    filteredBrandOptions: filterOptionsByCounts(BRAND, counts.brandCounts),
    filteredLocationOptions: filterOptionsByCounts(LOCATION, counts.locationCounts),
    filteredConditionOptions: filterOptionsByCounts(CONDITION, counts.conditionCounts),
    filteredTypeOptions: filterOptionsByCounts(TYPE, counts.typeCounts),
    filteredSizeOptions: filterOptionsByCounts(SIZE, counts.sizeCounts),
  }
}

export function buildSidebarProps(
  params: { category?: string; brand?: string; minPrice?: string; maxPrice?: string; location?: string; condition?: string; type?: string; size?: string; search?: string; sortBy?: string },
  counts: FilterCounts,
  filteredOptions: ReturnType<typeof buildFilteredOptions>
): SidebarProps {
  return {
    currentFilters: params,
    categoryCounts: counts.categoryCounts,
    brandCounts: counts.brandCounts,
    locationCounts: counts.locationCounts,
    conditionCounts: counts.conditionCounts,
    typeCounts: counts.typeCounts,
    sizeCounts: counts.sizeCounts,
    filteredCategoryOptions: filteredOptions.filteredCategoryOptions,
    filteredBrandOptions: filteredOptions.filteredBrandOptions,
    filteredLocationOptions: filteredOptions.filteredLocationOptions,
    filteredConditionOptions: filteredOptions.filteredConditionOptions,
    filteredTypeOptions: filteredOptions.filteredTypeOptions,
    filteredSizeOptions: filteredOptions.filteredSizeOptions,
  }
}
