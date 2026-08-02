import type { NoteSummary, NoteTag } from "@/types/notes";

export type ActiveFormats = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeThrough: boolean;
  unorderedList: boolean;
  orderedList: boolean;
  link: boolean;
  code: boolean;
  h1: boolean;
  h2: boolean;
  blockquote: boolean;
  /** Current text color as `#rrggbb`, or null when default. */
  color: string | null;
};

export type NoteEditorProps = {
  note: NoteSummary;
  allTags: NoteTag[];
};

export type DraftSnapshot = {
  title: string;
  content: string;
  tagIds: string[];
};

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export type BlockTag = "h1" | "h2" | "blockquote";
