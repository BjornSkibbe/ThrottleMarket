import { formatCondition, formatBrand, formatModel, formatPrice, formatCategory, formatSize, formatMileage } from "@/lib/formatters"
import { ListingLocationCreated } from "@/features/listings/components/listing-location-created"
import { MotorcycleYearMileageType } from "@/features/listings/components/motorcycle-year-mileage-type"
import { ListingBadges } from "@/features/listings/components/listing-badges"
import { ListingTitle } from "@/features/listings/components/listing-title"
import { memo } from "react"
import { Location, Category, Condition, Brand, Type, Model, Size } from "@/types"

interface ListingDetailsProps {
  condition: Condition
  category: Category
  brand: Brand
  title: string | null
  price: number
  size: Size | null
  location: Location
  createdAt: Date
  motorcycle?: {
    year: number | null
    model: Model
    mileage: number
    type: Type | null
    engineSize: number
  } | null
}

export const ListingDetails = memo(function ListingDetails({ 
  condition, 
  category,
  brand, 
  title, 
  price, 
  size,
  location, 
  createdAt, 
  motorcycle
}: ListingDetailsProps) {
  return (
    <>
      <div className="space-y-2">
        <div className="flex flex-col gap-3">
          {/* 
            ListingBadges COMPONENT 
            Shows condition, category, mileage (for motorcycles), and size (for gear)
          */}
          <ListingBadges
            condition={condition}
            category={category}
            size={size}
            motorcycle={motorcycle}
          />
          {/* 
            Title 
            Shows title and brand
          */}
          <ListingTitle
            motorcycle={motorcycle}
            title={title}
            brand={brand}
            className="text-normal font-bold leading-tight tracking-tight"
          />
        </div>
        {/* 
          ListingLocationCreated COMPONTENT 
          Shows location and creation date
        */}
        <ListingLocationCreated 
          location={location} 
          createdAt={createdAt}  
        />
        {/* 
          Price 
          Shows price
        */}
        <p className="text-sm font-semibold">
          {formatPrice(price)}
        </p>
      </div>
    </>
  )
})
