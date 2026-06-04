import { formatBrand, formatModel } from "@/lib/formatters"
import { Brand, Model } from "@/types"

interface ListingTitleProps {
  motorcycle?: {
    year?: number | null
    model?: Model
  } | null
  title: string | null
  brand: Brand
  className?: string
}

export function ListingTitle({ motorcycle, title, brand, className = "" }: ListingTitleProps) {
  if (motorcycle) {
    return (
      <h1 className={className}>
        {motorcycle.year} {formatBrand(brand || '')} {motorcycle.model ? formatModel(motorcycle.model) : ''}
      </h1>
    )
  }

  if (title) {
    return (
      <h1 className={className}>
        {title}
      </h1>
    )
  }

  return null
}
