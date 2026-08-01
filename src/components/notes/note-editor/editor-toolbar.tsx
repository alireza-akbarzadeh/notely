"use client";

import { useRef, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Bold,
  CheckSquare,
  Code2,
  Heading1,
  Heading2,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  ListTodo,
  LoaderCircle,
  Paperclip,
  PenLine,
  Quote,
  Redo2,
  RotateCcw,
  Sparkles,
  Star,
  Strikethrough,
  Trash2,
  Type,
  Underline,
  Undo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { NoteShareTrigger } from "@/components/notes/note-share-panel";
import { EDITOR_FONTS, type EditorFontOption } from "@/lib/editor-fonts";
import { cn } from "@/lib/utils";

import { TEXT_COLORS, TOOLBAR_BTN, TOOLBAR_BTN_ACTIVE } from "./constants";
import type { ActiveFormats, BlockTag } from "./types";

type EditorToolbarProps = {
  canEdit: boolean;
  canShare: boolean;
  editorFont: EditorFontOption;
  onSelectFont: (font: EditorFontOption) => void;
  activeFormats: ActiveFormats;
  shareOpen: boolean;
  onShareOpenChange: (open: boolean) => void;
  isFavorite: boolean;
  onBack: () => void;
  onToggleBlock: (tag: BlockTag) => void;
  onInlineCommand: (command: string) => void;
  onRunCommand: (command: string) => void;
  onInsertChecklist: () => void;
  onOpenLink: () => void;
  onToggleCode: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
  onRestore?: () => void;
  isTrashed?: boolean;
  onOpenChecklist: () => void;
  onOpenResources: () => void;
  onOpenAi: () => void;
  onOpenReminder: () => void;
  onPrepareTextColor: () => void;
  onApplyTextColor: (color: string | null) => void;
  onPrepareInlineImage: () => void;
  onInsertInlineImage: (file: File) => Promise<void>;
  inlineImageUploading: boolean;
};

function FormatButton({
  active,
  disabled,
  onClick,
  label,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(TOOLBAR_BTN, "shrink-0", active && TOOLBAR_BTN_ACTIVE)}
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={title ?? label}
    >
      {children}
    </Button>
  );
}

