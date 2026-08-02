"use client";

import type { RefObject } from "react";
import {
  Bold,
  ImagePlus,
  Italic,
  Link2,
  List,
  MoreHorizontal,
  Star,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  insertLink,
  toggleLinePrefix,
  wrapSelection,
} from "@/lib/notes/format-selection";
import { cn } from "@/lib/utils";

type NoteFormatToolbarProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  content: string;
  onContentChange: (value: string) => void;
  canEdit: boolean;
  canShare: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onDelete: () => void;
  className?: string;
};

function applyAndRestore(
  textarea: HTMLTextAreaElement | null,
  content: string,
  onContentChange: (value: string) => void,
  transform: (
    value: string,
    start: number,
    end: number,
  ) => { value: string; selectionStart: number; selectionEnd: number },
) {
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const result = transform(content, start, end);
  onContentChange(result.value);
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
  });
}

export function NoteFormatToolbar({
  textareaRef,
  content,
  onContentChange,
  canEdit,
  canShare,
  isFavorite,
  onToggleFavorite,
  onDelete,
  className,
}: NoteFormatToolbarProps) {
  function run(
    transform: (
      value: string,
      start: number,
      end: number,
    ) => { value: string; selectionStart: number; selectionEnd: number },
  ) {
    if (!canEdit) return;
    applyAndRestore(textareaRef.current, content, onContentChange, transform);
  }

  function handleAttachment() {
    if (!canEdit) return;
    document.getElementById("note-resources")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    window.dispatchEvent(new Event("notely:attach-file"));
  }

  function handleLink() {
    if (!canEdit) return;
    const url = window.prompt("Link URL", "https://");
    if (!url?.trim()) return;
    run((value, start, end) => insertLink(value, start, end, url));
  }

  return (
    <div
      className={cn(
        "flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border px-2 md:px-4",
        className,
      )}
    >
      <div className="flex items-center gap-0.5">
        <ToolbarIcon
          label="Bold"
          disabled={!canEdit}
          onClick={() =>
            run((value, start, end) =>
              wrapSelection(value, start, end, "**", "**", "bold"),
            )
          }
        >
          <Bold className="size-4" />
        </ToolbarIcon>
        <ToolbarIcon
          label="Italic"
          disabled={!canEdit}
          onClick={() =>
            run((value, start, end) =>
              wrapSelection(value, start, end, "*", "*", "italic"),
            )
          }
        >
          <Italic className="size-4" />
        </ToolbarIcon>
        <ToolbarIcon
          label="Bullet list"
          disabled={!canEdit}
          onClick={() =>
            run((value, start, end) =>
              toggleLinePrefix(value, start, end, "- "),
            )
          }
        >
          <List className="size-4" />
        </ToolbarIcon>
        <ToolbarIcon
          label="Attachment"
          disabled={!canEdit}
          onClick={handleAttachment}
        >
          <ImagePlus className="size-4" />
        </ToolbarIcon>
        <ToolbarIcon label="Link" disabled={!canEdit} onClick={handleLink}>
          <Link2 className="size-4" />
        </ToolbarIcon>
      </div>

      <div className="flex items-center gap-0.5">
        {canShare ? (
          <ToolbarIcon
            label="Favorite"
            onClick={onToggleFavorite}
            active={isFavorite}
          >
            <Star
              className={cn(
                "size-4",
                isFavorite && "fill-primary text-primary",
              )}
            />
          </ToolbarIcon>
        ) : null}
        {canShare ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 text-muted-foreground"
                  aria-label="More actions"
                />
              }
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                variant="destructive"
                onClick={onDelete}
              >
                <Trash2 className="size-4" />
                Delete note
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  );
}

function ToolbarIcon({
  children,
  label,
  onClick,
  disabled,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className={cn(
        "size-9 text-muted-foreground hover:text-foreground",
        active && "text-foreground",
      )}
    >
      {children}
    </Button>
  );
}
