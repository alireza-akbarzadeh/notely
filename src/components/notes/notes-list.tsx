"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronDown,
  ListFilter,
  Notebook,
  PanelLeftIcon,
  RotateCcw,
  Search,
  Star,
  Trash2,
} from "lucide-react";

import {
  NoteReminderCountdown,
  useReminderClock,
} from "@/components/notes/note-reminder-countdown";
import { useNoteReminders } from "@/components/notes/use-note-reminders";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "@/components/ui/sidebar";
import { cn, formatRelativeDate } from "@/lib/utils";
import type { NoteSummary, SpaceSummary } from "@/types/notes";

type NotesListProps = {
  notes: NoteSummary[];
  activeNoteId?: string;
  isLoading?: boolean;
  spaceName?: string;
  trashedSpaces?: SpaceSummary[];
  trashedSpacesLoading?: boolean;
  onRestoreSpace?: (spaceId: string) => void;
  onPermanentlyDeleteSpace?: (spaceId: string) => void;
  spaceActionPending?: boolean;
};

type NoteGroup = {
  key: string;
  label: string;
  notes: NoteSummary[];
};

function groupNotes(notes: NoteSummary[], trashView = false): NoteGroup[] {
  if (trashView) {
    return notes.length > 0
      ? [{ key: "trash", label: "Recently deleted notes", notes }]
      : [];
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 6);

  const pinned: NoteSummary[] = [];
  const today: NoteSummary[] = [];
  const yesterday: NoteSummary[] = [];
  const thisWeek: NoteSummary[] = [];
  const earlier: NoteSummary[] = [];

  for (const note of notes) {
    if (note.isPinned) {
      pinned.push(note);
      continue;
    }
    const updated = new Date(note.updatedAt);
    if (updated >= startOfToday) today.push(note);
    else if (updated >= startOfYesterday) yesterday.push(note);
    else if (updated >= startOfWeek) thisWeek.push(note);
    else earlier.push(note);
  }

  return [
    { key: "pinned", label: "Pinned", notes: pinned },
    { key: "today", label: "Today", notes: today },
    { key: "yesterday", label: "Yesterday", notes: yesterday },
    { key: "week", label: "This week", notes: thisWeek },
    { key: "earlier", label: "Earlier", notes: earlier },
  ].filter((group) => group.notes.length > 0);
}

