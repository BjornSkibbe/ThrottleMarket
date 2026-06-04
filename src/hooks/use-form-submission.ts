/**
 * Form Submission Hook
 * 
 * Handles form submission logic for listing forms.
 * Extracted from useListingForm for better separation of concerns.
 */

import { useState, useCallback, useRef } from 'react'
import { Category, Brand, Condition, Location, Model, Type, MotorcycleDetails, ListingData, Size, FormState } from '@/types'
import { createListing, updateListing } from '@/lib/api/listings'
import { parseNumericField, parseNumericFieldWithRange } from '@/lib/form-helpers'
import { FORM_VALIDATION } from '@/lib/constants/form'
import { useToast } from '@/hooks/use-toast'

interface UseFormSubmissionProps {
  mode: 'create' | 'edit'
  listingId?: string
  formData: FormState
  imageUrls: string[]
  onSuccess?: () => void
}

export function useFormSubmission({
  mode,
  listingId,
  formData,
  imageUrls,
  onSuccess,
}: UseFormSubmissionProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const isSubmitting = useRef(false)

  const handleSubmit = useCallback(async () => {
    if (isSubmitting.current) {
      return
    }

    setError('')
    setIsSaving(true)

    try {
      const price = parseNumericField(formData.price, 'price')
      if (price < 0) {
        throw new Error('Invalid price')
      }
      // Prepares listing data for submission
      // Defined in src/hooks/use-form-submission.ts with useCallback
      // Depends on formData and imageUrls for its data
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
      // Adds motorcycle-specific data if category is motorcycle
      // Defined in src/hooks/use-form-submission.ts with useCallback
      // Depends on formData for its data
      if (formData.category === Category.MOTORCYCLE) {
        const year = parseNumericFieldWithRange(
          formData.year || '',
          'year',
          FORM_VALIDATION.year.min,
          FORM_VALIDATION.year.max
        )

        const mileage = parseNumericField(formData.mileage || '', 'mileage')
        if (mileage < 0) {
          throw new Error('Invalid mileage')
        }

        const engineSize = parseNumericField(formData.engineSize || '', 'engine size')
        if (engineSize < 0) {
          throw new Error('Invalid engine size')
        }

        listingData.motorcycle = {
          model: formData.model as Model,
          type: formData.type as Type,
          year,
          mileage,
          engineSize,
        }
      }

      if (mode === 'create') {
        await createListing(listingData)
        toast({
          title: 'Listing created successfully',
          description: 'Your listing has been published.',
        })
      } else {
        if (!listingId) {
          throw new Error('Listing ID is required for edit mode')
        }
        await updateListing(listingId, listingData)
        toast({
          title: 'Listing updated successfully',
          description: 'Your changes have been saved.',
        })
      }

      onSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      })
    } finally {
      isSubmitting.current = false
      setIsSaving(false)
    }
  }, [formData, imageUrls, mode, listingId, onSuccess, toast])

  return {
    isSaving,
    error,
    setError,
    handleSubmit,
  }
}
