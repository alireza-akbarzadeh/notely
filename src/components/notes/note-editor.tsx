"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bold,
  CheckSquare,
  Code2,
  Heading1,
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
import { NoteChecklist } from "@/components/notes/note-checklist";
import { NoteResources } from "@/components/notes/note-resources";
import {
  NoteSharePanel,
  NoteShareTrigger,
} from "@/components/notes/note-share-panel";
import {
  EDITOR_FONTS,
  ensureEditorFontLoaded,
  getEditorFont,
  type EditorFontOption,
} from "@/lib/editor-fonts";
import { cn } from "@/lib/utils";
import type { NoteSummary, NoteTag } from "@/types/notes";

const EDITOR_FONT_STORAGE_KEY = "notely-editor-font";

type NoteEditorProps = {
  note: NoteSummary;
  allTags: NoteTag[];
};

type DraftSnapshot = {
  title: string;
  content: string;
  tagIds: string[];
};

function sameTagIds(a: string[], b: string[]) {
  return a.length === b.length && a.every((id) => b.includes(id));
}

function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function toEditorHtml(value: string) {
  if (!value) return "";
  if (looksLikeHtml(value)) return value;
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

function normalizeEditorHtml(html: string) {
  const cleaned = html.replace(/^(<br\s*\/?>|\s|&nbsp;)+$/i, "").trim();
  return cleaned === "<br>" || cleaned === "<div><br></div>" ? "" : html;
}

function wordStats(html: string) {
  const text = stripHtml(html);
  const words = text ? text.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return { words, minutes };
}

function formatEditedAt(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;
  return value.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function NoteEditor({ note, allTags }: NoteEditorProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const canEdit = note.accessRole !== "viewer";
  const canShare = note.accessRole === "owner";
  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tagIds, setTagIds] = useState(note.tags.map((tag) => tag.id));
  const [shareOpen, setShareOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [linkText, setLinkText] = useState("");
  const [editorFont, setEditorFont] = useState<EditorFontOption>(EDITOR_FONTS[0]!);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const savedRef = useRef<DraftSnapshot>({
    title: note.title,
    content: note.content,
    tagIds: note.tags.map((tag) => tag.id),
  });
  const draftRef = useRef<DraftSnapshot>(savedRef.current);

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem(EDITOR_FONT_STORAGE_KEY)
        : null;
    const font = getEditorFont(stored);
    ensureEditorFontLoaded(font);
    setEditorFont(font);
  }, []);

  useEffect(() => {
    const next: DraftSnapshot = {
      title: note.title,
      content: note.content,
      tagIds: note.tags.map((tag) => tag.id),
    };
    setTitle(next.title);
    setContent(next.content);
    setTagIds(next.tagIds);
    setShareOpen(false);
    savedRef.current = next;
    draftRef.current = next;
    setStatus("idle");
    if (editorRef.current) {
      editorRef.current.innerHTML = toEditorHtml(next.content);
      editorRef.current.dataset.empty = stripHtml(next.content) ? "false" : "true";
    }
  }, [note.id]);

  useEffect(() => {
    draftRef.current = { title, content, tagIds };
  }, [title, content, tagIds]);

  const saveMutation = useMutation({
    mutationFn: async (payload: {
      title: string;
      content: string;
      tagIds: string[];
      isFavorite?: boolean;
    }) => {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to save");
      return { note: data.note as NoteSummary, payload };
    },
    onMutate: () => setStatus("saving"),
    onSuccess: ({ note: updated, payload }) => {
      savedRef.current = {
        title: payload.title,
        content: payload.content,
        tagIds: payload.tagIds,
      };

      const draft = draftRef.current;
      const draftMatchesSave =
        draft.title === payload.title &&
        draft.content === payload.content &&
        sameTagIds(draft.tagIds, payload.tagIds);

      queryClient.setQueryData(["note", note.id], {
        note: {
          ...updated,
          title: draftMatchesSave ? updated.title : draft.title,
          content: draftMatchesSave ? updated.content : draft.content,
          tags: draftMatchesSave
            ? updated.tags
            : allTags.filter((tag) => draft.tagIds.includes(tag.id)),
        },
      });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setStatus(draftMatchesSave ? "saved" : "saving");
    },
    onError: () => setStatus("error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes");
    },
  });

  useEffect(() => {
    if (!canEdit) return;
    const handle = window.setTimeout(() => {
      const saved = savedRef.current;
      if (
        title === saved.title &&
        content === saved.content &&
        sameTagIds(tagIds, saved.tagIds)
      ) {
        return;
      }
      saveMutation.mutate({
        title: title.trim() || "Untitled",
        content,
        tagIds,
      });
    }, 700);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, tagIds, canEdit]);

  function syncContentFromEditor() {
    const editor = editorRef.current;
    if (!editor) return;
    const html = normalizeEditorHtml(editor.innerHTML);
    editor.dataset.empty = stripHtml(html) ? "false" : "true";
    setContent(html);
  }

  function toggleTag(tagId: string) {
    setTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId],
    );
  }

  function runCommand(command: string, value?: string) {
    if (!canEdit) return;
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand(command, false, value);
    syncContentFromEditor();
  }

  function saveSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      savedSelectionRef.current = null;
      return;
    }
    const range = selection.getRangeAt(0);
    const editor = editorRef.current;
    if (!editor || !editor.contains(range.commonAncestorContainer)) {
      savedSelectionRef.current = null;
      return;
    }
    savedSelectionRef.current = range.cloneRange();
  }

  function restoreSelection() {
    const editor = editorRef.current;
    const range = savedSelectionRef.current;
    if (!editor || !range) return false;
    editor.focus();
    const selection = window.getSelection();
    if (!selection) return false;
    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  }

  function openLinkDialog() {
    if (!canEdit) return;
    saveSelection();
    const selected = savedSelectionRef.current?.toString() ?? "";
    setLinkText(selected);
    setLinkUrl("https://");
    setLinkOpen(true);
  }

  function applyLinkFromDialog() {
    if (!canEdit) return;
    const url = linkUrl.trim();
    if (!url) return;

    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();

    const restored = restoreSelection();
    const selected = window.getSelection()?.toString() ?? "";

    if (!restored || !selected) {
      const label = linkText.trim() || url;
      document.execCommand(
        "insertHTML",
        false,
        `<a href="${url.replace(/"/g, "&quot;")}" target="_blank" rel="noopener noreferrer">${label}</a>`,
      );
    } else {
      document.execCommand("createLink", false, url);
    }

    syncContentFromEditor();
    setLinkOpen(false);
    savedSelectionRef.current = null;
  }

  function applyCode() {
    if (!canEdit) return;
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const selected = range.toString() || "code";
    const code = document.createElement("code");
    code.textContent = selected;
    range.deleteContents();
    range.insertNode(code);
    selection.removeAllRanges();
    const next = document.createRange();
    next.selectNodeContents(code);
    selection.addRange(next);
    syncContentFromEditor();
  }

  function insertChecklistItem() {
    if (!canEdit) return;
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand(
      "insertHTML",
      false,
      '<div>☐&nbsp;</div>',
    );
    syncContentFromEditor();
  }

  const stats = useMemo(() => wordStats(content), [content]);
  const selectedTags = allTags.filter((tag) => tagIds.includes(tag.id));
  const statusLabel =
    status === "saving"
      ? "Saving…"
      : status === "saved"
        ? "Edited just now"
        : status === "error"
          ? "Couldn’t save"
          : canEdit
            ? "Edited just now"
            : "View only";

  const toolbarBtn =
    "size-8 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40";

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <div className="flex h-12 shrink-0 items-center gap-0.5 border-b border-border px-2 md:px-4">
        <Button
          variant="ghost"
          size="icon"
          className={cn(toolbarBtn, "md:hidden")}
          onClick={() => router.push("/notes")}
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
              ensureEditorFontLoaded(font);
              setEditorFont(font);
              window.localStorage.setItem(EDITOR_FONT_STORAGE_KEY, font.value);
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
            className="h-8 gap-1 px-2 text-xs text-muted-foreground"
            disabled={!canEdit}
            onClick={() => runCommand("formatBlock", "h1")}
          >
            <Heading1 className="size-3.5" />
            H1
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={toolbarBtn}
            disabled={!canEdit}
            onClick={() => runCommand("bold")}
            aria-label="Bold"
            title="Bold (Ctrl+B)"
          >
            <Bold className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={toolbarBtn}
            disabled={!canEdit}
            onClick={() => runCommand("italic")}
            aria-label="Italic"
            title="Italic (Ctrl+I)"
          >
            <Italic className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={toolbarBtn}
            disabled={!canEdit}
            onClick={() => runCommand("underline")}
            aria-label="Underline"
            title="Underline (Ctrl+U)"
          >
            <Underline className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={toolbarBtn}
            disabled={!canEdit}
            onClick={() => runCommand("strikeThrough")}
            aria-label="Strikethrough"
          >
            <Strikethrough className="size-3.5" />
          </Button>
          <span className="mx-1 hidden h-4 w-px bg-border sm:block" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={toolbarBtn}
            disabled={!canEdit}
            onClick={() => runCommand("insertUnorderedList")}
            aria-label="Bullet list"
          >
            <List className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={toolbarBtn}
            disabled={!canEdit}
            onClick={() => runCommand("insertOrderedList")}
            aria-label="Numbered list"
          >
            <ListOrdered className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={toolbarBtn}
            disabled={!canEdit}
            onClick={insertChecklistItem}
            aria-label="Checklist"
          >
            <CheckSquare className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={toolbarBtn}
            disabled={!canEdit}
            onClick={openLinkDialog}
            aria-label="Link"
          >
            <Link2 className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={toolbarBtn}
            disabled={!canEdit}
            onClick={() => runCommand("formatBlock", "blockquote")}
            aria-label="Quote"
          >
            <Quote className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={toolbarBtn}
            disabled={!canEdit}
            onClick={applyCode}
            aria-label="Code"
          >
            <Code2 className="size-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={toolbarBtn}
            disabled={!canEdit}
            onClick={() => runCommand("undo")}
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={toolbarBtn}
            disabled={!canEdit}
            onClick={() => runCommand("redo")}
            aria-label="Redo"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="size-3.5" />
          </Button>
          <NoteShareTrigger
            canShare={canShare}
            open={shareOpen}
            onOpenChange={setShareOpen}
            className={toolbarBtn}
          />
          {canShare ? (
            <Button
              variant="ghost"
              size="icon"
              className={toolbarBtn}
              onClick={() =>
                saveMutation.mutate({
                  title: title.trim() || "Untitled",
                  content,
                  tagIds,
                  isFavorite: !note.isFavorite,
                })
              }
              aria-label="Toggle favorite"
            >
              <Star
                className={`size-3.5 ${note.isFavorite ? "fill-primary text-primary" : ""}`}
              />
            </Button>
          ) : null}
          {canShare ? (
            <Button
              variant="ghost"
              size="icon"
              className={toolbarBtn}
              onClick={() => {
                if (window.confirm("Delete this note?")) deleteMutation.mutate();
              }}
              aria-label="Delete note"
            >
              <Trash2 className="size-3.5" />
            </Button>
          ) : null}
        </div>
      </div>

      <NoteSharePanel
        noteId={note.id}
        canShare={canShare}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />

      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add link</DialogTitle>
            <DialogDescription>
              Paste a URL. If nothing is selected in the note, optional link
              text will be inserted.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-1">
            <div className="grid gap-1.5">
              <Label htmlFor="note-link-url">URL</Label>
              <Input
                id="note-link-url"
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                placeholder="https://example.com"
                autoFocus
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyLinkFromDialog();
                  }
                }}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="note-link-text">Text (optional)</Label>
              <Input
                id="note-link-text"
                value={linkText}
                onChange={(event) => setLinkText(event.target.value)}
                placeholder="Display text"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLinkOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={applyLinkFromDialog}
              disabled={!linkUrl.trim()}
            >
              Insert link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div
        className="prose-note min-h-0 flex-1 overflow-y-auto px-5 py-8 pb-[calc(6rem+env(safe-area-inset-bottom))] scrollbar-thin md:px-12 md:pb-8 lg:px-16"
        style={{ fontFamily: editorFont.family }}
      >
        <div className="mx-auto max-w-2xl">
          {selectedTags.length > 0 || (allTags.length > 0 && canShare) ? (
            <div className="mb-4 flex flex-wrap gap-2">
              {(canShare ? allTags : selectedTags).map((tag) => {
                const selected = tagIds.includes(tag.id);
                if (!canShare && !selected) return null;
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => canShare && toggleTag(tag.id)}
                    disabled={!canShare}
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                      selected
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border bg-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    #{tag.name}
                  </button>
                );
              })}
            </div>
          ) : null}

          <Input
            value={title}
            readOnly={!canEdit}
            onChange={(event) => setTitle(event.target.value)}
            className="mb-2 h-auto border-0 bg-transparent px-0 text-3xl font-semibold leading-tight tracking-tight text-foreground shadow-none focus-visible:ring-0 md:text-[2.35rem]"
            style={{ fontFamily: editorFont.family }}
            placeholder="Untitled"
          />

          <p className="mb-8 text-xs text-muted-foreground">
            {formatEditedAt(note.updatedAt)}
            {note.isShared ? ` · Shared · ${note.accessRole ?? "editor"}` : ""}
          </p>

          <div
            ref={editorRef}
            role="textbox"
            aria-multiline="true"
            aria-label="Note content"
            contentEditable={canEdit}
            suppressContentEditableWarning
            onInput={syncContentFromEditor}
            onBlur={syncContentFromEditor}
            data-placeholder="Start writing…"
            className={cn(
              "note-rich-editor mb-10 min-h-[42vh] w-full text-[16px] leading-7 text-foreground/90 outline-none",
              !canEdit && "opacity-90",
            )}
            style={{ fontFamily: editorFont.family }}
            data-empty={stripHtml(note.content) ? "false" : "true"}
          />

          <div className="font-sans">
            <NoteChecklist noteId={note.id} canEdit={canEdit} />
            <NoteResources noteId={note.id} canEdit={canEdit} />
          </div>
        </div>
      </div>

      <div className="hidden h-10 shrink-0 items-center justify-between border-t border-border px-6 text-[11px] text-muted-foreground md:flex">
        <p>
          {stats.words.toLocaleString()} words
          <span className="mx-2 text-border">·</span>
          {stats.minutes} min read
        </p>
        <p>{statusLabel}</p>
      </div>
    </div>
  );
}
