import { Model, Type } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bike } from "lucide-react"
import { useEffect, useCallback, useMemo } from "react"
import { FORM_LABELS, FORM_PLACEHOLDERS, FORM_VALIDATION } from "@/lib/constants/form"
import { BRAND_TO_MODELS, MODEL_TO_TYPE } from "@/lib/constants"
import { formatModel, formatType } from "@/lib/formatters"
import { useListingFormContext } from "@/features/listings/contexts/listing-form-context"

export function MotorcycleDetailsFields() {
  const { formData, setFormData } = useListingFormContext()

  const brand = formData.brand
  const model = formData.model
  const type = formData.type
  const year = formData.year
  const mileage = formData.mileage
  const engineSize = formData.engineSize

  const setModel = useCallback((value: Model | "") => setFormData((prev) => ({ ...prev, model: value })), [setFormData])
  const setType = useCallback((value: Type | "") => setFormData((prev) => ({ ...prev, type: value })), [setFormData])
  const setYear = (value: string) => setFormData((prev) => ({ ...prev, year: value }))
  const setMileage = (value: string) => setFormData((prev) => ({ ...prev, mileage: value }))
  const setEngineSize = (value: string) => setFormData((prev) => ({ ...prev, engineSize: value }))

  // Get available models based on selected brand
  const availableModels = useMemo(
    () => (brand && BRAND_TO_MODELS[brand] ? BRAND_TO_MODELS[brand] : []),
    [brand]
  )

  // Reset model when brand changes
  useEffect(() => {
    if (brand && model && !availableModels.includes(model)) {
      setModel("")
    }
  }, [brand, model, availableModels, setModel])

  // Auto-populate type when model changes
  useEffect(() => {
    if (model && MODEL_TO_TYPE[model]) {
      setType(MODEL_TO_TYPE[model] as Type)
    } else if (!model) {
      setType("")
    }
  }, [model, setType])

  // Reset model if brand changes and current model is not in new brand's models
  const handleModelChange = (value: Model | "") => {
    setModel(value)
  }

  return (
    <div className="space-y-4 p-8 border-2 border-dashed border-border rounded-lg">
      <h3 className="font-semibold flex items-center gap-2 pb-3">
        <Bike className="h-5 w-5" />
        Motorcycle Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Model - @Example: CBR600RR, Ninja 500, Z650 */}
        <div className="space-y-4">
          <Label htmlFor="model">{FORM_LABELS.model}</Label>
          <Select 
            value={model} 
            onValueChange={handleModelChange}
            disabled={!brand}
          >
            <SelectTrigger id="model">
              <SelectValue placeholder={!brand ? "Select brand first" : FORM_PLACEHOLDERS.model} />
            </SelectTrigger>
            <SelectContent>
              {availableModels.length > 0 ? (
                availableModels.map((modelValue: string) => (
                  <SelectItem key={modelValue} value={modelValue as Model}>
                    {formatModel(modelValue as Model)}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="OTHER">Other</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Type - @Example: Supersport, Hyper Naked, Supermoto */}
        <div className="space-y-4">
          <Label htmlFor="type">{FORM_LABELS.type}</Label>
          <Input
            id="type"
            value={type ? formatType(type) : ""}
            placeholder={FORM_PLACEHOLDERS.type}
            readOnly
            className="bg-muted"
          />
        </div>

        {/* Year - @Example: 2020, 2021, 2022 */}
        <div className="space-y-4">
          <Label htmlFor="year">{FORM_LABELS.year}</Label>
          <Input
            id="year"
            type="number"
            placeholder={FORM_PLACEHOLDERS.year}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            min={FORM_VALIDATION.year.min}
            max={FORM_VALIDATION.year.max}
          />
        </div>

        {/* Mileage - @Example: 10000, 20000, 30000 */}
        <div className="space-y-4">
          <Label htmlFor="mileage">{FORM_LABELS.mileage}</Label>
          <Input
            id="mileage"
            type="number"
            placeholder={FORM_PLACEHOLDERS.mileage}
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            required
            min={FORM_VALIDATION.mileage.min}
          />
        </div>
        
        {/* Engine Size - @Example: 600, 750, 1000 */}
        <div className="space-y-4">
          <Label htmlFor="engineSize">{FORM_LABELS.engineSize}</Label>
          <Input
            id="engineSize"
            type="number"
            placeholder={FORM_PLACEHOLDERS.engineSize}
            value={engineSize}
            onChange={(e) => setEngineSize(e.target.value)}
            required
            min={FORM_VALIDATION.engineSize.min}
          />
        </div>
      </div>
    </div>
  )
}
