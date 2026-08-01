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
};

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
}: EditorToolbarProps) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-0.5 border-b border-border px-2 md:px-4">
      <Button
        variant="ghost"
        size="icon"
        className={cn(TOOLBAR_BTN, "md:hidden")}
        onClick={onBack}
        aria-label="Back to notes"
      >
        <ArrowLeft className="size-4" />
      </Button>

      <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto scrollbar-thin">
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
          <ComboboxInputGroup className="h-8 w-[9.5rem] shrink-0">
            <Type className="ml-2 size-3.5 shrink-0 text-muted-foreground" />
            <ComboboxInput
              placeholder="Font"
              disabled={!canEdit}
              className="pl-1.5"
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

        <span className="mx-1 hidden h-4 w-px bg-border sm:block" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 gap-1 px-2 text-xs",
            activeFormats.h1
              ? TOOLBAR_BTN_ACTIVE
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
          disabled={!canEdit}
          onClick={() => onToggleBlock("h1")}
          aria-pressed={activeFormats.h1}
        >
          <Heading1 className="size-3.5" />
          H1
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 gap-1 px-2 text-xs",
            activeFormats.h2
              ? TOOLBAR_BTN_ACTIVE
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
          disabled={!canEdit}
          onClick={() => onToggleBlock("h2")}
          aria-pressed={activeFormats.h2}
        >
          <Heading2 className="size-3.5" />
          H2
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(TOOLBAR_BTN, activeFormats.bold && TOOLBAR_BTN_ACTIVE)}
          disabled={!canEdit}
          onClick={() => onInlineCommand("bold")}
          aria-label="Bold"
          aria-pressed={activeFormats.bold}
          title="Bold (Ctrl+B)"
        >
          <Bold className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(TOOLBAR_BTN, activeFormats.italic && TOOLBAR_BTN_ACTIVE)}
          disabled={!canEdit}
          onClick={() => onInlineCommand("italic")}
          aria-label="Italic"
          aria-pressed={activeFormats.italic}
          title="Italic (Ctrl+I)"
        >
          <Italic className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            TOOLBAR_BTN,
            activeFormats.underline && TOOLBAR_BTN_ACTIVE,
          )}
          disabled={!canEdit}
          onClick={() => onInlineCommand("underline")}
          aria-label="Underline"
          aria-pressed={activeFormats.underline}
          title="Underline (Ctrl+U)"
        >
          <Underline className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            TOOLBAR_BTN,
            activeFormats.strikeThrough && TOOLBAR_BTN_ACTIVE,
          )}
          disabled={!canEdit}
          onClick={() => onInlineCommand("strikeThrough")}
          aria-label="Strikethrough"
          aria-pressed={activeFormats.strikeThrough}
        >
          <Strikethrough className="size-3.5" />
        </Button>
        <span className="mx-1 hidden h-4 w-px bg-border sm:block" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            TOOLBAR_BTN,
            activeFormats.unorderedList && TOOLBAR_BTN_ACTIVE,
          )}
          disabled={!canEdit}
          onClick={() => onRunCommand("insertUnorderedList")}
          aria-label="Bullet list"
          aria-pressed={activeFormats.unorderedList}
        >
          <List className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            TOOLBAR_BTN,
            activeFormats.orderedList && TOOLBAR_BTN_ACTIVE,
          )}
          disabled={!canEdit}
          onClick={() => onRunCommand("insertOrderedList")}
          aria-label="Numbered list"
          aria-pressed={activeFormats.orderedList}
        >
          <ListOrdered className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={TOOLBAR_BTN}
          disabled={!canEdit}
          onClick={onInsertChecklist}
          aria-label="Checklist"
        >
          <CheckSquare className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(TOOLBAR_BTN, activeFormats.link && TOOLBAR_BTN_ACTIVE)}
          disabled={!canEdit}
          onClick={onOpenLink}
          aria-label="Link"
          aria-pressed={activeFormats.link}
        >
          <Link2 className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            TOOLBAR_BTN,
            activeFormats.blockquote && TOOLBAR_BTN_ACTIVE,
          )}
          disabled={!canEdit}
          onClick={() => onToggleBlock("blockquote")}
          aria-label="Quote"
          aria-pressed={activeFormats.blockquote}
        >
          <Quote className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(TOOLBAR_BTN, activeFormats.code && TOOLBAR_BTN_ACTIVE)}
          disabled={!canEdit}
          onClick={onToggleCode}
          aria-label="Code"
          aria-pressed={activeFormats.code}
          title="Toggle inline code"
        >
          <Code2 className="size-3.5" />
        </Button>
      </div>

      <div className="flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={TOOLBAR_BTN}
          disabled={!canEdit}
          onClick={() => onRunCommand("undo")}
          aria-label="Undo"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={TOOLBAR_BTN}
          disabled={!canEdit}
          onClick={() => onRunCommand("redo")}
          aria-label="Redo"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="size-3.5" />
        </Button>
        <NoteShareTrigger
          canShare={canShare}
          open={shareOpen}
          onOpenChange={onShareOpenChange}
          className={TOOLBAR_BTN}
        />
        {canShare ? (
          <Button
            variant="ghost"
            size="icon"
            className={TOOLBAR_BTN}
            onClick={onToggleFavorite}
            aria-label="Toggle favorite"
          >
            <Star
              className={`size-3.5 ${isFavorite ? "fill-primary text-primary" : ""}`}
            />
          </Button>
        ) : null}
        {canShare ? (
          <Button
            variant="ghost"
            size="icon"
            className={TOOLBAR_BTN}
            onClick={onDelete}
            aria-label="Delete note"
          >
            <Trash2 className="size-3.5" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
