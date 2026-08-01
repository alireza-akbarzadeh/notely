"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { daysInMonth, isSameDay, startOfMonth } from "./utils";

type CalendarMiniMonthProps = {
  cursor: Date;
  selected: Date;
  onCursorChange: (date: Date) => void;
  onSelect: (date: Date) => void;
};

export function CalendarMiniMonth({
  cursor,
  selected,
  onCursorChange,
  onSelect,
}: CalendarMiniMonthProps) {
  const monthStart = startOfMonth(cursor);
  const totalDays = daysInMonth(cursor);
  const startWeekday = (monthStart.getDay() + 6) % 7;
  const today = new Date();

  return (
    <div className="px-3 pt-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium tracking-tight">
          {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </p>
        <div className="flex gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() =>
              onCursorChange(
                new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1),
              )
            }
            aria-label="Previous month"
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() =>
              onCursorChange(
                new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1),
              )
            }
            aria-label="Next month"
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-muted-foreground">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
          <span key={`${day}-${i}`} className="py-1">
            {day}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: startWeekday }).map((_, index) => (
          <span key={`pad-${index}`} />
        ))}
        {Array.from({ length: totalDays }).map((_, index) => {
          const day = index + 1;
          const date = new Date(cursor.getFullYear(), cursor.getMonth(), day);
          const selectedDay = isSameDay(date, selected);
          const isToday = isSameDay(date, today);
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelect(date)}
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-xs transition-colors",
                selectedDay && "bg-primary text-primary-foreground",
                !selectedDay && isToday && "bg-destructive text-white",
                !selectedDay && !isToday && "hover:bg-muted",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
