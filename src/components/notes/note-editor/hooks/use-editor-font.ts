"use client";

import { useState } from "react";

import {
  EDITOR_FONTS,
  ensureEditorFontLoaded,
  getEditorFont,
  type EditorFontOption,
} from "@/lib/editor-fonts";

import { EDITOR_FONT_STORAGE_KEY } from "../constants";

function readStoredFont(): EditorFontOption {
  if (typeof window === "undefined") return EDITOR_FONTS[0]!;
  const stored = window.localStorage.getItem(EDITOR_FONT_STORAGE_KEY);
  const font = getEditorFont(stored);
  ensureEditorFontLoaded(font);
  return font;
}

export function useEditorFont() {
  const [editorFont, setEditorFont] = useState<EditorFontOption>(readStoredFont);

  function selectFont(font: EditorFontOption) {
    ensureEditorFontLoaded(font);
    setEditorFont(font);
    window.localStorage.setItem(EDITOR_FONT_STORAGE_KEY, font.value);
  }

  return { editorFont, selectFont };
}
