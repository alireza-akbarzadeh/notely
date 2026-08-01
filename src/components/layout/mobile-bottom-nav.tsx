"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, CheckSquare, NotebookPen, Plus, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { notePath, workspacePath } from "@/lib/workspace/paths";
import type { SpaceSummary } from "@/types/notes";

export function MobileBottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const view = searchParams.get("view");
  const isNoteEditor = /^\/notes\/[^/]+$/.test(pathname);

  const spacesQuery = useQuery({
    queryKey: ["spaces"],
    enabled: !isNoteEditor,
    queryFn: async (): Promise<{ spaces: SpaceSummary[] }> => {
      const response = await fetch("/api/spaces");
      if (!response.ok) throw new Error("Failed to load spaces");
      return response.json();
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: async (spaceId: string) => {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId, title: "Untitled" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to create note");
      return data.note as { id: string };
    },
    onSuccess: (note) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push(notePath(note.id));
    },
  });

  if (isNoteEditor) return null;

  const defaultSpaceId = spacesQuery.data?.spaces[0]?.id;
  const items = [
    {
      href: workspacePath(),
      label: "Notes",
      icon: NotebookPen,
      active:
        (pathname.startsWith("/workspace") || pathname.startsWith("/notes")) &&
        view !== "favorites" &&
        view !== "integration",
    },
    {
      href: "/calendar",
      label: "Calendar",
      icon: CalendarDays,
      active: pathname.startsWith("/calendar"),
    },
    {
      href: "/tasks",
      label: "Tasks",
      icon: CheckSquare,
      active: pathname.startsWith("/tasks"),
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname.startsWith("/settings"),
    },
  ] as const;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card shadow-[0_-10px_28px_rgba(0,0,0,0.28)] md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5 gap-1 px-2 py-2.5">
        {items.map(({ href, label, icon: Icon, active }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium transition-colors",
              active
                ? "bg-primary/15 text-primary"
                : "bg-muted/40 text-muted-foreground active:bg-muted/70",
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
        <button
          type="button"
          disabled={!defaultSpaceId || createNoteMutation.isPending}
          onClick={() => defaultSpaceId && createNoteMutation.mutate(defaultSpaceId)}
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl bg-primary text-[11px] font-medium text-primary-foreground shadow-sm"
        >
          <Plus className="size-5" />
          New
        </button>
      </div>
    </nav>
  );
}
