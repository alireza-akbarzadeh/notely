"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import type { CalendarEvent } from "@/components/calendar/types";
import {
  HOUR_HEIGHT,
  HOURS,
  addDays,
  eventHeightPx,
  eventTopPx,
  formatHour,
  isSameDay,
  weekDays,
} from "@/components/calendar/utils";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CalendarWeekViewProps = {
  anchor: Date;
  events: CalendarEvent[];
  sidebarsOpen: boolean;
  onToggleSidebars: () => void;
  onAnchorChange: (date: Date) => void;
  onCreateAt: (date: Date) => void;
  onRequestDeleteEvent: (event: CalendarEvent) => void;
};

export function CalendarWeekView({
  anchor,
  events,
  sidebarsOpen,
  onToggleSidebars,
  onAnchorChange,
  onCreateAt,
  onRequestDeleteEvent,
}: CalendarWeekViewProps) {
  const days = useMemo(() => weekDays(anchor, 7), [anchor]);
  const today = new Date();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const showNowLine = days.some((d) => isSameDay(d, now));
  const nowTop = eventTopPx(now);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={onToggleSidebars}
          aria-label={sidebarsOpen ? "Hide sidebars" : "Show sidebars"}
        >
          {sidebarsOpen ? (
            <PanelLeftClose className="size-4" />
          ) : (
            <PanelLeftOpen className="size-4" />
          )}
        </Button>

        <div className="min-w-0 flex-1" />

        <UserMenu variant="appbar" />

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs"
          disabled
        >
          Week
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs"
          onClick={() => onAnchorChange(new Date())}
        >
          Today
        </Button>

        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => onAnchorChange(addDays(anchor, -7))}
            aria-label="Previous week"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => onAnchorChange(addDays(anchor, 7))}
            aria-label="Next week"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </header>

      <div className="flex shrink-0 border-b border-border">
        <div className="w-14 shrink-0 border-r border-border" />
        <div className="grid min-w-0 flex-1 grid-cols-7">
          {days.map((day) => {
            const isToday = isSameDay(day, today);
            return (
              <div
                key={day.toISOString()}
                className="flex flex-col items-center border-r border-border py-2 last:border-r-0"
              >
                <span className="text-[11px] text-muted-foreground">
                  {day.toLocaleDateString(undefined, { weekday: "short" })}
                </span>
                <span
                  className={cn(
                    "mt-0.5 flex size-8 items-center justify-center text-sm font-medium",
                    isToday &&
                      "rounded-full bg-destructive text-white shadow-sm",
                  )}
                >
                  {day.getDate()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="relative flex" style={{ height: HOURS.length * HOUR_HEIGHT }}>
          <div className="sticky left-0 z-10 w-14 shrink-0 border-r border-border bg-background">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="relative border-b border-border/40"
                style={{ height: HOUR_HEIGHT }}
              >
                {hour > 0 ? (
                  <span className="absolute -top-2 right-2 text-[10px] text-muted-foreground tabular-nums">
                    {formatHour(hour)}
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="relative grid min-w-0 flex-1 grid-cols-7">
            {days.map((day) => {
              const dayEvents = events.filter((event) =>
                isSameDay(new Date(event.startTime), day),
              );
              return (
                <div
                  key={day.toISOString()}
                  className="relative border-r border-border last:border-r-0"
                >
                  {HOURS.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      className="block w-full border-b border-border/40 transition-colors hover:bg-muted/30"
                      style={{ height: HOUR_HEIGHT }}
                      aria-label={`Create event on ${day.toDateString()} at ${formatHour(hour)}`}
                      onClick={() => {
                        const at = new Date(day);
                        at.setHours(hour, 0, 0, 0);
                        onCreateAt(at);
                      }}
                    />
                  ))}

                  {dayEvents.map((event) => {
                    const start = new Date(event.startTime);
                    const end = event.endTime
                      ? new Date(event.endTime)
                      : null;
                    return (
                      <button
                        key={event.id}
                        type="button"
                        title="Click to delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRequestDeleteEvent(event);
                        }}
                        className="absolute right-1 left-1 z-[1] overflow-hidden rounded-md border border-primary/30 bg-primary/20 px-1.5 py-1 text-left shadow-sm transition-opacity hover:opacity-90"
                        style={{
                          top: eventTopPx(start),
                          height: eventHeightPx(start, end),
                        }}
                      >
                        <p className="truncate text-[11px] font-semibold text-foreground">
                          {event.title}
                        </p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {start.toLocaleTimeString(undefined, {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {showNowLine ? (
              <div
                className="pointer-events-none absolute right-0 left-0 z-[2]"
                style={{ top: nowTop }}
              >
                <div className="flex items-center">
                  <span className="size-2.5 shrink-0 rounded-full bg-destructive" />
                  <div className="h-px flex-1 bg-destructive" />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
