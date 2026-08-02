"use client";

type EditorStatusBarProps = {
  words: number;
  minutes: number;
  statusLabel: string;
};

export function EditorStatusBar({
  words,
  minutes,
  statusLabel,
}: EditorStatusBarProps) {
  return (
    <div className="hidden h-10 shrink-0 items-center justify-between border-t border-border px-6 text-[11px] text-muted-foreground md:flex">
      <p>
        {words.toLocaleString()} words
        <span className="mx-2 text-border">·</span>
        {minutes} min read
      </p>
      <p>{statusLabel}</p>
    </div>
  );
}
