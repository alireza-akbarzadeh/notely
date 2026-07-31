"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type SearchHit = {
  id: string;
  title: string;
  summary: string | null;
  updatedAt: string;
};

export function NoteSearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }
    function onOpenSearch() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("notely:open-search", onOpenSearch);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("notely:open-search", onOpenSearch);
    };
  }, []);

  const searchQuery = useQuery({
    queryKey: ["search", query],
    enabled: open && query.trim().length > 0,
    queryFn: async (): Promise<{ notes: SearchHit[] }> => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search failed");
      return response.json();
    },
  });

  const hits: SearchHit[] = searchQuery.data?.notes ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border px-4 py-3">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Search className="size-4" />
            Search notes
          </DialogTitle>
        </DialogHeader>
        <div className="p-3">
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles and content…"
            className="h-10"
          />
        </div>
        <ul className="max-h-72 overflow-y-auto border-t border-border">
          {query.trim() && hits.length === 0 && !searchQuery.isFetching ? (
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">
              No notes found
            </li>
          ) : null}
          {hits.map((hit) => (
            <li key={hit.id}>
              <button
                type="button"
                className="w-full px-4 py-3 text-left hover:bg-accent/50"
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                  router.push(`/notes/${hit.id}`);
                }}
              >
                <p className="truncate text-sm font-medium">{hit.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {hit.summary || "No preview"}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
