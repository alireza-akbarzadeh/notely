"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Plus, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CalendarEvent = {
  id: string;
  title: string;
  startTime: string;
  endTime: string | null;
  link: string | null;
};

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function UtilitySidebar() {
  const queryClient = useQueryClient();
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState(() => new Date());
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("10:00");

  const monthStart = startOfMonth(cursor);
  const totalDays = daysInMonth(cursor);
  const startWeekday = monthStart.getDay();

  const range = useMemo(() => {
    const from = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const to = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59);
    return { from: from.toISOString(), to: to.toISOString() };
  }, [cursor]);

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
    mutationFn: async () => {
      const [hours, minutes] = time.split(":").map(Number);
      const start = new Date(selected);
      start.setHours(hours || 0, minutes || 0, 0, 0);
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || "Untitled meeting",
          startTime: start.toISOString(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to create event");
      return data.event as CalendarEvent;
    },
    onSuccess: () => {
      setTitle("");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const events: CalendarEvent[] = eventsQuery.data?.events ?? [];
  const upcoming = events
    .filter((event) => new Date(event.startTime) >= new Date())
    .slice(0, 5);

  const selectedKey = selected.toDateString();
  const dayEvents = events.filter(
    (event) => new Date(event.startTime).toDateString() === selectedKey,
  );

  return (
    <aside className="hidden w-[300px] shrink-0 flex-col border-l border-border bg-card/30 xl:flex">
      <div className="border-b border-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">
            {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
          </p>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
              }
            >
              ‹
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
              }
            >
              ›
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: startWeekday }).map((_, index) => (
            <span key={`pad-${index}`} />
          ))}
          {Array.from({ length: totalDays }).map((_, index) => {
            const day = index + 1;
            const date = new Date(cursor.getFullYear(), cursor.getMonth(), day);
            const isSelected = date.toDateString() === selected.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelected(date)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-xs",
                  isSelected && "bg-primary text-primary-foreground",
                  !isSelected && isToday && "bg-accent",
                  !isSelected && !isToday && "hover:bg-accent/60",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <CalendarDays className="size-4 text-primary" />
          Upcoming
        </div>
        {upcoming.length === 0 ? (
          <p className="mb-4 text-xs text-muted-foreground">No upcoming events.</p>
        ) : (
          <ul className="mb-4 space-y-2">
            {upcoming.map((event) => (
              <li
                key={event.id}
                className="rounded-xl border border-border/70 bg-background/40 px-3 py-2"
              >
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(event.startTime).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
                {event.link ? (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-[11px] text-primary"
                  >
                    <Video className="size-3" />
                    Join
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-2xl border border-border/80 bg-card/50 p-3">
          <p className="mb-2 text-xs font-semibold">
            Add for {selected.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </p>
          <form
            className="space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              createMutation.mutate();
            }}
          >
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Product Sync"
              className="h-9"
            />
            <Input
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="h-9"
            />
            <Button
              type="submit"
              size="sm"
              className="h-9 w-full gap-1.5"
              disabled={createMutation.isPending}
            >
              <Plus className="size-3.5" />
              Add event
            </Button>
          </form>
          {dayEvents.length > 0 ? (
            <ul className="mt-3 space-y-1 border-t border-border/60 pt-3">
              {dayEvents.map((event) => (
                <li key={event.id} className="text-xs text-muted-foreground">
                  {new Date(event.startTime).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  · {event.title}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
