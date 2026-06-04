import { Category, Brand, Condition, Location, Model, Type, FormState, ListingStatus } from "@/types"
import { listingFormSchema, type ListingFormData } from "@/features/listings/lib/listing.schema"

/**
 * Parse a numeric field with validation
 * @param value - The string value to parse
 * @param fieldName - The name of the field for error messages
 * @returns The parsed number
 * @throws Error if parsing fails or value is invalid
 */
export function parseNumericField(value: string, fieldName: string): number {
  const parsed = parseInt(value)
  if (isNaN(parsed)) {
    throw new Error(`Invalid ${fieldName}`)
  }
  return parsed
}

/**
 * Parse a numeric field with range validation
 * @param value - The string value to parse
 * @param fieldName - The name of the field for error messages
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value (optional)
 * @returns The parsed number
 * @throws Error if parsing fails or value is out of range
 */
export function parseNumericFieldWithRange(
  value: string,
  fieldName: string,
  min: number,
  max?: number
): number {
  const parsed = parseInt(value)
  if (isNaN(parsed)) {
    throw new Error(`Invalid ${fieldName}`)
  }
  if (parsed < min) {
    throw new Error(`${fieldName} must be at least ${min}`)
  }
  if (max !== undefined && parsed > max) {
    throw new Error(`${fieldName} must be at most ${max}`)
  }
  return parsed
}

/**
 * Build validation data object from form state
 * @param formData - The current form data
 * @param imageUrls - The uploaded image URLs
 * @returns Validation data object matching ListingFormData schema
 */
export function buildValidationData(
  formData: {
    title: string
    description: string
    price: string
    category: Category | ""
    brand: Brand | ""
    condition: Condition | ""
    location: Location | ""
    model: Model | ""
    type: Type | ""
    year: string
    mileage: string
    engineSize: string
    status: ListingStatus | ""
  },
  imageUrls: string[]
): ListingFormData {
  return {
    title: formData.title,
    description: formData.description,
    price: formData.price,
    category: formData.category as Category,
    brand: formData.brand as Brand,
    condition: formData.condition as Condition,
    location: formData.location as Location,
    images: imageUrls,
    model: formData.model,
    type: formData.type,
    year: formData.year,
    mileage: formData.mileage,
    engineSize: formData.engineSize,
    status: formData.status || undefined,
  }
}

/**
 * Validate form data against the schema
 * @param data - The data to validate
 * @returns The validation result
 */
export function validateFormData(data: ListingFormData) {
  return listingFormSchema.safeParse(data)
}

/**
 * Format a brand/model/type enum value for display
 * @param value - The enum value to format
 * @returns The formatted string with spaces instead of underscores
 */
export function formatEnumValue(value: string): string {
  return value.replace(/_/g, ' ')
}

/**
 * Generate a motorcycle title from brand, model, and year
 * @param brand - The motorcycle brand
 * @param model - The motorcycle model
 * @param year - The motorcycle year (optional)
 * @returns The generated title
 */
export function generateMotorcycleTitle(
  brand: string,
  model: string,
  year?: string
): string {
  const brandName = formatEnumValue(brand)
  const modelName = formatEnumValue(model)
  return year ? `${year} ${brandName} ${modelName}` : `${brandName} ${modelName}`
}

/**
 * Check if form has unsaved changes
 * @param formData - Current form data
 * @param imageUrls - Current image URLs
 * @param initialData - Initial form data
 * @returns True if there are unsaved changes
 */
export function hasUnsavedChanges(
  formData: FormState,
  imageUrls: string[],
  initialData?: Partial<FormState> & { images?: string[] }
): boolean {
  return (
    formData.title !== (initialData?.title || "") ||
    formData.description !== (initialData?.description || "") ||
    formData.price !== (initialData?.price || "") ||
    formData.category !== (initialData?.category || "") ||
    formData.brand !== (initialData?.brand || "") ||
    formData.condition !== (initialData?.condition || "") ||
    formData.location !== (initialData?.location || "") ||
    formData.model !== (initialData?.model || "") ||
    formData.type !== (initialData?.type || "") ||
    formData.year !== (initialData?.year || "") ||
    formData.mileage !== (initialData?.mileage || "") ||
    formData.engineSize !== (initialData?.engineSize || "") ||
    formData.status !== (initialData?.status || "") ||
    JSON.stringify(imageUrls) !== JSON.stringify(initialData?.images || [])
  )
}
