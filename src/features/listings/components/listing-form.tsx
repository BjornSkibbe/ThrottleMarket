"use client"

/**
 * ListingForm Component
 * 
 * A comprehensive form component for creating and editing motorcycle and riding gear listings.
 * Supports both create and edit modes with full validation, image upload, and category-specific fields.
 * 
 * Features:
 * - Dual mode operation: Create new listings or edit existing ones
 * - Category-specific fields: Motorcycle listings include model, year, mileage, and engine size
 * - Auto-generated titles for motorcycles based on brand, model, and year
 * - Image upload with drag-and-drop support
 * - Real-time form validation using Zod schema
 * - Dirty state tracking to warn about unsaved changes
 * - Confirmation dialog before canceling with unsaved changes
 * - Concurrent submission protection
 * - Request timeout handling (10s for fetch, 15s for submit)
 * - Comprehensive error handling with user-friendly messages
 * - Loading states with spinner animation
 * 
 * Props:
 * - mode: "create" | "edit" - Determines whether the form is creating or editing
 * - listingId?: string - Required for edit mode, the ID of the listing to edit
 * - initialData?: Initial form data for edit mode or pre-filling create mode
 * 
 * Form Fields:
 * - Category: MOTORCYCLE, HELMET, JACKET, PANTS, GLOVES, BOOTS, PARTS, ACCESSORIES
 * - Price: Numeric input in ZAR
 * - Title: Auto-generated for motorcycles, manual for other categories
 * - Description: Required field with minimum length validation
 * - Brand: Selection from predefined brand list
 * - Condition: Selection from predefined condition list
 * - Location: Selection from predefined location list
 * - Images: Multiple image upload with URL validation
 * - Motorcycle-specific (when category is MOTORCYCLE):
 *   - Model: Required motorcycle model selection
 *   - Type: Required motorcycle type selection
 *   - Year: Required year (1900 to current year + 1)
 *   - Mileage: Required mileage in KM
 *   - Engine Size: Required engine size in CC
 * 
 * Validation:
 * - Client-side validation using Zod schema
 * - Real-time validation feedback
 * - Category-specific conditional validation
 * - Numeric validation with range checks
 * - URL validation for images
 * 
 * Security:
 * - parseInt validation to prevent NaN
 * - Request timeout protection
 * - Concurrent submission prevention
 * - Type-safe error handling
 * 
 * Performance:
 * - Memoized form validation
 * - useCallback for event handlers
 * - Shared validation logic to prevent duplication
 * - Optimized re-renders
 */

import { ErrorBoundary } from "@/components/error-boundary"
import { logBusinessEvent } from "@/lib/logger/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Category, Size, Brand, Condition, Location, Model, Type, ListingStatus } from "@/types"
import { useListingForm } from "@/hooks/use-listing-form"
import { useListingData } from "@/features/listings/hooks/use-listing-data"
import { ListingDetailsFields } from "@/features/listings/components/listing-form/listing-details-fields"
import { MotorcycleDetailsFields } from "@/features/listings/components/listing-form/motorcycle-details-fields"
import { ImageUploadSection } from "@/features/listings/components/listing-form/image-upload-section"
import { FormActions } from "@/features/listings/components/listing-form/form-actions"
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog"
import { FormHeader } from "@/features/listings/components/listing-form/form-header"
import { FormErrorDisplay } from "@/features/listings/components/listing-form/form-error-display"
import { FormLoadingState } from "@/features/listings/components/listing-form/form-loading-state"
import { Separator } from "@/components/ui/separator"

interface ListingFormProps {
  mode: "create" | "edit"
  listingId?: string
  initialData?: {
    title: string
    description: string
    price: string
    size: Size | ""
    brand: Brand | ""
    condition: Condition | ""
    location: Location | ""
    model: Model | ""
    type: Type | ""
    year: string
    mileage: string
    engineSize: string
    category: Category | ""
    status: ListingStatus | ""
    images: string[]
  }
}

