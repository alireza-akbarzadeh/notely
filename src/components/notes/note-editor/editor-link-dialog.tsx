"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditorLinkDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkUrl: string;
  linkText: string;
  onLinkUrlChange: (value: string) => void;
  onLinkTextChange: (value: string) => void;
  onApply: () => void;
};

export function EditorLinkDialog({
  open,
  onOpenChange,
  linkUrl,
  linkText,
  onLinkUrlChange,
  onLinkTextChange,
  onApply,
}: EditorLinkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add link</DialogTitle>
          <DialogDescription>
            Paste a URL. If nothing is selected in the note, optional link text
            will be inserted.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-1">
          <div className="grid gap-1.5">
            <Label htmlFor="note-link-url">URL</Label>
            <Input
              id="note-link-url"
              value={linkUrl}
              onChange={(event) => onLinkUrlChange(event.target.value)}
              placeholder="https://example.com"
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onApply();
                }
              }}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="note-link-text">Text (optional)</Label>
            <Input
              id="note-link-text"
              value={linkText}
              onChange={(event) => onLinkTextChange(event.target.value)}
              placeholder="Display text"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onApply} disabled={!linkUrl.trim()}>
            Insert link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
