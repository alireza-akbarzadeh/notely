"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type NoteDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteTitle: string;
  permanent?: boolean;
  pending?: boolean;
  onConfirm: () => void;
};

export function NoteDeleteDialog({
  open,
  onOpenChange,
  noteTitle,
  permanent = false,
  pending = false,
  onConfirm,
}: NoteDeleteDialogProps) {
  const title = noteTitle.trim() || "Untitled";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {permanent ? "Delete forever?" : "Move to Trash?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {permanent
              ? `“${title}” will be permanently deleted. This cannot be undone.`
              : `“${title}” will be moved to Trash. You can restore it later.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={onConfirm}
          >
            {pending
              ? permanent
                ? "Deleting…"
                : "Moving…"
              : permanent
                ? "Delete forever"
                : "Move to Trash"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
