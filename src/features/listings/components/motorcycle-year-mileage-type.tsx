import { formatMileage, formatType } from "@/lib/formatters"
import { Type } from "@/types"

interface MotorcycleYearMileageTypeProps {
  year: number | null
  mileage: number
  type: Type | null
}

export function MotorcycleYearMileageType({ year, mileage, type }: MotorcycleYearMileageTypeProps) {
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground py-2">
      {year && (
        <p>{year}</p>
      )}
      {year && (mileage || type) && (
        <span>•</span>
      )}
      <p>{formatMileage(mileage)}</p>
      {mileage && type && (
        <span>•</span>
      )}
      {type && (
        <p>{formatType(type)}</p>
      )}
    </div>
  )
}
