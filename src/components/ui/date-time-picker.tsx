"use client";

import { useMemo } from "react";

import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type DateTimePickerProps = {
  value: Date;
  onChange: (next: Date) => void;
  minDate?: Date;
  className?: string;
  id?: string;
};

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTE_STEP = 5;
const STEPPED_MINUTES = Array.from(
  { length: 60 / MINUTE_STEP },
  (_, i) => i * MINUTE_STEP,
);
const PERIODS = ["AM", "PM"] as const;

type Period = (typeof PERIODS)[number];

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getHour12(date: Date) {
  const hour = date.getHours() % 12;
  return hour === 0 ? 12 : hour;
}

function getPeriod(date: Date): Period {
  return date.getHours() >= 12 ? "PM" : "AM";
}

function withDateParts(
  current: Date,
  patch: { date?: Date; hour12?: number; minute?: number; period?: Period },
) {
  const next = new Date(current);
  if (patch.date) {
    next.setFullYear(
      patch.date.getFullYear(),
      patch.date.getMonth(),
      patch.date.getDate(),
    );
  }

  const hour12 = patch.hour12 ?? getHour12(current);
  const period = patch.period ?? getPeriod(current);
  const minute = patch.minute ?? current.getMinutes();
  const hour24 = (hour12 % 12) + (period === "PM" ? 12 : 0);

  next.setHours(hour24, minute, 0, 0);
  return next;
}

export function DateTimePicker({
  value,
  onChange,
  minDate,
  className,
  id,
}: DateTimePickerProps) {
  const selected = useMemo(() => new Date(value), [value]);
  const hour = getHour12(selected);
  const minute = selected.getMinutes();
  const period = getPeriod(selected);
  const disabledBefore = minDate ? startOfDay(minDate) : undefined;

  // Presets can land on any minute, so keep the exact value selectable.
  const minuteOptions = useMemo(
    () =>
      STEPPED_MINUTES.includes(minute)
        ? STEPPED_MINUTES
        : [...STEPPED_MINUTES, minute].sort((a, b) => a - b),
    [minute],
  );

  return (
    <div
      id={id}
      className={cn(
        "w-fit overflow-hidden rounded-xl border border-border/70 bg-card/30",
        className,
      )}
    >
      <Calendar
        mode="single"
        selected={selected}
        onSelect={(date) => {
          if (!date) return;
          onChange(withDateParts(selected, { date }));
        }}
        disabled={disabledBefore ? { before: disabledBefore } : undefined}
        defaultMonth={selected}
        className="mx-auto bg-transparent p-3 [--cell-size:--spacing(8)]"
      />

      <div className="flex items-center gap-2 border-t border-border/70 bg-muted/30 px-3 py-2.5">
        <Select
          value={String(hour)}
          onValueChange={(next) => {
            if (next == null) return;
            onChange(
              withDateParts(selected, { hour12: Number.parseInt(next, 10) }),
            );
          }}
        >
          <SelectTrigger className="w-16 justify-center tabular-nums" aria-label="Hour">
            <SelectValue>{(item) => pad(Number(item))}</SelectValue>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} className="min-w-16">
            {HOURS.map((item) => (
              <SelectItem key={item} value={String(item)}>
                {pad(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground">:</span>

        <Select
          value={String(minute)}
          onValueChange={(next) => {
            if (next == null) return;
            onChange(
              withDateParts(selected, { minute: Number.parseInt(next, 10) }),
            );
          }}
        >
          <SelectTrigger className="w-16 justify-center tabular-nums" aria-label="Minute">
            <SelectValue>{(item) => pad(Number(item))}</SelectValue>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} className="min-w-16">
            {minuteOptions.map((item) => (
              <SelectItem key={item} value={String(item)}>
                {pad(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div
          role="group"
          aria-label="AM or PM"
          className="ml-auto flex rounded-lg border border-input p-0.5"
        >
          {PERIODS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={period === item}
              onClick={() => onChange(withDateParts(selected, { period: item }))}
              className={cn(
                "rounded-[calc(var(--radius-lg)-3px)] px-2.5 py-1 text-xs font-medium transition-colors",
                period === item
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