function noteTimestamp(note: NoteSummary, trashView = false) {
  const date = new Date(
    trashView && note.deletedAt ? note.deletedAt : note.updatedAt,
  );
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfThatDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const dayDiff = Math.round(
    (startOfToday.getTime() - startOfThatDay.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (dayDiff === 0) {
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return formatRelativeDate(
    trashView && note.deletedAt ? note.deletedAt : note.updatedAt,
  );
}

function spaceTimestamp(space: SpaceSummary) {
  const raw = space.deletedAt ?? space.updatedAt;
  return formatRelativeDate(raw);
}

export function NotesList({
  notes,
  activeNoteId,
  isLoading,
  spaceName = "All Notes",
  trashedSpaces = [],
  trashedSpacesLoading = false,
  onRestoreSpace,
  onPermanentlyDeleteSpace,
  spaceActionPending = false,
}: NotesListProps) {
  const searchParams = useSearchParams();
  const { toggleSidebar } = useSidebar();
  const view = searchParams.get("view");
  const trashView = view === "trash";
  const [spaceToPurge, setSpaceToPurge] = useState<SpaceSummary | null>(null);

  const title =
    view === "favorites"
      ? "Tasks"
      : view === "today"
        ? "Journal"
        : view === "inbox"
          ? "Inbox"
          : view === "archive" || view === "shared"
            ? "Archive"
            : trashView
              ? "Trash"
              : spaceName === "Notes"
                ? "All Notes"
                : spaceName;

  const groups = useMemo(
    () => groupNotes(notes, trashView),
    [notes, trashView],
  );

  const remindersByNote = useNoteReminders(!trashView);
  const hasCountdown = notes.some((note) => remindersByNote.has(note.id));
  const now = useReminderClock(hasCountdown);
  // Accent colour comes from the note's position in the list so each row differs.
  const colorIndexByNote = useMemo(() => {
    const indexes = new Map<string, number>();
    notes.forEach((note, index) => indexes.set(note.id, index));
    return indexes;
  }, [notes]);

  const isEmpty =
    !isLoading &&
    !trashedSpacesLoading &&
    notes.length === 0 &&
    (!trashView || trashedSpaces.length === 0);

  return (
    <div className="flex h-full min-h-0 w-full flex-col border-border bg-panel md:w-75 md:border-r lg:w-85">
      <div className="flex h-14 shrink-0 items-center gap-1.5 border-b border-border px-3 pt-[env(safe-area-inset-top)] md:gap-2 md:px-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 md:hidden"
          onClick={toggleSidebar}
          aria-label="Open navigation"
        >
          <PanelLeftIcon className="size-4" />
        </Button>

        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
        >
          <span className="truncate text-sm font-semibold tracking-tight">
            {title}
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        </button>

        <button
          type="button"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={() => window.dispatchEvent(new Event("notely:open-search"))}
          aria-label="Search notes"
        >
          <Search className="size-4" />
        </button>
        <button
          type="button"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Filter notes"
        >
          <ListFilter className="size-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-[calc(5rem+env(safe-area-inset-bottom))] scrollbar-thin md:pb-0">
        {isLoading || (trashView && trashedSpacesLoading) ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <p className="text-sm font-medium">
              {trashView ? "Trash is empty" : "No notes yet"}
            </p>
            <p className="text-xs text-muted-foreground">
              {trashView
                ? "Deleted notes and spaces will appear here."
                : "Create a note to start writing."}
            </p>
          </div>
        ) : (
          <div className="py-2">
            {trashView && trashedSpaces.length > 0 ? (
              <section className="mb-1">
                <p className="px-4 pt-3 pb-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Deleted spaces
                </p>
                <ul>
                  {trashedSpaces.map((space) => {
                    const noteCount = space.noteCount ?? 0;
                    return (
                      <li key={space.id}>
                        <div className="mx-2 rounded-lg px-3 py-3 transition-colors hover:bg-accent/50">
                          <div className="mb-1 flex items-start justify-between gap-2">
                            <div className="flex min-w-0 items-center gap-2">
                              <Notebook className="size-3.5 shrink-0 text-muted-foreground" />
                              <p className="truncate text-[13px] font-semibold text-foreground">
                                {space.name}
                              </p>
                            </div>
                            <span className="shrink-0 pt-0.5 text-[11px] text-muted-foreground">
                              {spaceTimestamp(space)}
                            </span>
                          </div>
                          <p className="mb-2 text-[12px] leading-relaxed text-muted-foreground">
                            {noteCount === 0
                              ? "Empty space"
                              : noteCount === 1
                                ? "1 note"
                                : `${noteCount} notes`}
                          </p>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1.5 px-2 text-xs"
                              disabled={spaceActionPending}
                              onClick={() => onRestoreSpace?.(space.id)}
                            >
                              <RotateCcw className="size-3" />
                              Restore
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1.5 px-2 text-xs text-destructive hover:text-destructive"
                              disabled={spaceActionPending}
                              onClick={() => setSpaceToPurge(space)}
                            >
                              <Trash2 className="size-3" />
                              Delete forever
                            </Button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            {groups.map((group) => (
              <section key={group.key} className="mb-1">
                <p className="px-4 pt-3 pb-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {group.label}
                </p>
                <ul>
                  {group.notes.map((note) => {
                    const href = `/notes/${note.id}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
                    const active = activeNoteId === note.id;
                    const reminder = trashView
                      ? undefined
                      : remindersByNote.get(note.id);
                    return (
                      <li key={note.id}>
                        <Link
                          href={href}
                          className={cn(
                            "relative mx-2 block rounded-lg px-3 py-3 transition-colors",
                            active
                              ? "note-active-rail bg-accent"
                              : "hover:bg-accent/50",
                          )}
                        >
                          <div className="mb-1 flex items-start justify-between gap-2">
                            <p className="truncate text-[13px] font-semibold text-foreground">
                              {note.title || "Untitled"}
                            </p>
                            <span className="shrink-0 pt-0.5 text-[11px] text-muted-foreground">
                              {noteTimestamp(note, trashView)}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                            {note.summary || "Empty note"}
                          </p>
                          {reminder ? (
                            <NoteReminderCountdown
                              remindAt={reminder.remindAt}
                              createdAt={reminder.createdAt}
                              colorIndex={colorIndexByNote.get(note.id) ?? 0}
                              now={now}
                            />
                          ) : null}
                          {(note.isFavorite || note.tags.length > 0) && (
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              {note.isFavorite ? (
                                <Star className="size-3 fill-primary text-primary" />
                              ) : null}
                              {note.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag.id}
                                  className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                                >
                                  #{tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                          {active ? (
                            <span className="absolute top-3.5 right-3 size-1.5 rounded-full bg-primary" />
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(spaceToPurge)}
        onOpenChange={(open) => {
          if (!open) setSpaceToPurge(null);
        }}
        title="Delete space forever?"
        description={
          spaceToPurge
            ? `“${spaceToPurge.name}” and all of its notes will be permanently deleted. This cannot be undone.`
            : "This space and its notes will be permanently deleted."
        }
        confirmLabel="Delete forever"
        pendingLabel="Deleting…"
        pending={spaceActionPending}
        destructive
        onConfirm={() => {
          if (!spaceToPurge) return;
          onPermanentlyDeleteSpace?.(spaceToPurge.id);
          setSpaceToPurge(null);
        }}
      />
    </div>
  );
}
