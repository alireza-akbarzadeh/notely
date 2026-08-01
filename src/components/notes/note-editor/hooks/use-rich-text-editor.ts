"use client";

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { EMPTY_FORMATS } from "../constants";
import type { ActiveFormats, BlockTag } from "../types";
import type { NoteAttachment } from "@/types/notes";
import {
  decorateEditorLinks,
  escapeHtmlText,
  normalizeCssColor,
  normalizeEditorHtml,
  normalizeLinkUrl,
  stripHtml,
  toEditorHtml,
  unwrapElement,
} from "../utils";

type UseRichTextEditorOptions = {
  noteId: string;
  initialContent: string;
  canEdit: boolean;
  setContent: Dispatch<SetStateAction<string>>;
};

export function useRichTextEditor({
  noteId,
  initialContent,
  canEdit,
  setContent,
}: UseRichTextEditorOptions) {
  const queryClient = useQueryClient();
  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [linkText, setLinkText] = useState("");
  const [inlineImageUploading, setInlineImageUploading] = useState(false);
  const [activeFormats, setActiveFormats] =
    useState<ActiveFormats>(EMPTY_FORMATS);

  useEffect(() => {
    setShareOpen(false);
    if (editorRef.current) {
      editorRef.current.innerHTML = toEditorHtml(initialContent);
      editorRef.current.dataset.empty = stripHtml(initialContent)
        ? "false"
        : "true";
      decorateEditorLinks(editorRef.current);
    }
    // Only reset the DOM when switching notes — not on every draft/save update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  function syncContentFromEditor() {
    const editor = editorRef.current;
    if (!editor) return;
    const html = normalizeEditorHtml(editor.innerHTML);
    editor.dataset.empty = stripHtml(html) ? "false" : "true";
    setContent(html);
  }

  function getSelectionElement(): HTMLElement | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    let node: Node | null = selection.anchorNode;
    if (!node) return null;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    if (!(node instanceof HTMLElement)) return null;
    if (!editorRef.current?.contains(node)) return null;
    return node;
  }

  function refreshActiveFormats() {
    const editor = editorRef.current;
    if (!editor) {
      setActiveFormats(EMPTY_FORMATS);
      return;
    }

    const selection = window.getSelection();
    if (
      !selection ||
      selection.rangeCount === 0 ||
      !editor.contains(selection.anchorNode)
    ) {
      setActiveFormats(EMPTY_FORMATS);
      return;
    }

    const el = getSelectionElement();
    const block = document.queryCommandValue("formatBlock").toLowerCase();
    const foreColor = normalizeCssColor(
      document.queryCommandValue("foreColor") || "",
    );
    const editorDefault = editor
      ? normalizeCssColor(getComputedStyle(editor).color)
      : null;

    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      unorderedList: document.queryCommandState("insertUnorderedList"),
      orderedList: document.queryCommandState("insertOrderedList"),
      link: Boolean(el?.closest("a")),
      code: Boolean(el?.closest("code")),
      h1: block === "h1",
      h2: block === "h2",
      blockquote: block === "blockquote",
      color:
        foreColor && editorDefault && foreColor === editorDefault
          ? null
          : foreColor,
    });
  }

  useEffect(() => {
    const onSelectionChange = () => refreshActiveFormats();
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  function runCommand(command: string, value?: string) {
    if (!canEdit) return;
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand(command, false, value);
    syncContentFromEditor();
    refreshActiveFormats();
  }

  function toggleBlock(tag: BlockTag) {
    if (!canEdit) return;
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const current = document.queryCommandValue("formatBlock").toLowerCase();
    document.execCommand("formatBlock", false, current === tag ? "p" : tag);
    syncContentFromEditor();
    refreshActiveFormats();
  }

  function toggleInlineCommand(command: string) {
    runCommand(command);
  }

  function toggleCode() {
    if (!canEdit) return;
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const el = getSelectionElement();
    const existingCode = el?.closest("code");
    if (existingCode && editor.contains(existingCode)) {
      const parent = existingCode.parentNode;
      if (!parent) return;
      const marker = document.createTextNode("");
      parent.insertBefore(marker, existingCode);
      unwrapElement(existingCode);
      selection.removeAllRanges();
      const after = document.createRange();
      after.setStartAfter(marker);
      after.collapse(true);
      selection.addRange(after);
      marker.remove();
      syncContentFromEditor();
      refreshActiveFormats();
      return;
    }

    const range = selection.getRangeAt(0);
    const selected = range.toString();
    const code = document.createElement("code");
    if (selected) {
      code.textContent = selected;
      range.deleteContents();
      range.insertNode(code);
    } else {
      code.textContent = "code";
      range.insertNode(code);
    }
    selection.removeAllRanges();
    const next = document.createRange();
    next.selectNodeContents(code);
    selection.addRange(next);
    syncContentFromEditor();
    refreshActiveFormats();
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
    const url = normalizeLinkUrl(linkUrl);
    if (!url) return;

    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();

    const restored = restoreSelection();
    const selected = window.getSelection()?.toString() ?? "";

    if (!restored || !selected) {
      const label = escapeHtmlText(linkText.trim() || url);
      document.execCommand(
        "insertHTML",
        false,
        `<a href="${url.replace(/"/g, "&quot;")}" target="_blank" rel="noopener noreferrer">${label}</a>`,
      );
    } else {
      document.execCommand("createLink", false, url);
      decorateEditorLinks(editor);
    }

    syncContentFromEditor();
    setLinkOpen(false);
    savedSelectionRef.current = null;
    refreshActiveFormats();
  }

  function handleEditorClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest("a");
    if (!anchor || !editorRef.current?.contains(anchor)) return;

    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) return;

    const href = normalizeLinkUrl(anchor.getAttribute("href") ?? "");
    if (!href) return;

    event.preventDefault();
    event.stopPropagation();
    window.open(href, "_blank", "noopener,noreferrer");
  }

  function insertChecklistItem() {
    if (!canEdit) return;
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand("insertHTML", false, "<div>☐&nbsp;</div>");
    syncContentFromEditor();
  }

  function prepareInlineImage() {
    if (!canEdit) return;
    saveSelection();
  }

  async function insertInlineImage(file: File) {
    if (!canEdit || !file.type.startsWith("image/")) return;
    const editor = editorRef.current;
    if (!editor) return;

    setInlineImageUploading(true);
    try {
      const form = new FormData();
      form.set("noteId", noteId);
      form.set("file", file);

      const response = await fetch("/api/attachments", {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Image upload failed");

      const attachment = data.attachment as NoteAttachment;
      if (!attachment.url) throw new Error("Uploaded image is unavailable");

      editor.focus();
      if (!restoreSelection()) {
        const fallback = document.createRange();
        fallback.selectNodeContents(editor);
        fallback.collapse(false);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(fallback);
      }

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      range.deleteContents();

      const image = document.createElement("img");
      image.src = attachment.url;
      image.alt = attachment.fileName;
      image.dataset.attachmentId = attachment.id;

      const lineBreak = document.createElement("br");
      const fragment = document.createDocumentFragment();
      fragment.append(image, lineBreak);
      range.insertNode(fragment);

      const next = document.createRange();
      next.setStartAfter(lineBreak);
      next.collapse(true);
      selection.removeAllRanges();
      selection.addRange(next);

      syncContentFromEditor();
      savedSelectionRef.current = null;
      void queryClient.invalidateQueries({
        queryKey: ["attachments", noteId],
      });
    } finally {
      setInlineImageUploading(false);
    }
  }

  function prepareTextColor() {
    saveSelection();
  }

  function applyTextColor(color: string | null) {
    if (!canEdit) return;
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    restoreSelection();

    const value =
      color ??
      normalizeCssColor(getComputedStyle(editor).color) ??
      "#f4f4f5";

    document.execCommand("styleWithCSS", false, "true");
    document.execCommand("foreColor", false, value);
    syncContentFromEditor();
    savedSelectionRef.current = null;
    refreshActiveFormats();
  }

  return {
    editorRef,
    shareOpen,
    setShareOpen,
    linkOpen,
    setLinkOpen,
    linkUrl,
    setLinkUrl,
    linkText,
    setLinkText,
    activeFormats,
    syncContentFromEditor,
    refreshActiveFormats,
    runCommand,
    toggleBlock,
    toggleInlineCommand,
    toggleCode,
    openLinkDialog,
    applyLinkFromDialog,
    handleEditorClick,
    insertChecklistItem,
    prepareInlineImage,
    insertInlineImage,
    inlineImageUploading,
    prepareTextColor,
    applyTextColor,
  };
}
