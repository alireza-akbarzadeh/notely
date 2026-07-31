"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

type ThemeToggleProps = {
  className?: string;
  compact?: boolean;
};

export function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-10 w-full animate-pulse rounded-xl bg-muted/60",
          compact && "h-9 w-[9.5rem]",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn(
        "inline-flex rounded-xl border border-border/80 bg-muted/40 p-1",
        className,
      )}
      role="group"
      aria-label="Color theme"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <Button
            key={value}
            type="button"
            variant="ghost"
            size={compact ? "sm" : "default"}
            className={cn(
              "h-8 gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground",
              active && "bg-background text-foreground shadow-sm",
            )}
            onClick={() => setTheme(value)}
            aria-pressed={active}
          >
            <Icon className="size-3.5" />
            {compact ? null : label}
            {compact ? <span className="sr-only">{label}</span> : null}
          </Button>
        );
      })}
    </div>
  );
}

/** Icon button that cycles light → dark → system for the app bar. */
export function ThemeModeButton({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("size-9", className)}
        disabled
        aria-label="Theme"
      >
        <Sun className="size-4 opacity-40" />
      </Button>
    );
  }

  const current = theme ?? "system";
  const Icon =
    current === "system" ? Monitor : resolvedTheme === "dark" ? Moon : Sun;
  const next =
    current === "light" ? "dark" : current === "dark" ? "system" : "light";
  const label =
    current === "light"
      ? "Light mode"
      : current === "dark"
        ? "Dark mode"
        : "System theme";

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("size-9", className)}
            onClick={() => setTheme(next)}
            aria-label={`${label}. Click for ${next}`}
          />
        }
      >
        <Icon className="size-4" />
      </TooltipTrigger>
      <TooltipContent>{label} · click to switch</TooltipContent>
    </Tooltip>
  );
}
