"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Check, X } from "lucide-react"

interface DeleteConversationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

export function DeleteConversationDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeleteConversationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-1.5rem)] sm:max-w-lg rounded-4xl p-6 ring-0">
        <DialogHeader className="flex">
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Delete Conversation?
          </DialogTitle>
          <DialogDescription className="text-sm tracking-wide">
            This action cannot be undone. The conversation and all its messages will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-6 bg-transparent">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="flex-1"
          >
            <X />Cancel
          </Button>
          <Button
            variant="accent"
            size="lg"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1"
          >
            <Check />{isPending ? "Deleting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
