import { formatBrand, formatModel, formatMileage, formatEngineSize, formatType } from "@/lib/formatters"
import { Brand, Model, Type } from "@/types"

interface MotorcycleDetailsProps {
  brand: Brand
  motorcycle: {
    model: Model
    year: number | null
    mileage: number | null
    engineSize: number | null
    type: Type | null
  }
}

export function MotorcycleDetails({ brand, motorcycle }: MotorcycleDetailsProps) {
  const details = [
    { label: 'Brand', value: brand ? formatBrand(brand) : null },
    { label: 'Model', value: motorcycle.model ? formatModel(motorcycle.model) : null },
    { label: 'Year', value: motorcycle.year },
    { label: 'Mileage', value: formatMileage(motorcycle.mileage) },
    { label: 'Engine Size', value: formatEngineSize(motorcycle.engineSize) },
    { label: 'Type', value: motorcycle.type ? formatType(motorcycle.type) : null },
  ].filter((item) => item.value !== null)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-fit">
      {details.map((item) => (
        <div key={item.label} className="py-8 rounded-2xl bg-muted/30 text-center">
          <p className="text-xs italic text-muted-foreground">{item.label}</p>
          <p className="text-sm italic font-extrabold">{item.value}</p>
        </div>
      ))}
    </div>
  )
}
