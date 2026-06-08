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
    <div className="p-3 sm:p-6">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="container mx-auto max-w-2xl rounded-4xl p-12 gap-0">
          <DialogHeader className="flex">
            <DialogTitle className="flex items-center gap-2 text-accent">
              <AlertTriangle className="h-5 w-5 text-accent" />
              Delete Conversation?
            </DialogTitle>
            <DialogDescription className="text-sm tracking-wide">
              This action cannot be undone. The conversation and all its messages will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 bg-transparent border-none">
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
    </div>
  )
}
