"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Share2, Trash2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ShareRow = {
  id: string;
  email: string;
  role: string;
  status: string;
};

type NoteSharePanelProps = {
  noteId: string;
  canShare: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

export function NoteShareTrigger({
  open,
  onOpenChange,
  canShare,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canShare: boolean;
  className?: string;
}) {
  if (!canShare) return null;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "size-8 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
        open && "bg-accent text-foreground",
        className,
      )}
      onClick={() => onOpenChange(!open)}
      aria-label="Share note"
      aria-pressed={open}
    >
      <Share2 className="size-3.5" />
    </Button>
  );
}

export function NoteSharePanel({
  noteId,
  canShare,
  open,
  onOpenChange,
  className,
}: NoteSharePanelProps) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const sharesQuery = useQuery({
    queryKey: ["shares", noteId],
    enabled: canShare && open,
    queryFn: async (): Promise<{ shares: ShareRow[] }> => {
      const response = await fetch(
        `/api/shares?noteId=${encodeURIComponent(noteId)}`,
      );
      if (!response.ok) throw new Error("Failed to load shares");
      return response.json();
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId, email, role: "editor" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Invite failed");
      return data.share as ShareRow;
    },
    onSuccess: () => {
      setEmail("");
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["shares", noteId] });
    },
    onError: (mutationError) => {
      setError(
        mutationError instanceof Error ? mutationError.message : "Invite failed",
      );
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/shares/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to remove");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shares", noteId] });
    },
  });

  if (!canShare || !open) return null;

  const shares: ShareRow[] = sharesQuery.data?.shares ?? [];

  return (
    <div
      className={cn(
        "border-b border-border bg-panel-elevated px-4 py-4 md:px-6",
        className,
      )}
    >
      <div className="mx-auto max-w-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Collaborate</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Invite a registered Notely user by email. Editors can update the
              note and checklist.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>

        <form
          className="mt-3 flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            if (!email.trim()) return;
            inviteMutation.mutate();
          }}
        >
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="colleague@notely.app"
            className="h-10"
          />
          <Button
            type="submit"
            className="h-10 gap-1.5"
            disabled={!email.trim() || inviteMutation.isPending}
          >
            <UserPlus className="size-3.5" />
            Invite
          </Button>
        </form>
        {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}

        <ul className="mt-4 space-y-2">
          {shares.map((share) => (
            <li
              key={share.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-border/60 px-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{share.email}</p>
                <p className="text-[11px] text-muted-foreground">
                  {share.role} · {share.status}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => removeMutation.mutate(share.id)}
                aria-label="Remove collaborator"
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
