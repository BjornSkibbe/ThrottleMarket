import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { z } from "zod"
import { Category, Model, Type, ListingData, FormState } from "@/types"
import { listingFormSchema, type ListingFormData } from "@/features/listings/lib/listing.schema"
import { createListing, updateListing } from "@/lib/api/listings"
import { 
  buildValidationData, 
  validateFormData, 
  parseNumericField, 
  parseNumericFieldWithRange,
  hasUnsavedChanges,
  generateMotorcycleTitle
} from "@/lib/form-helpers"
import { FORM_VALIDATION } from "@/lib/constants/form"
import { useToast } from "@/hooks/use-toast"

interface UseListingFormProps {
  mode: "create" | "edit"
  listingId?: string
  initialData?: Partial<FormState> & { images?: string[] }
  onSuccess?: () => void
}

export function useListingForm({ mode, listingId, initialData, onSuccess }: UseListingFormProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<z.ZodError<ListingFormData> | null>(null)
  const isSubmitting = useRef(false)

  const [formData, setFormData] = useState<FormState>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    size: initialData?.size || "",
    category: initialData?.category || "",
    brand: initialData?.brand || "",
    condition: initialData?.condition || "",
    location: initialData?.location || "",
    model: initialData?.model || "",
    type: initialData?.type || "",
    year: initialData?.year || "",
    mileage: initialData?.mileage || "",
    engineSize: initialData?.engineSize || "",
    status: initialData?.status || "",
  })
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || [])

  // Store original data for dirty check
  const [originalData, setOriginalData] = useState(initialData)
  const hasInitialized = useRef(false)

  // Update form state when initialData changes (for edit mode data fetching)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        price: initialData.price || "",
        size: initialData.size || "",
        category: initialData.category || "",
        brand: initialData.brand || "",
        condition: initialData.condition || "",
        location: initialData.location || "",
        model: initialData.model || "",
        type: initialData.type || "",
        year: initialData.year || "",
        mileage: initialData.mileage || "",
        engineSize: initialData.engineSize || "",
        status: initialData.status || "",
      })
      setImageUrls(initialData.images || [])
      setOriginalData(initialData)
      hasInitialized.current = true
    }
  }, [initialData])

  const getValidationData = useCallback(() => {
    return buildValidationData(formData, imageUrls)
  }, [formData, imageUrls])

  const validateForm = useCallback(() => {
    try {
      const dataToValidate = getValidationData()
      listingFormSchema.parse(dataToValidate)
      setValidationErrors(null)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(error as z.ZodError<ListingFormData>)
      }
      return false
    }
  }, [getValidationData])

  const isFormValid = useMemo(() => {
    const dataToValidate = getValidationData()
    const result = validateFormData(dataToValidate)
    return result.success
  }, [getValidationData])

  const handleSubmit = useCallback(async () => {
    if (isSubmitting.current) {
      return
    }

    setError("")
    setValidationErrors(null)

    if (!validateForm()) {
      return
    }

    isSubmitting.current = true
    setIsSaving(true)

    try {
      const price = parseNumericField(formData.price, "price")
      if (price < 0) {
        throw new Error("Invalid price")
      }

      const listingData: ListingData = {
        title: formData.title,
        description: formData.description,
        price,
        size: formData.size || null,
        category: formData.category as Category,
        brand: formData.brand,
        condition: formData.condition,
        location: formData.location,
        images: imageUrls.map((url, index) => ({ url, order: index })),
        ...(formData.status ? { status: formData.status } : {}),
      }

      if (formData.category === Category.MOTORCYCLE) {
        const year = parseNumericFieldWithRange(
          formData.year || "",
          "year",
          FORM_VALIDATION.year.min,
          FORM_VALIDATION.year.max
        )

        const mileage = parseNumericField(formData.mileage || "0", "mileage")
        if (mileage < 0) {
          throw new Error("Invalid mileage")
        }

        const engineSize = parseNumericField(formData.engineSize || "600", "engine size")
        if (engineSize < 0) {
          throw new Error("Invalid engine size")
        }

        listingData.motorcycle = {
          model: formData.model as Model,
          type: formData.type as Type,
          year,
          mileage,
          engineSize,
        }
      }

      if (mode === "create") {
        await createListing(listingData)
        toast({
          title: "Listing created successfully",
          description: "Your listing has been published.",
        })
      } else {
        if (!listingId) {
          throw new Error("Listing ID is required for edit mode")
        }
        await updateListing(listingId, listingData)
        toast({
          title: "Listing updated successfully",
          description: "Your changes have been saved.",
        })
      }

      onSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      isSubmitting.current = false
      setIsSaving(false)
    }
  }, [formData, imageUrls, mode, listingId, validateForm, onSuccess, toast])

  const isDirty = useMemo(() => {
    return hasUnsavedChanges(formData, imageUrls, originalData)
  }, [formData, imageUrls, originalData])

  const autoGenerateTitle = useCallback(() => {
    if (formData.category === Category.MOTORCYCLE && formData.brand && formData.model) {
      const generatedTitle = generateMotorcycleTitle(formData.brand, formData.model, formData.year)
      setFormData(prev => ({ ...prev, title: generatedTitle }))
    }
  }, [formData.category, formData.brand, formData.model, formData.year])

  return {
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
  }
}
