/** Apply wrap/prefix formatting to a textarea selection (markdown-style). */

export function wrapSelection(
  value: string,
  start: number,
  end: number,
  before: string,
  after: string,
  placeholder = "text",
) {
  const selected = value.slice(start, end);
  const inner = selected.length > 0 ? selected : placeholder;
  const next = value.slice(0, start) + before + inner + after + value.slice(end);
  const cursorStart = start + before.length;
  const cursorEnd = cursorStart + inner.length;
  return { value: next, selectionStart: cursorStart, selectionEnd: cursorEnd };
}

export function toggleLinePrefix(
  value: string,
  start: number,
  end: number,
  prefix: string,
) {
  const lineStart = value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
  let lineEnd = value.indexOf("\n", end);
  if (lineEnd === -1) lineEnd = value.length;

  const block = value.slice(lineStart, lineEnd);
  const lines = block.split("\n");
  const allPrefixed = lines.every(
    (line) => line.startsWith(prefix) || line.trim() === "",
  );

  const nextLines = lines.map((line) => {
    if (line.trim() === "") return line;
    if (allPrefixed) {
      return line.startsWith(prefix) ? line.slice(prefix.length) : line;
    }
    return line.startsWith(prefix) ? line : `${prefix}${line}`;
  });

  const replaced = nextLines.join("\n");
  const next =
    value.slice(0, lineStart) + replaced + value.slice(lineEnd);

  return {
    value: next,
    selectionStart: lineStart,
    selectionEnd: lineStart + replaced.length,
  };
}

export function insertLink(
  value: string,
  start: number,
  end: number,
  url: string,
) {
  const selected = value.slice(start, end);
  const label = selected.length > 0 ? selected : "link";
  return wrapSelection(value, start, end, "[", `](${url.trim()})`, label);
}

export function insertImage(
  value: string,
  start: number,
  end: number,
  url: string,
  alt = "image",
) {
  const selected = value.slice(start, end);
  const label = selected.length > 0 ? selected : alt;
  return wrapSelection(value, start, end, "![", `](${url.trim()})`, label);
}
