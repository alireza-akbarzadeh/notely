"use client";

import Link from "next/link";
import {
  CalendarDays,
  CheckSquare,
  FolderOpen,
  NotebookPen,
  Plus,
} from "lucide-react";

import { CalendarMiniMonth } from "@/components/calendar/calendar-mini-month";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { SpaceSummary } from "@/types/notes";

type CalendarNavSidebarProps = {
  cursor: Date;
  selected: Date;
  onCursorChange: (date: Date) => void;
  onSelectDate: (date: Date) => void;
  spaces: SpaceSummary[];
  activeSpaceId: string | null;
  onSelectSpace: (id: string | null) => void;
  userEmail?: string | null;
};

export function CalendarNavSidebar({
  cursor,
  selected,
  onCursorChange,
  onSelectDate,
  spaces,
  activeSpaceId,
  onSelectSpace,
  userEmail,
}: CalendarNavSidebarProps) {
  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-border bg-card/40">
      <CalendarMiniMonth
        cursor={cursor}
        selected={selected}
        onCursorChange={onCursorChange}
        onSelect={onSelectDate}
      />

      <div className="mt-4 px-3">
        <Input
          placeholder="Meet with…"
          className="h-8 border-border/60 bg-background/50 text-xs"
          aria-label="Find people to meet"
        />
      </div>

      <div className="mt-4 px-3">
        <p className="mb-1.5 truncate text-[11px] text-muted-foreground">
          {userEmail ?? "Your calendar"}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-full justify-start gap-1.5 px-2 text-xs text-muted-foreground"
          disabled
        >
          <Plus className="size-3.5" />
          Add calendar account
        </Button>
      </div>

      <div className="mt-3 flex min-h-0 flex-1 flex-col border-t border-border px-2 pt-3">
        <p className="mb-1.5 px-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Spaces
        </p>
        <ScrollArea className="min-h-0 flex-1">
          <ul className="space-y-0.5 pb-2">
            <li>
              <button
                type="button"
                onClick={() => onSelectSpace(null)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                  activeSpaceId === null
                    ? "bg-primary/15 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <CheckSquare className="size-3.5 shrink-0" />
                All notes
              </button>
            </li>
            {spaces.map((space) => {
              const active = activeSpaceId === space.id;
              return (
                <li key={space.id}>
                  <button
                    type="button"
                    onClick={() => onSelectSpace(space.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                      active
                        ? "bg-primary/15 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    <FolderOpen className="size-3.5 shrink-0" />
                    <span className="truncate">{space.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </ScrollArea>

        <div className="border-t border-border py-3">
          <Link
            href="/workspace"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <NotebookPen className="size-3.5" />
            Back to notes
          </Link>
          <div className="mt-2 flex items-center gap-2 px-2 text-[11px] text-muted-foreground">
            <CalendarDays className="size-3.5 text-primary" />
            Plans
          </div>
        </div>
      </div>
    </aside>
  );
}
