"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CalendarListPanel } from "@/components/calendar/calendar-list-panel";
import { CalendarNavSidebar } from "@/components/calendar/calendar-nav-sidebar";
import { CalendarUtilityPanel } from "@/components/calendar/calendar-utility-panel";
import { CalendarWeekView } from "@/components/calendar/calendar-week-view";
import type { CalendarEvent } from "@/components/calendar/types";
import { startOfMonth, weekRangeIso } from "@/components/calendar/utils";
import { authClient } from "@/lib/auth/client";
import type { NoteSummary, SpaceSummary } from "@/types/notes";

export function CalendarWorkspace() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const [selected, setSelected] = useState(() => new Date());
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
  const [sidebarsOpen, setSidebarsOpen] = useState(true);
  const [search, setSearch] = useState("");

  const range = useMemo(() => weekRangeIso(selected), [selected]);

  const spacesQuery = useQuery({
    queryKey: ["spaces"],
    queryFn: async (): Promise<{ spaces: SpaceSummary[] }> => {
      const response = await fetch("/api/spaces");
      if (!response.ok) throw new Error("Failed to load spaces");
      return response.json();
    },
  });

  const notesQuery = useQuery({
    queryKey: ["notes", activeSpaceId, "calendar"],
    queryFn: async (): Promise<{ notes: NoteSummary[] }> => {
      const params = new URLSearchParams();
      if (activeSpaceId) params.set("spaceId", activeSpaceId);
      const response = await fetch(`/api/notes?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to load notes");
      return response.json();
    },
  });

  const eventsQuery = useQuery({
    queryKey: ["events", range.from, range.to],
    queryFn: async (): Promise<{ events: CalendarEvent[] }> => {
      const response = await fetch(
        `/api/events?from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`,
      );
      if (!response.ok) throw new Error("Failed to load events");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (input: {
      title: string;
      startTime: string;
      noteId?: string | null;
    }) => {
      const end = new Date(input.startTime);
      end.setHours(end.getHours() + 1);
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: input.title,
          startTime: input.startTime,
          endTime: end.toISOString(),
          noteId: input.noteId ?? null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to create event");
      return data.event as CalendarEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to delete event");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const spaces = spacesQuery.data?.spaces ?? [];
  const notes = notesQuery.data?.notes ?? [];
  const events = eventsQuery.data?.events ?? [];
  const activeSpace =
    spaces.find((space) => space.id === activeSpaceId) ?? null;

  function selectDate(date: Date) {
    setSelected(date);
    setMonthCursor(startOfMonth(date));
  }

  function createAt(date: Date) {
    const title = window.prompt("Event title", "New event");
    if (!title?.trim()) return;
    createMutation.mutate({
      title: title.trim(),
      startTime: date.toISOString(),
    });
  }

  function createFromNote(note: NoteSummary) {
    const start = new Date(selected);
    const now = new Date();
    start.setHours(now.getHours(), 0, 0, 0);
    createMutation.mutate({
      title: note.title || "Untitled",
      startTime: start.toISOString(),
      noteId: note.id,
    });
  }

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-background">
      {sidebarsOpen ? (
        <>
          <div className="hidden md:flex">
            <CalendarNavSidebar
              cursor={monthCursor}
              selected={selected}
              onCursorChange={setMonthCursor}
              onSelectDate={selectDate}
              spaces={spaces}
              activeSpaceId={activeSpaceId}
              onSelectSpace={setActiveSpaceId}
              userEmail={session?.user?.email}
            />
          </div>
          <div className="hidden lg:flex">
            <CalendarListPanel
              space={activeSpace}
              notes={notes}
              isLoading={notesQuery.isLoading}
              onCreateEventFromNote={createFromNote}
            />
          </div>
        </>
      ) : null}

      <CalendarWeekView
        anchor={selected}
        events={events}
        sidebarsOpen={sidebarsOpen}
        onToggleSidebars={() => setSidebarsOpen((open) => !open)}
        onAnchorChange={selectDate}
        onCreateAt={createAt}
        onDeleteEvent={(id) => deleteMutation.mutate(id)}
      />

      <CalendarUtilityPanel
        events={events}
        search={search}
        onSearchChange={setSearch}
      />
    </div>
  );
}
