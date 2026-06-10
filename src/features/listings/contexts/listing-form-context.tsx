"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { FormState } from "@/types"
import { ListingFormData } from "@/features/listings/lib/listing.schema"
import { useListingForm } from "@/hooks/use-listing-form"
import { logBusinessEvent } from "@/lib/logger/client"

interface ListingFormContextValue {
  formData: FormState
  setFormData: React.Dispatch<React.SetStateAction<FormState>>
  imageUrls: string[]
  setImageUrls: (urls: string[]) => void
  mode: "create" | "edit"
  isFormValid: boolean
  isSaving: boolean
  isDirty: boolean
  validationErrors: z.ZodError<ListingFormData> | null
  error: string
  handleSubmit: () => void
  handleCancel: () => void
  handleConfirmCancel: () => void
  showCancelDialog: boolean
  setShowCancelDialog: (open: boolean) => void
}

const ListingFormContext = createContext<ListingFormContextValue | undefined>(undefined)

interface ListingFormProviderProps {
  children: ReactNode
  mode: "create" | "edit"
  listingId?: string
  initialData?: Partial<FormState> & { images?: string[] }
}

export function ListingFormProvider({
  children,
  mode,
  listingId,
  initialData,
}: ListingFormProviderProps) {
  const router = useRouter()
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const {
    formData,
    setFormData,
    imageUrls,
    setImageUrls,
    isSaving,
    error,
    validationErrors,
    isFormValid,
    handleSubmit,
    isDirty,
    autoGenerateTitle,
  } = useListingForm({
    mode,
    listingId,
    initialData,
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

  useEffect(() => {
    autoGenerateTitle()
  }, [autoGenerateTitle])

  const handleCancel = useCallback(() => {
    if (isDirty) {
      setShowCancelDialog(true)
    } else {
      router.back()
    }
  }, [isDirty, router])

  const handleConfirmCancel = useCallback(() => {
    router.back()
  }, [router])

  const value: ListingFormContextValue = {
    formData,
    setFormData,
    imageUrls,
    setImageUrls,
    mode,
    isFormValid,
    isSaving,
    isDirty,
    validationErrors,
    error,
    handleSubmit,
    handleCancel,
    handleConfirmCancel,
    showCancelDialog,
    setShowCancelDialog,
  }

  return (
    <ListingFormContext.Provider value={value}>
      {children}
    </ListingFormContext.Provider>
  )
}

export function useListingFormContext() {
  const context = useContext(ListingFormContext)
  if (!context) {
    throw new Error("useListingFormContext must be used within a ListingFormProvider")
  }
  return context
}
