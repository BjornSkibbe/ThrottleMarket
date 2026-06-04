/**
 * Form Validation Hook
 * 
 * Handles form validation using Zod schemas.
 * Extracted from useListingForm for better separation of concerns.
 */

import { useCallback, useMemo } from 'react'
import { z } from 'zod'
import { listingFormSchema, type ListingFormData } from '@/features/listings/lib/listing.schema'
import { buildValidationData, validateFormData } from '@/lib/form-helpers'
import { FormState } from '@/types'

interface UseFormValidationProps {
  formData: FormState
  imageUrls: string[]
}

export function useFormValidation({ formData, imageUrls }: UseFormValidationProps) {
  const getValidationData = useCallback(() => {
    return buildValidationData(formData, imageUrls)
  }, [formData, imageUrls])

  const validateForm = useCallback(() => {
    try {
      const dataToValidate = getValidationData()
      listingFormSchema.parse(dataToValidate)
      return { success: true, errors: null }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, errors: error as z.ZodError<ListingFormData> }
      }
      return { success: false, errors: null }
    }
  }, [getValidationData])

  const isFormValid = useMemo(() => {
    const dataToValidate = getValidationData()
    const result = validateFormData(dataToValidate)
    return result.success
  }, [getValidationData])

  return {
    validateForm,
    isFormValid,
    getValidationData,
  }
}