export default function ListingForm({ mode, listingId, initialData }: ListingFormProps) {
  const router = useRouter()
  
  // Fetch listing data for edit mode
  const { isLoading, error: fetchError, data: fetchedData } = useListingData({
    listingId,
    enabled: mode === "edit",
  })

  // Use the fetched data or initialData
  const effectiveInitialData = fetchedData || initialData

  // Form hook
  const {
    formData,
    setFormData,
    imageUrls,
    setImageUrls,
    isSaving,
    error,
    validationErrors,
    setError,
    isFormValid,
    handleSubmit,
    isDirty,
    autoGenerateTitle,
  } = useListingForm({
    mode,
    listingId,
    initialData: effectiveInitialData,
    onSuccess: () => {
      const action = mode === "create" ? "created_listing" : "updated_listing"
      logBusinessEvent(action, { listingId, category: formData.category, mode })
      
      if (mode === "create") {
        router.push("/marketplace-dashboard")
      } else {
        router.push(`/listings/${listingId}`)
      }
    },
  })

  // Auto-generate title for motorcycles
  useEffect(() => {
    autoGenerateTitle()
  }, [autoGenerateTitle])

  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelDialog(true)
    } else {
      router.back()
    }
  }

  // Show loading state
  if (isLoading) {
    return <FormLoadingState />
  }

  const fetchErrorMessage =
    mode === "edit" && fetchError
      ? fetchError instanceof Error
        ? fetchError.message
        : "Failed to load listing"
      : ""

  if (mode === "edit" && !effectiveInitialData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <FormHeader mode={mode} listingId={listingId} />
        <FormErrorDisplay error={fetchErrorMessage || "Failed to load listing"} />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="flex justify-between">
        <div className="container mx-auto max-w-4xl px-3 md:px-0">
          <Card className="p-6 bg-muted/30">
            <CardHeader>
              <CardTitle className="sr-only">Listing Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                <FormHeader mode={mode} listingId={listingId} />
                <Separator />
                <FormErrorDisplay error={error} validationErrors={validationErrors} />
                {/* 
                  ListingDetailsFields 
                  COMPONENT
                */}
                <ListingDetailsFields
                  category={formData.category}
                  setCategory={(value) => setFormData({ ...formData, category: value })}
                  condition={formData.condition}
                  setCondition={(value) => setFormData({ ...formData, condition: value })}
                  size={formData.size}
                  setSize={(value) => setFormData({ ...formData, size: value })}
                  price={formData.price}
                  setPrice={(value) => setFormData({ ...formData, price: value })}
                  title={formData.title}
                  setTitle={(value) => setFormData({ ...formData, title: value })}
                  description={formData.description}
                  setDescription={(value) => setFormData({ ...formData, description: value })}
                  brand={formData.brand}
                  setBrand={(value) => setFormData({ ...formData, brand: value })}
                  location={formData.location}
                  setLocation={(value) => setFormData({ ...formData, location: value })}
                  status={formData.status}
                  setStatus={(value) => setFormData({ ...formData, status: value })}
                />
                {/* 
                  MotorcycleDetailsFields 
                  COMPONENT
                */}
                {formData.category === Category.MOTORCYCLE && (
                  <MotorcycleDetailsFields
                    brand={formData.brand}
                    model={formData.model}
                    setModel={(value) => setFormData({ ...formData, model: value })}
                    type={formData.type}
                    setType={(value) => setFormData({ ...formData, type: value })}
                    year={formData.year}
                    setYear={(value) => setFormData({ ...formData, year: value })}
                    mileage={formData.mileage}
                    setMileage={(value) => setFormData({ ...formData, mileage: value })}
                    engineSize={formData.engineSize}
                    setEngineSize={(value) => setFormData({ ...formData, engineSize: value })}
                  />
                )}
                {/* 
                  Image Upload Section 
                  COMPONENT
                */}
                <ImageUploadSection
                  imageUrls={imageUrls}
                  setImageUrls={setImageUrls}
                />
                {/* 
                  Form Actions 
                  COMPONENT
                */}
                <FormActions
                  mode={mode}
                  isSaving={isSaving}
                  isFormValid={isFormValid}
                  isDirty={isDirty}
                  onCancel={handleCancel}
                />
                
              </form>
            </CardContent>
          </Card>
          {/* 
            Unsaved Changes Dialog 
            COMPONENT
          */}
          <UnsavedChangesDialog
            open={showCancelDialog}
            onOpenChange={setShowCancelDialog}
            onConfirm={() => router.back()}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