export function EditorToolbar({
  canEdit,
  canShare,
  editorFont,
  onSelectFont,
  activeFormats,
  shareOpen,
  onShareOpenChange,
  isFavorite,
  onBack,
  onToggleBlock,
  onInlineCommand,
  onRunCommand,
  onInsertChecklist,
  onOpenLink,
  onToggleCode,
  onToggleFavorite,
  onDelete,
  onRestore,
  isTrashed = false,
  onOpenChecklist,
  onOpenResources,
  onOpenAi,
  onOpenReminder,
  onPrepareTextColor,
  onApplyTextColor,
  onPrepareInlineImage,
  onInsertInlineImage,
  inlineImageUploading,
}: EditorToolbarProps) {
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 shrink-0 border-b border-border",
        "bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80",
        "pt-[env(safe-area-inset-top)]",
      )}
    >
      {/* Top row: navigation + font + actions */}
      <div className="flex h-11 items-center gap-1 px-2 md:h-12 md:px-4">
        <Button
          variant="ghost"
          size="icon"
          className={cn(TOOLBAR_BTN, "shrink-0 md:hidden")}
          onClick={onBack}
          aria-label="Back to notes"
        >
          <ArrowLeft className="size-4" />
        </Button>

        <Combobox
          items={EDITOR_FONTS}
          value={editorFont}
          onValueChange={(font) => {
            if (!font) return;
            onSelectFont(font);
          }}
          itemToStringLabel={(font) => font.label}
          isItemEqualToValue={(a, b) => a.value === b.value}
        >
          <ComboboxInputGroup className="h-8 min-w-0 flex-1 sm:max-w-[11rem] md:flex-none md:w-[9.5rem]">
            <Type className="ml-2 size-3.5 shrink-0 text-muted-foreground" />
            <ComboboxInput
              placeholder="Font"
              disabled={!canEdit}
              className="min-w-0 pl-1.5"
              aria-label="Editor font"
            />
            <ComboboxTrigger disabled={!canEdit} />
          </ComboboxInputGroup>
          <ComboboxContent className="min-w-[14rem]" align="start">
            <ComboboxEmpty>No fonts found.</ComboboxEmpty>
            <ComboboxList>
              {(font: EditorFontOption) => (
                <ComboboxItem key={font.value} value={font}>
                  <span style={{ fontFamily: font.family }}>{font.label}</span>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <div className="ml-auto flex shrink-0 items-center gap-0.5">
          <FormatButton
            onClick={onOpenChecklist}
            label="Checklist"
            title="Open checklist"
          >
            <ListTodo className="size-3.5" />
          </FormatButton>
          <FormatButton
            onClick={onOpenResources}
            label="Resources"
            title="Open resources"
          >
            <Paperclip className="size-3.5" />
          </FormatButton>
          {!isTrashed ? (
            <FormatButton
              onClick={onOpenReminder}
              label="Remind me"
              title="Set a reminder for this note"
            >
              <Bell className="size-3.5" />
            </FormatButton>
          ) : null}
          <FormatButton
            onClick={onOpenAi}
            label="Ask AI"
            title="Ask Gemini about this note"
          >
            <Sparkles className="size-3.5" />
          </FormatButton>
          <span className="mx-0.5 hidden h-4 w-px bg-border sm:block" />
          <div className="hidden items-center gap-0.5 sm:flex">
            <FormatButton
              disabled={!canEdit}
              onClick={() => onRunCommand("undo")}
              label="Undo"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="size-3.5" />
            </FormatButton>
            <FormatButton
              disabled={!canEdit}
              onClick={() => onRunCommand("redo")}
              label="Redo"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="size-3.5" />
            </FormatButton>
          </div>
          {!isTrashed ? (
            <NoteShareTrigger
              canShare={canShare}
              open={shareOpen}
              onOpenChange={onShareOpenChange}
              className={cn(TOOLBAR_BTN, "hidden shrink-0 sm:inline-flex")}
            />
          ) : null}
          {canShare && !isTrashed ? (
            <FormatButton onClick={onToggleFavorite} label="Toggle favorite">
              <Star
                className={`size-3.5 ${isFavorite ? "fill-primary text-primary" : ""}`}
              />
            </FormatButton>
          ) : null}
          {isTrashed && onRestore ? (
            <FormatButton onClick={onRestore} label="Restore note" title="Restore from Trash">
              <RotateCcw className="size-3.5" />
            </FormatButton>
          ) : null}
          {canShare || isTrashed ? (
            <FormatButton
              onClick={onDelete}
              label={isTrashed ? "Delete forever" : "Move to Trash"}
              title={isTrashed ? "Delete forever" : "Move to Trash"}
            >
              <Trash2 className="size-3.5" />
            </FormatButton>
          ) : null}
        </div>
      </div>

      {/* Format row: scrolls horizontally on small screens */}
      <div className="border-t border-border/60 md:border-t-0">
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x scrollbar-thin [-webkit-overflow-scrolling:touch]">
          <div className="flex w-max items-center gap-0.5 px-2 py-1.5 md:px-4 md:pt-0 md:pb-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 shrink-0 gap-1 px-2 text-xs",
                activeFormats.h1
                  ? TOOLBAR_BTN_ACTIVE
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
              disabled={!canEdit}
              onClick={() => onToggleBlock("h1")}
              aria-pressed={activeFormats.h1}
              aria-label="Heading 1"
            >
              <Heading1 className="size-3.5" />
              <span className="sr-only sm:not-sr-only">H1</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 shrink-0 gap-1 px-2 text-xs",
                activeFormats.h2
                  ? TOOLBAR_BTN_ACTIVE
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
              disabled={!canEdit}
              onClick={() => onToggleBlock("h2")}
              aria-pressed={activeFormats.h2}
              aria-label="Heading 2"
            >
              <Heading2 className="size-3.5" />
              <span className="sr-only sm:not-sr-only">H2</span>
            </Button>

            <span className="mx-0.5 h-4 w-px shrink-0 bg-border" />

            <FormatButton
              active={activeFormats.bold}
              disabled={!canEdit}
              onClick={() => onInlineCommand("bold")}
              label="Bold"
              title="Bold (Ctrl+B)"
            >
              <Bold className="size-3.5" />
            </FormatButton>
            <FormatButton
              active={activeFormats.italic}
              disabled={!canEdit}
              onClick={() => onInlineCommand("italic")}
              label="Italic"
              title="Italic (Ctrl+I)"
            >
              <Italic className="size-3.5" />
            </FormatButton>
            <FormatButton
              active={activeFormats.underline}
              disabled={!canEdit}
              onClick={() => onInlineCommand("underline")}
              label="Underline"
              title="Underline (Ctrl+U)"
            >
              <Underline className="size-3.5" />
            </FormatButton>
            <FormatButton
              active={activeFormats.strikeThrough}
              disabled={!canEdit}
              onClick={() => onInlineCommand("strikeThrough")}
              label="Strikethrough"
            >
              <Strikethrough className="size-3.5" />
            </FormatButton>

            <DropdownMenu
              open={colorMenuOpen}
              onOpenChange={(open) => {
                setColorMenuOpen(open);
                if (open) onPrepareTextColor();
              }}
            >
              <DropdownMenuTrigger
                disabled={!canEdit}
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      TOOLBAR_BTN,
                      "relative shrink-0",
                      activeFormats.color && TOOLBAR_BTN_ACTIVE,
                    )}
                    disabled={!canEdit}
                    aria-label="Text color"
                    title="Text color"
                  >
                    <PenLine className="size-3.5" />
                    <span
                      className="absolute bottom-1 left-1/2 h-0.5 w-3.5 -translate-x-1/2 rounded-full"
                      style={{
                        backgroundColor: activeFormats.color ?? "currentColor",
                      }}
                      aria-hidden
                    />
                  </Button>
                }
              />
              <DropdownMenuContent
                align="start"
                className="w-auto min-w-0 p-2"
              >
                <DropdownMenuLabel className="px-1 pb-1.5 pt-0">
                  Text color
                </DropdownMenuLabel>
                <div className="grid grid-cols-5 gap-1.5">
                  {TEXT_COLORS.map((swatch) => {
                    const isActive =
                      swatch.value === null
                        ? activeFormats.color === null
                        : activeFormats.color === swatch.value;
                    return (
                      <button
                        key={swatch.label}
                        type="button"
                        title={swatch.label}
                        aria-label={swatch.label}
                        aria-pressed={isActive}
                        className={cn(
                          "size-7 rounded-md ring-1 ring-border/80 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isActive && "ring-2 ring-primary",
                          swatch.value === null &&
                            "bg-[linear-gradient(135deg,#f4f4f5_50%,#18181b_50%)]",
                        )}
                        style={
                          swatch.value
                            ? { backgroundColor: swatch.value }
                            : undefined
                        }
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          onApplyTextColor(swatch.value);
                          setColorMenuOpen(false);
                        }}
                      />
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="mx-0.5 h-4 w-px shrink-0 bg-border" />

            <FormatButton
              active={activeFormats.unorderedList}
              disabled={!canEdit}
              onClick={() => onRunCommand("insertUnorderedList")}
              label="Bullet list"
            >
              <List className="size-3.5" />
            </FormatButton>
            <FormatButton
              active={activeFormats.orderedList}
              disabled={!canEdit}
              onClick={() => onRunCommand("insertOrderedList")}
              label="Numbered list"
            >
              <ListOrdered className="size-3.5" />
            </FormatButton>
            <FormatButton
              disabled={!canEdit}
              onClick={onInsertChecklist}
              label="Checklist"
            >
              <CheckSquare className="size-3.5" />
            </FormatButton>
            <FormatButton
              active={activeFormats.link}
              disabled={!canEdit}
              onClick={onOpenLink}
              label="Link"
            >
              <Link2 className="size-3.5" />
            </FormatButton>
            <FormatButton
              disabled={!canEdit || inlineImageUploading}
              onClick={() => {
                onPrepareInlineImage();
                imageInputRef.current?.click();
              }}
              label="Insert image"
              title="Upload image at cursor"
            >
              {inlineImageUploading ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <ImagePlus className="size-3.5" />
              )}
            </FormatButton>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                void onInsertInlineImage(file).catch((error) => {
                  setUploadError(
                    error instanceof Error
                      ? error.message
                      : "Image upload failed",
                  );
                });
              }}
            />
            <FormatButton
              active={activeFormats.blockquote}
              disabled={!canEdit}
              onClick={() => onToggleBlock("blockquote")}
              label="Quote"
            >
              <Quote className="size-3.5" />
            </FormatButton>
            <FormatButton
              active={activeFormats.code}
              disabled={!canEdit}
              onClick={onToggleCode}
              label="Code"
              title="Toggle inline code"
            >
              <Code2 className="size-3.5" />
            </FormatButton>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(uploadError)}
        onOpenChange={(open) => {
          if (!open) setUploadError(null);
        }}
        title="Image upload failed"
        description={uploadError ?? "Could not upload the image."}
        confirmLabel="OK"
        cancelLabel="Close"
        onConfirm={() => setUploadError(null)}
      />
    </header>
  );
}
