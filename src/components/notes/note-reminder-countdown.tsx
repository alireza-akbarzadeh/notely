"use client";

import { useEffect, useState } from "react";
import { AlarmClock } from "lucide-react";

import { cn } from "@/lib/utils";

/** Light, pastel accents cycled by list position so each note reads distinctly. */
const REMINDER_ACCENTS = [
  { from: "#7dd3fc", to: "#38bdf8" },
  { from: "#c4b5fd", to: "#a78bfa" },
  { from: "#6ee7b7", to: "#34d399" },
  { from: "#fcd34d", to: "#fbbf24" },
  { from: "#fda4af", to: "#fb7185" },
  { from: "#67e8f9", to: "#22d3ee" },
  { from: "#f0abfc", to: "#e879f9" },
  { from: "#bef264", to: "#a3e635" },
] as const;

export function reminderAccent(index: number) {
  const size = REMINDER_ACCENTS.length;
  return REMINDER_ACCENTS[((index % size) + size) % size]!;
}

/** Ticks once a second, only while a countdown is on screen. */
export function useReminderClock(active: boolean) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const handle = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(handle);
  }, [active]);

  return now;
}

function formatCountdown(msLeft: number) {
  if (msLeft <= 0) return "Due now";
  const totalSeconds = Math.floor(msLeft / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  if (minutes > 0) return `${minutes}m ${String(seconds).padStart(2, "0")}s left`;
  return `${seconds}s left`;
}

function formatTarget(target: number) {
  const date = new Date(target);
  const time = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const today = new Date();
  const sameDay =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
  if (sameDay) return time;
  return `${date.toLocaleDateString(undefined, { day: "numeric", month: "short" })} ${time}`;
}

type NoteReminderCountdownProps = {
  /** ISO timestamp the reminder fires at. */
  remindAt: string;
  /** ISO timestamp the reminder was set — the start of the progress track. */
  createdAt: string;
  colorIndex: number;
  now: number;
};

export function NoteReminderCountdown({
  remindAt,
  createdAt,
  colorIndex,
  now,
}: NoteReminderCountdownProps) {
  const target = Date.parse(remindAt);
  if (Number.isNaN(target)) return null;

  const start = Date.parse(createdAt);
  const total = Number.isNaN(start) ? 0 : target - start;
  const progress =
    total > 0 ? Math.min(100, Math.max(3, ((now - start) / total) * 100)) : 100;
  const msLeft = target - now;
  const due = msLeft <= 0;
  const accent = reminderAccent(colorIndex);
  const label = formatCountdown(msLeft);

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span
          className="flex min-w-0 items-center gap-1 font-medium"
          style={{ color: accent.from }}
        >
          <AlarmClock className={cn("size-3 shrink-0", due && "animate-pulse")} />
          <span className="truncate tabular-nums">{label}</span>
        </span>
        <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">
          {formatTarget(target)}
        </span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: `${accent.from}24` }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label={`Reminder ${label}`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-1000 ease-linear",
            due && "animate-pulse",
          )}
          style={{
            width: `${progress}%`,
            backgroundImage: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
            boxShadow: `0 0 8px ${accent.to}66`,
          }}
        />
      </div>
    </div>
  );
}
