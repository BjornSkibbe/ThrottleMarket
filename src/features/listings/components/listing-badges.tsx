import { Badge } from "@/components/ui/badge"
import { formatCondition, formatCategory, formatMileage, formatSize } from "@/lib/formatters"
import { Category, Condition, Size, Model, Type } from "@/types"

interface ListingBadgesProps {
  condition: Condition
  category: Category
  size: Size | null
  motorcycle?: {
    mileage: number | null
    year?: number | null
    model?: Model | null
    type?: Type | null
    engineSize: number | null
  } | null
}

export function ListingBadges({ condition, category, size, motorcycle }: ListingBadgesProps) {
  return (
    <div className="flex gap-1">
      {/* 
        Condition 
        BADGE
        (eg: New, Used)
      */}
      <Badge variant="ghost">
        {formatCondition(condition)}
      </Badge>
      {/* 
        Category 
        BADGE
        (eg: Helmet, Jacket, Pants, Gloves, Boots, Motorcycle)
      */}
      <Badge variant="outline">
        {formatCategory(category)}
      </Badge>
      {/* 
        Mileage 
        BADGE 
        for motorcycles only (eg: 10,000 km)
      */}
      {motorcycle ? (
        <Badge variant="outline">
          {formatMileage(motorcycle.mileage)}
        </Badge>
      ) : null}
      {/* 
        Size 
        BADGE 
        for helmets, jackets, pants, gloves, boots
      */}
      {['HELMET', 'JACKET', 'PANTS', 'GLOVES', 'BOOTS'].includes(category) && (
        <Badge variant="outline">
          {formatSize(size)}
        </Badge>
      )}
      
    </div>
  )
}
