import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DIALOG_TEXT, BUTTON_TEXT } from "@/lib/constants/form"
import { Check, Edit, Pencil } from "lucide-react"

interface UnsavedChangesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  onConfirm,
}: UnsavedChangesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl italic tracking-tighter">{DIALOG_TEXT.unsavedChanges.title}</DialogTitle>
          <DialogDescription>
            {DIALOG_TEXT.unsavedChanges.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" size="lg" onClick={() => onOpenChange(false)}>
            <Edit />{BUTTON_TEXT.keepEditing}
          </Button>
          <Button variant="accent" size="lg" onClick={onConfirm}>
            <Check />{BUTTON_TEXT.discardChanges}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
