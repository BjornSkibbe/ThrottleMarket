"use client"

import { Badge } from "@/components/ui/badge"
import { formatBrand } from "@/lib/formatters"
import { cn } from "@/lib/utils"

interface BrandFilterProps {
  brands: Record<string, string>
  selectedBrand?: string
  onSelect: (brand: string) => void
  formatFn?: (brand: string) => string
  counts?: Record<string, number>
}

export function BrandFilter({
  brands,
  selectedBrand,
  onSelect,
  formatFn,
  counts,
}: BrandFilterProps) {
  const sortedBrands = Object.entries(brands).sort(([, labelA], [, labelB]) =>
    (formatFn ? formatFn(labelA) : labelA).localeCompare(
      formatFn ? formatFn(labelB) : labelB
    )
  )

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium">Brand</h3>

      <div className="flex flex-wrap gap-2">
        {/* 
          All Brands 
          Display all brands in a badge
        */}
        <Badge
          variant={!selectedBrand ? "default" : "secondary"}
          className={cn(
            "cursor-pointer transition-colors",
            !selectedBrand && "border-primary"
          )}
          onClick={() => onSelect("")}
        >
          All
        </Badge>

        {sortedBrands.map(([value, label]) => {
          const count = counts?.[value] || 0
          return (
            <Badge
              key={value}
              variant={selectedBrand === value ? "default" : "secondary"}
              className={cn(
                "cursor-pointer transition-colors",
                count === 0 && "pointer-events-none opacity-40"
              )}
              onClick={() => onSelect(value)}
            >
              {formatBrand(label)}

              {/* {counts && <span className="ml-1 text-xs text-accent">{count}</span>} */}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}