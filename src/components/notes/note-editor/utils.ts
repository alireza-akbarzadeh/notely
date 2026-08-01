export function sameTagIds(a: string[], b: string[]) {
  return a.length === b.length && a.every((id) => b.includes(id));
}

export function stripHtml(value: string) {
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

export function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function toEditorHtml(value: string) {
  if (!value) return "";
  if (looksLikeHtml(value)) return value;
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

export function normalizeEditorHtml(html: string) {
  const cleaned = html.replace(/^(<br\s*\/?>|\s|&nbsp;)+$/i, "").trim();
  return cleaned === "<br>" || cleaned === "<div><br></div>" ? "" : html;
}

export function wordStats(html: string) {
  const text = stripHtml(html);
  const words = text ? text.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return { words, minutes };
}

export function formatEditedAt(date: Date | string) {
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

export function normalizeLinkUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function unwrapElement(element: HTMLElement) {
  const parent = element.parentNode;
  if (!parent) return;
  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }
  parent.removeChild(element);
}

export function decorateEditorLinks(root: HTMLElement) {
  root.querySelectorAll("a[href]").forEach((node) => {
    const anchor = node as HTMLAnchorElement;
    const href = normalizeLinkUrl(anchor.getAttribute("href") ?? "");
    if (!href) return;
    anchor.setAttribute("href", href);
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");
    anchor.style.cursor = "pointer";
  });
}

export function escapeHtmlText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function statusLabel(
  status: "idle" | "saving" | "saved" | "error",
  canEdit: boolean,
) {
  if (status === "saving") return "Saving…";
  if (status === "saved") return "Edited just now";
  if (status === "error") return "Couldn’t save";
  return canEdit ? "Edited just now" : "View only";
}
