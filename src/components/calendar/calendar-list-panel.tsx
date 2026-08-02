"use client";

import Link from "next/link";
import { FileText, LayoutGrid, Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NoteSummary, SpaceSummary } from "@/types/notes";

type CalendarListPanelProps = {
  space: SpaceSummary | null;
  notes: NoteSummary[];
  isLoading: boolean;
  onCreateEventFromNote: (note: NoteSummary) => void;
};

export function CalendarListPanel({
  space,
  notes,
  isLoading,
  onCreateEventFromNote,
}: CalendarListPanelProps) {
  const title = space?.name ?? "All notes";

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-border bg-background">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <h2 className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight">
          {title}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground"
          aria-label="Layout"
          disabled
        >
          <LayoutGrid className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground"
          aria-label="Search list"
          disabled
        >
          <Search className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground"
          aria-label="Add"
          disabled
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

      <div className="border-b border-border px-3 py-2">
        <p className="text-xs text-muted-foreground">
          Schedule from notes · click + on a card
        </p>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-2 p-3">
          {isLoading ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              Loading…
            </p>
          ) : notes.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              No notes in this space yet.
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="group rounded-lg border border-border/70 bg-card/50 p-3 transition-colors hover:border-border hover:bg-card"
              >
                <div className="flex items-start gap-2">
                  <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/notes/${note.id}`}
                      className="block truncate text-sm font-medium hover:underline"
                    >
                      {note.title || "Untitled"}
                    </Link>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {note.isFavorite ? (
                        <Badge
                          variant="secondary"
                          className="h-5 rounded-full bg-destructive/15 px-2 text-[10px] text-destructive"
                        >
                          Favorite
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="h-5 rounded-full px-2 text-[10px]"
                        >
                          Note
                        </Badge>
                      )}
                      {note.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="h-5 rounded-full px-2 text-[10px]"
                          style={{ borderColor: tag.color, color: tag.color }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    {note.summary ? (
                      <p className="mt-1.5 line-clamp-2 text-[11px] text-muted-foreground">
                        {note.summary}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label={`Schedule ${note.title || "note"}`}
                    onClick={() => onCreateEventFromNote(note)}
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
