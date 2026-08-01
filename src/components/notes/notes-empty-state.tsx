"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NotesEmptyStateProps = {
  variant?: "select" | "empty";
  className?: string;
  onCreateNote?: () => void;
  createPending?: boolean;
};

function WritingDeskIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto w-full max-w-[280px]", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="deskGlow" x1="60" y1="20" x2="280" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--primary)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="paperShade" x1="110" y1="48" x2="230" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f4efe8" />
          <stop offset="1" stopColor="#e4ddd4" />
        </linearGradient>
      </defs>

      {/* soft backdrop */}
      <ellipse cx="160" cy="168" rx="118" ry="28" fill="var(--primary)" opacity="0.08" />
      <circle cx="160" cy="110" r="96" fill="url(#deskGlow)" />

      {/* notebook back */}
      <rect
        x="78"
        y="42"
        width="164"
        height="128"
        rx="10"
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />
      <rect
        x="88"
        y="50"
        width="144"
        height="112"
        rx="6"
        fill="url(#paperShade)"
        opacity="0.92"
      />

      {/* ruled lines */}
      <path
        d="M104 78H208M104 96H200M104 114H192M104 132H184"
        stroke="#b8aea2"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* orange accent bookmark */}
      <path d="M232 42V98L222 90L212 98V42" fill="var(--primary)" />

      {/* floating note card */}
      <g transform="translate(198 118) rotate(-12)">
        <rect
          width="72"
          height="54"
          rx="8"
          fill="var(--background)"
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        <path
          d="M14 18H54M14 28H46M14 38H40"
          stroke="var(--muted-foreground)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle cx="18" cy="12" r="3" fill="var(--primary)" />
      </g>

      {/* pen */}
      <g transform="translate(54 128) rotate(28)">
        <rect x="0" y="0" width="78" height="8" rx="4" fill="#2a2a2a" />
        <rect x="0" y="0" width="16" height="8" rx="4" fill="var(--primary)" />
        <path d="M78 0L90 4L78 8V0Z" fill="#c4bbb0" />
      </g>

      {/* coffee / mug */}
      <g transform="translate(236 68)">
        <rect
          x="0"
          y="10"
          width="28"
          height="26"
          rx="6"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        <path
          d="M28 16H34C36.2 16 38 17.8 38 20V26C38 28.2 36.2 30 34 30H28"
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        <path
          d="M8 4C8 4 6 0 10 0C14 0 12 4 12 4M16 4C16 4 14 0 18 0C22 0 20 4 20 4"
          stroke="var(--muted-foreground)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.55"
        />
      </g>
    </svg>
  );
}

export function NotesEmptyState({
  variant = "select",
  className,
  onCreateNote,
  createPending,
}: NotesEmptyStateProps) {
  const isEmpty = variant === "empty";

  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center px-6 py-10 text-center",
        className,
      )}
    >
      <div className="relative mb-6 animate-rise">
        <WritingDeskIllustration />
      </div>

      <div className="max-w-sm animate-rise" style={{ animationDelay: "80ms" }}>
        <p className="text-xl font-semibold tracking-tight text-foreground">
          {isEmpty ? "No notes yet" : "Pick a note to begin"}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {isEmpty
            ? "Your desk is clear. Capture the first idea and it will live here."
            : "Choose something from the list, or start a fresh note from the sidebar."}
        </p>
      </div>

      {isEmpty && onCreateNote ? (
        <Button
          className="mt-6 animate-rise gap-2"
          style={{ animationDelay: "140ms" }}
          onClick={onCreateNote}
          disabled={createPending}
        >
          <Plus className="size-4" />
          {createPending ? "Creating…" : "Create your first note"}
        </Button>
      ) : null}
    </div>
  );
}
