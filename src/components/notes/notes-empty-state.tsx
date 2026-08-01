"use client";

import type { ReactNode } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NotesEmptyStateVariant =
  | "select"
  | "empty"
  | "trash"
  | "inbox"
  | "shared"
  | "archive"
  | "today"
  | "favorites"
  | "task";

type NotesEmptyStateProps = {
  variant?: NotesEmptyStateVariant;
  className?: string;
  onCreateNote?: () => void;
  createPending?: boolean;
};

type IllustrationProps = {
  className?: string;
};

function SoftBackdrop() {
  return (
    <>
      <ellipse cx="160" cy="168" rx="118" ry="28" fill="var(--primary)" opacity="0.08" />
      <circle cx="160" cy="110" r="96" fill="url(#emptyGlow)" />
    </>
  );
}

function IllustrationShell({
  className,
  children,
}: IllustrationProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto w-full max-w-70", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="emptyGlow" x1="60" y1="20" x2="280" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--primary)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="paperShade" x1="110" y1="48" x2="230" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f4efe8" />
          <stop offset="1" stopColor="#e4ddd4" />
        </linearGradient>
      </defs>
      <SoftBackdrop />
      {children}
    </svg>
  );
}

function WritingDeskIllustration({ className }: IllustrationProps) {
  return (
    <IllustrationShell className={className}>
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
      <rect x="88" y="50" width="144" height="112" rx="6" fill="url(#paperShade)" opacity="0.92" />
      <path
        d="M104 78H208M104 96H200M104 114H192M104 132H184"
        stroke="#b8aea2"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path d="M232 42V98L222 90L212 98V42" fill="var(--primary)" />

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

      <g transform="translate(54 128) rotate(28)">
        <rect x="0" y="0" width="78" height="8" rx="4" fill="#2a2a2a" />
        <rect x="0" y="0" width="16" height="8" rx="4" fill="var(--primary)" />
        <path d="M78 0L90 4L78 8V0Z" fill="#c4bbb0" />
      </g>

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
    </IllustrationShell>
  );
}

function TrashIllustration({ className }: IllustrationProps) {
  return (
    <IllustrationShell className={className}>
      {/* lid */}
      <rect
        x="96"
        y="48"
        width="128"
        height="18"
        rx="6"
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />
      <rect x="136" y="38" width="48" height="14" rx="5" fill="var(--primary)" />

      {/* can body */}
      <path
        d="M108 74H212L200 168C199 176 192 182 184 182H136C128 182 121 176 120 168L108 74Z"
        fill="url(#paperShade)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />

      {/* ridges */}
      <path
        d="M132 92V156M160 88V160M188 92V156"
        stroke="var(--muted-foreground)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* crumpled note peeking out */}
      <g transform="translate(188 58) rotate(18)">
        <rect
          width="54"
          height="40"
          rx="6"
          fill="var(--background)"
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        <path
          d="M12 14H42M12 22H34M12 30H28"
          stroke="var(--muted-foreground)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>

      {/* spark accents */}
      <circle cx="78" cy="96" r="4" fill="var(--primary)" opacity="0.7" />
      <circle cx="246" cy="130" r="3" fill="var(--primary)" opacity="0.45" />
      <path
        d="M70 128L74 136L82 140L74 144L70 152L66 144L58 140L66 136Z"
        fill="var(--primary)"
        opacity="0.35"
      />
    </IllustrationShell>
  );
}

function InboxIllustration({ className }: IllustrationProps) {
  return (
    <IllustrationShell className={className}>
      {/* tray back */}
      <path
        d="M70 78H250L230 158H90L70 78Z"
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />
      <path
        d="M86 90H234L220 148H100L86 90Z"
        fill="url(#paperShade)"
        opacity="0.95"
      />

      {/* tray lip */}
      <path
        d="M60 158H260C266 158 270 162 270 168V172C270 178 266 182 260 182H60C54 182 50 178 50 172V168C50 162 54 158 60 158Z"
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />
      <rect x="120" y="164" width="80" height="8" rx="4" fill="var(--primary)" />

      {/* stacked letters */}
      <g transform="translate(108 62) rotate(-8)">
        <rect
          width="104"
          height="58"
          rx="8"
          fill="var(--background)"
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        <path
          d="M0 18L52 38L104 18"
          stroke="var(--primary)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M18 28H48M18 36H40"
          stroke="var(--muted-foreground)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>

      <circle cx="248" cy="72" r="5" fill="var(--primary)" />
      <circle cx="72" cy="120" r="3.5" fill="var(--primary)" opacity="0.45" />
    </IllustrationShell>
  );
}

