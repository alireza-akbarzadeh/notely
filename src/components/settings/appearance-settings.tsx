"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  {
    value: "light",
    label: "Light",
    description: "Bright surfaces for daytime writing",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Charcoal canvas with warm accents",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Match your device preference",
    icon: Monitor,
  },
] as const;

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>
          Switch between light and dark, or follow your system setting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          {THEME_OPTIONS.map(({ value, label, description, icon: Icon }) => {
            const active = mounted && theme === value;
            return (
              <button
                key={value}
                type="button"
                disabled={!mounted}
                onClick={() => setTheme(value)}
                aria-pressed={active}
                className={cn(
                  "flex flex-col items-start gap-3 rounded-xl border px-3.5 py-3.5 text-left transition-colors",
                  "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border-primary/60 bg-primary/10 ring-1 ring-primary/30"
                    : "border-border/80 bg-background/40",
                  !mounted && "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="space-y-0.5">
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="block text-xs text-muted-foreground">
                    {description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
