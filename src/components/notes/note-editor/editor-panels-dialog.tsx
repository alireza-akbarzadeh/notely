"use client";

import { NoteChecklist } from "@/components/notes/note-checklist";
import { NoteResources } from "@/components/notes/note-resources";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type EditorPanelsDialogProps = {
  noteId: string;
  canEdit: boolean;
  checklistOpen: boolean;
  resourcesOpen: boolean;
  onChecklistOpenChange: (open: boolean) => void;
  onResourcesOpenChange: (open: boolean) => void;
};

export function EditorPanelsDialog({
  noteId,
  canEdit,
  checklistOpen,
  resourcesOpen,
  onChecklistOpenChange,
  onResourcesOpenChange,
}: EditorPanelsDialogProps) {
  return (
    <>
      <Dialog open={checklistOpen} onOpenChange={onChecklistOpenChange}>
        <DialogContent className="flex max-h-[85dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="shrink-0 border-b border-border px-4 py-3">
            <DialogTitle>Checklist</DialogTitle>
            <DialogDescription>
              Tasks for this note. Mark them done as you go.
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto p-4 scrollbar-thin">
            <NoteChecklist noteId={noteId} canEdit={canEdit} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={resourcesOpen} onOpenChange={onResourcesOpenChange}>
        <DialogContent className="flex max-h-[85dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="shrink-0 border-b border-border px-4 py-3">
            <DialogTitle>Resources</DialogTitle>
            <DialogDescription>
              Files and links attached to this note.
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto p-4 scrollbar-thin">
            <NoteResources noteId={noteId} canEdit={canEdit} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
