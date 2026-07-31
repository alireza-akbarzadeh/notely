"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotebookPen, Plus, Settings, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SpaceSummary } from "@/types/notes";

export function MobileBottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const view = searchParams.get("view");

  const spacesQuery = useQuery({
    queryKey: ["spaces"],
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
      router.push(`/notes/${note.id}`);
    },
  });

  const defaultSpaceId = spacesQuery.data?.spaces[0]?.id;
  const items = [
    {
      href: "/notes",
      label: "Notes",
      icon: NotebookPen,
      active: pathname.startsWith("/notes") && view !== "favorites",
    },
    {
      href: "/notes?view=favorites",
      label: "Saved",
      icon: Star,
      active: view === "favorites",
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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-4 gap-1 px-2 py-2">
        {items.map(({ href, label, icon: Icon, active }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium",
              active ? "bg-accent text-foreground" : "text-muted-foreground",
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
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl bg-primary text-[11px] font-medium text-primary-foreground"
        >
          <Plus className="size-5" />
          New
        </button>
      </div>
    </nav>
  );
}
