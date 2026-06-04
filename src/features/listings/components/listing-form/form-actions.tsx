import { Button } from "@/components/ui/button"
import { BUTTON_TEXT } from "@/lib/constants/form"

interface FormActionsProps {
  mode: "create" | "edit"
  isSaving: boolean
  isFormValid: boolean
  isDirty?: boolean
  onCancel: () => void
}

export function FormActions({ mode, isSaving, isFormValid, isDirty, onCancel }: FormActionsProps) {
  const isDisabled = mode === "edit" ? (isSaving || !isFormValid || !isDirty) : (isSaving || !isFormValid)
  
  return (
    <div className="flex flex-col gap-4">
      <Button type="submit" disabled={isDisabled} size="lg">
        {isSaving
          ? (mode === "create" ? BUTTON_TEXT.create.loading : BUTTON_TEXT.edit.loading)
          : (mode === "create" ? BUTTON_TEXT.create.default : BUTTON_TEXT.edit.default)}
      </Button>
      <Button type="button" variant="secondary" size="lg" onClick={onCancel} disabled={isSaving}>
        {BUTTON_TEXT.cancel}
      </Button>
    </div>
  )
}
