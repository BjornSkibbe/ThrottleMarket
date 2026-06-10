import { Button } from "@/components/ui/button"
import { BUTTON_TEXT } from "@/lib/constants/form"
import { useListingFormContext } from "@/features/listings/contexts/listing-form-context"

export function FormActions() {
  const { mode, isSaving, isFormValid, isDirty, handleCancel } = useListingFormContext()

  const isDisabled = mode === "edit" ? (isSaving || !isFormValid || !isDirty) : (isSaving || !isFormValid)

  return (
    <div className="flex flex-col gap-4">
      <Button type="submit" disabled={isDisabled} size="lg">
        {isSaving
          ? (mode === "create" ? BUTTON_TEXT.create.loading : BUTTON_TEXT.edit.loading)
          : (mode === "create" ? BUTTON_TEXT.create.default : BUTTON_TEXT.edit.default)}
      </Button>
      <Button type="button" variant="secondary" size="lg" onClick={handleCancel} disabled={isSaving}>
        {BUTTON_TEXT.cancel}
      </Button>
    </div>
  )
}
