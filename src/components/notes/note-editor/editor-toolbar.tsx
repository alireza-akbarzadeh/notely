"use client";

import {
  ArrowLeft,
  Bold,
  CheckSquare,
  Code2,
  Heading1,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  ListTodo,
  Paperclip,
  Quote,
  Redo2,
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
import { NoteShareTrigger } from "@/components/notes/note-share-panel";
import { EDITOR_FONTS, type EditorFontOption } from "@/lib/editor-fonts";
import { cn } from "@/lib/utils";

import { TOOLBAR_BTN, TOOLBAR_BTN_ACTIVE } from "./constants";
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
  onOpenChecklist: () => void;
  onOpenResources: () => void;
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
  onOpenChecklist,
  onOpenResources,
}: EditorToolbarProps) {
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
          <NoteShareTrigger
            canShare={canShare}
            open={shareOpen}
            onOpenChange={onShareOpenChange}
            className={cn(TOOLBAR_BTN, "hidden shrink-0 sm:inline-flex")}
          />
          {canShare ? (
            <FormatButton onClick={onToggleFavorite} label="Toggle favorite">
              <Star
                className={`size-3.5 ${isFavorite ? "fill-primary text-primary" : ""}`}
              />
            </FormatButton>
          ) : null}
          {canShare ? (
            <FormatButton
              onClick={onDelete}
              label="Delete note"
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
    </header>
  );
}
