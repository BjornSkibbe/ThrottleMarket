/**
 * Form State Hook
 * 
 * Manages form state for listing forms.
 * Extracted from useListingForm for better separation of concerns.
 */

import { useState, useCallback } from 'react'
import { FormState } from '@/types'

interface UseFormStateProps {
  initialData?: Partial<FormState>
}

export function useFormState({ initialData }: UseFormStateProps = {}) {
  // Initializes form state with initialData or default values
  // Defined in src/hooks/use-form-state.ts with useState
  // Depends on initialData for its initial state
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

  const updateField = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])
  // Resets the form data to its initial values captured by initialData.
  // Reinitializes all fields to initialData or defaults
  // Defined in src/hooks/use-form-state.ts with useCallback
  // Depends on initialData for its reset baseline
  const resetForm = useCallback(() => {
    setFormData({
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
  }, [initialData])

  return {
    formData,
    setFormData,
    updateField,
    resetForm,
  }
}
