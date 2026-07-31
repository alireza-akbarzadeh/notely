"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Pin, Star } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatRelativeDate } from "@/lib/utils";
import type { NoteSummary } from "@/types/notes";

type NotesListProps = {
  notes: NoteSummary[];
  activeNoteId?: string;
  isLoading?: boolean;
  spaceName?: string;
};

export function NotesList({
  notes,
  activeNoteId,
  isLoading,
  spaceName = "All notes",
}: NotesListProps) {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  const title =
    view === "favorites"
      ? "Favorites"
      : view === "today"
        ? "Today"
        : view === "inbox"
          ? "Inbox"
          : spaceName;

  return (
    <div className="flex h-full min-h-0 w-full flex-col border-border md:w-[320px] md:border-r lg:w-[360px]">
      <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">
            {isLoading ? "Loading…" : `${notes.length} notes`}
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <p className="text-sm font-medium">No notes yet</p>
            <p className="text-xs text-muted-foreground">
              Tap New to capture your first idea.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {notes.map((note) => {
              const href = `/notes/${note.id}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
              const active = activeNoteId === note.id;
              return (
                <li key={note.id}>
                  <Link
                    href={href}
                    className={cn(
                      "block px-4 py-3.5 transition-colors active:bg-accent/80",
                      active ? "bg-accent" : "hover:bg-accent/40",
                    )}
                  >
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{note.title}</p>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatRelativeDate(note.updatedAt)}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {note.summary || "Empty note"}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {note.isPinned ? (
                        <Pin className="size-3 text-muted-foreground" />
                      ) : null}
                      {note.isFavorite ? (
                        <Star className="size-3 fill-primary text-primary" />
                      ) : null}
                      {note.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                          style={{
                            backgroundColor: `${tag.color}22`,
                            color: tag.color,
                          }}
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
