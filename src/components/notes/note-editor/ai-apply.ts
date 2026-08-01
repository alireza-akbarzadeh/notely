import { normalizeEditorHtml, toEditorHtml } from "./utils";

export function htmlFromAiContent(content: string) {
  return normalizeEditorHtml(toEditorHtml(content.trim()));
}

export function applyReplaceNoteContent(
  editor: HTMLElement | null,
  setContent: (html: string) => void,
  content: string,
) {
  const html = htmlFromAiContent(content);
  if (editor) {
    editor.innerHTML = html || "<br>";
  }
  setContent(html);
  return { success: true as const, mode: "replace" as const };
}

export function applyAppendNoteContent(
  editor: HTMLElement | null,
  currentHtml: string,
  setContent: (html: string) => void,
  content: string,
) {
  const chunk = htmlFromAiContent(content);
  if (!chunk) {
    return { success: true as const, mode: "append" as const };
  }

  const next = normalizeEditorHtml(
    currentHtml.trim() ? `${currentHtml}<br>${chunk}` : chunk,
  );

  if (editor) {
    editor.innerHTML = next || "<br>";
  }
  setContent(next);
  return { success: true as const, mode: "append" as const };
}
