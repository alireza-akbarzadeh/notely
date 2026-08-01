import type { ActiveFormats } from "./types";

export const EDITOR_FONT_STORAGE_KEY = "notely-editor-font";

export const EMPTY_FORMATS: ActiveFormats = {
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
  unorderedList: false,
  orderedList: false,
  link: false,
  code: false,
  h1: false,
  h2: false,
  blockquote: false,
  color: null,
};

export const TEXT_COLORS: { label: string; value: string | null }[] = [
  { label: "Default", value: null },
  { label: "White", value: "#f4f4f5" },
  { label: "Orange", value: "#e8914a" },
  { label: "Red", value: "#f87171" },
  { label: "Amber", value: "#fbbf24" },
  { label: "Green", value: "#4ade80" },
  { label: "Sky", value: "#38bdf8" },
  { label: "Muted", value: "#a1a1aa" },
  { label: "Black", value: "#18181b" },
];

export const TOOLBAR_BTN =
  "size-8 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40";

export const TOOLBAR_BTN_ACTIVE =
  "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary";
