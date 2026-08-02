"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Keyboard, Search } from "lucide-react";

import type { CalendarEvent } from "@/components/calendar/types";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const SHORTCUTS = [
  { keys: "Ctrl K", label: "Command menu" },
  { keys: "\\", label: "Toggle sidebar" },
  { keys: ".", label: "Go to date" },
  { keys: "T", label: "Jump to today" },
  { keys: "?", label: "All shortcuts" },
] as const;

type CalendarUtilityPanelProps = {
  events: CalendarEvent[];
  search: string;
  onSearchChange: (value: string) => void;
};

export function CalendarUtilityPanel({
  events,
  search,
  onSearchChange,
}: CalendarUtilityPanelProps) {
  const [checks, setChecks] = useState({
    palette: false,
    connect: false,
    invite: false,
  });

  const filtered = search.trim()
    ? events.filter((e) =>
        e.title.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : events.slice(0, 8);

  return (
    <aside className="hidden h-full w-[260px] shrink-0 flex-col border-l border-border bg-card/30 xl:flex">
      <div className="border-b border-border p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events"
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-5 p-3">
          {search.trim() ? (
            <section>
              <p className="mb-2 text-xs font-semibold">Results</p>
              {filtered.length === 0 ? (
                <p className="text-[11px] text-muted-foreground">No matches.</p>
              ) : (
                <ul className="space-y-1.5">
                  {filtered.map((event) => (
                    <li
                      key={event.id}
                      className="rounded-md border border-border/60 bg-background/40 px-2.5 py-2"
                    >
                      <p className="truncate text-xs font-medium">{event.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(event.startTime).toLocaleString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : null}

          <section>
            <p className="mb-2 text-sm font-semibold tracking-tight">
              Welcome to Plans
            </p>
            <ul className="space-y-2">
              {(
                [
                  ["palette", "Use command palette"],
                  ["connect", "Browse your spaces"],
                  ["invite", "Schedule from a note"],
                ] as const
              ).map(([key, label]) => {
                const done = checks[key];
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() =>
                        setChecks((prev) => ({ ...prev, [key]: !prev[key] }))
                      }
                      className="flex w-full items-center gap-2 text-left text-xs text-muted-foreground hover:text-foreground"
                    >
                      {done ? (
                        <CheckCircle2 className="size-4 shrink-0 text-primary" />
                      ) : (
                        <Circle className="size-4 shrink-0" />
                      )}
                      <span className={cn(done && "line-through opacity-60")}>
                        {label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-xl border border-border/70 bg-background/40 p-3">
            <p className="text-xs font-semibold">Invite to Notely</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Share your notes workspace so teammates can plan alongside you.
            </p>
          </section>

          <section>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold">
              <Keyboard className="size-3.5 text-muted-foreground" />
              Useful shortcuts
            </div>
            <ul className="space-y-1.5">
              {SHORTCUTS.map((item) => (
                <li
                  key={item.keys}
                  className="flex items-center justify-between gap-2 text-[11px]"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <kbd className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                    {item.keys}
                  </kbd>
                </li>
              ))}
            </ul>
          </section>

          {!search.trim() && filtered.length > 0 ? (
            <section>
              <p className="mb-2 text-xs font-semibold">This week</p>
              <ul className="space-y-1.5">
                {filtered.map((event) => (
                  <li
                    key={event.id}
                    className="rounded-md border border-border/60 bg-background/40 px-2.5 py-2"
                  >
                    <p className="truncate text-xs font-medium">{event.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(event.startTime).toLocaleString(undefined, {
                        weekday: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </ScrollArea>
    </aside>
  );
}