function ArchiveIllustration({ className }: IllustrationProps) {
  return (
    <IllustrationShell className={className}>
      {/* box body */}
      <path
        d="M84 86H236V168C236 176 230 182 222 182H98C90 182 84 176 84 168V86Z"
        fill="url(#paperShade)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />

      {/* lid */}
      <path
        d="M74 70H246L236 96H84L74 70Z"
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />
      <rect x="138" y="78" width="44" height="10" rx="4" fill="var(--primary)" />

      {/* label card */}
      <rect
        x="118"
        y="118"
        width="84"
        height="40"
        rx="6"
        fill="var(--background)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />
      <path
        d="M132 132H188M132 142H172"
        stroke="var(--muted-foreground)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* floating archived note */}
      <g transform="translate(220 48) rotate(14)">
        <rect
          width="56"
          height="44"
          rx="7"
          fill="var(--background)"
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        <path
          d="M12 16H44M12 24H36M12 32H30"
          stroke="var(--muted-foreground)"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.5"
        />
        <circle cx="16" cy="10" r="2.5" fill="var(--primary)" />
      </g>

      <circle cx="68" cy="130" r="4" fill="var(--primary)" opacity="0.55" />
    </IllustrationShell>
  );
}

function TaskIllustration({ className }: IllustrationProps) {
  return (
    <IllustrationShell className={className}>
      {/* clipboard */}
      <rect
        x="96"
        y="52"
        width="128"
        height="132"
        rx="14"
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />
      <rect x="108" y="68" width="104" height="104" rx="8" fill="url(#paperShade)" />

      {/* clip */}
      <rect x="132" y="38" width="56" height="28" rx="8" fill="var(--primary)" />
      <rect x="146" y="46" width="28" height="12" rx="4" fill="var(--card)" />

      {/* checklist rows */}
      <g strokeLinecap="round">
        <rect x="122" y="86" width="14" height="14" rx="4" stroke="var(--primary)" strokeWidth="1.6" fill="var(--background)" />
        <path d="M125 93L128 96L133 90" stroke="var(--primary)" strokeWidth="1.6" />
        <path d="M146 93H196" stroke="var(--muted-foreground)" strokeWidth="1.5" opacity="0.55" />

        <rect x="122" y="114" width="14" height="14" rx="4" stroke="var(--border)" strokeWidth="1.6" fill="var(--background)" />
        <path d="M146 121H188" stroke="var(--muted-foreground)" strokeWidth="1.5" opacity="0.45" />

        <rect x="122" y="142" width="14" height="14" rx="4" stroke="var(--border)" strokeWidth="1.6" fill="var(--background)" />
        <path d="M146 149H180" stroke="var(--muted-foreground)" strokeWidth="1.5" opacity="0.4" />
      </g>

      {/* floating check badge */}
      <g transform="translate(214 120)">
        <circle cx="18" cy="18" r="18" fill="var(--primary)" />
        <path
          d="M10 18L16 24L28 12"
          stroke="var(--primary-foreground, #fff)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <circle cx="74" cy="96" r="3.5" fill="var(--primary)" opacity="0.5" />
    </IllustrationShell>
  );
}

const copy: Record<
  NotesEmptyStateVariant,
  { title: string; description: string }
> = {
  select: {
    title: "Pick a note to begin",
    description: "Choose something from the list, or start a fresh note from the sidebar.",
  },
  empty: {
    title: "No notes yet",
    description: "Your desk is clear. Capture the first idea and it will live here.",
  },
  trash: {
    title: "Trash is empty",
    description:
      "Deleted notes and spaces land here until you restore them or empty trash permanently.",
  },
  inbox: {
    title: "You're all caught up",
    description: "Shared note invites will show up here when someone sends one.",
  },
  shared: {
    title: "Nothing shared with you yet",
    description:
      "When someone invites you to a note, it shows up here after you accept it in Inbox.",
  },
  archive: {
    title: "Archive is empty",
    description:
      "File notes away to keep your main list focused. Unarchive anytime to bring them back.",
  },
  today: {
    title: "Nothing for today",
    description:
      "Notes you edit today, or that have a reminder or task due today, appear in this list.",
  },
  favorites: {
    title: "No favorites yet",
    description: "Star a note to pin it here for quick access.",
  },
  task: {
    title: "No tasks yet",
    description: "Turn ideas into checkable work. Your first task will appear here.",
  },
};

function EmptyIllustration({
  variant,
  className,
}: {
  variant: NotesEmptyStateVariant;
  className?: string;
}) {
  switch (variant) {
    case "trash":
      return <TrashIllustration className={className} />;
    case "inbox":
      return <InboxIllustration className={className} />;
    case "shared":
      return <ArchiveIllustration className={className} />;
    case "archive":
      return <ArchiveIllustration className={className} />;
    case "today":
    case "favorites":
    case "task":
      return <TaskIllustration className={className} />;
    default:
      return <WritingDeskIllustration className={className} />;
  }
}

export function NotesEmptyState({
  variant = "select",
  className,
  onCreateNote,
  createPending,
}: NotesEmptyStateProps) {
  const { title, description } = copy[variant];
  const showCreate = variant === "empty" && onCreateNote;

  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center px-6 py-10 text-center",
        className,
      )}
    >
      <div className="relative mb-6 animate-rise">
        <EmptyIllustration variant={variant} />
      </div>

      <div className="max-w-sm animate-rise" style={{ animationDelay: "80ms" }}>
        <p className="text-xl font-semibold tracking-tight text-foreground">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>

      {showCreate ? (
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
