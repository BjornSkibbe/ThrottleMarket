import { Brand, Model, Condition, Category, Location, Type, Size } from "@/types"
import { formatBrand, formatModel, formatPrice } from "@/lib/formatters"
import { ListingLocationCreated } from "@/features/listings/components/listing-location-created"
import { ListingBadges } from "@/features/listings/components/listing-badges"
import { ListingTitle } from "@/features/listings/components/listing-title"

interface ListingDetailsSingleProps {
  condition: Condition
  category: Category
  brand: Brand
  title: string | null
  description: string | null
  price: number
  size: Size | null
  location: Location
  createdAt: Date
  motorcycle?: {
    year: number | null
    model: Model
    mileage: number | null
    type: Type | null
    engineSize: number | null
  } | null
}

export function ListingDetailsSingle({ 
  condition, 
  category,
  brand, 
  title, 
  description,
  price, 
  size,
  location, 
  createdAt, 
  motorcycle
}: ListingDetailsSingleProps) {
  return (
    <>
      <div className="flex flex-col gap-6">
        {/* 
          ListingBadges 
          COMPONENT 
        */}
        <ListingBadges
          condition={condition}
          category={category}
          size={size}
          motorcycle={motorcycle}
        />
        {/* 
          ListingTitle 
          COMPONENT 
        */}
        <ListingTitle
          motorcycle={motorcycle}
          title={title}
          brand={brand}
          className="text-2xl sm:text-5xl font-extrabold leading-tighter tracking-tight italic"
        />
        {/* 
          ListingLocationCreated 
          COMPONENT 
        */}
        <ListingLocationCreated 
          className="justify-start"
          location={location} 
          createdAt={createdAt}  
        />
        {/* 
          Price 
        */}
        <p className="text-lg sm:text-2xl font-extrabold text-left">
          {formatPrice(price)}
        </p>
        {/*
          Description 
        */}
        <p className="whitespace-pre-wrap text-xs text-left tracking-wide leading-5 text-foreground/50 font-normal border-l-2 border-l-primary pl-6">
          {description}
        </p>
      </div>
    </>
  )
}
