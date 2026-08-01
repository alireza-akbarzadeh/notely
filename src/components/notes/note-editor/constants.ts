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
};

export const TOOLBAR_BTN =
  "size-8 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40";

export const TOOLBAR_BTN_ACTIVE =
  "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary";
