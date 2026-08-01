"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Check, Inbox, X } from "lucide-react";

import { NotesEmptyState } from "@/components/notes/notes-empty-state";
import { Button } from "@/components/ui/button";

type Invite = {
  id: string;
  noteId: string;
  noteTitle?: string;
  inviterName?: string;
  role: string;
  email: string;
};

export function InboxPanel() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const inboxQuery = useQuery({
    queryKey: ["inbox"],
    queryFn: async (): Promise<{ invites: Invite[] }> => {
      const response = await fetch("/api/inbox");
      if (!response.ok) throw new Error("Failed to load inbox");
      return response.json();
    },
  });

  const respondMutation = useMutation({
    mutationFn: async (input: { id: string; action: "accept" | "decline" }) => {
      const response = await fetch(`/api/shares/${input.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: input.action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed");
      return { ...data, action: input.action, noteId: data.share?.noteId as string | undefined };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["inbox"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      if (result.action === "accept") {
        const noteId =
          result.share && typeof result.share === "object" && "noteId" in result.share
            ? String((result.share as { noteId?: string }).noteId ?? "")
            : "";
        if (noteId) router.push(`/notes/${noteId}`);
      }
    },
  });

  const invites: Invite[] = inboxQuery.data?.invites ?? [];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <Inbox className="size-4 text-primary" />
        <div>
          <p className="text-sm font-semibold">Inbox</p>
          <p className="text-xs text-muted-foreground">
            {invites.length} pending invite{invites.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-4">
        {inboxQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : invites.length === 0 ? (
          <NotesEmptyState variant="inbox" className="min-h-[50vh]" />
        ) : (
          <ul className="space-y-3">
            {invites.map((invite) => (
              <li
                key={invite.id}
                className="rounded-2xl border border-border/80 bg-card/40 p-4"
              >
                <p className="text-sm font-semibold">
                  {invite.noteTitle ?? "Shared note"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {invite.inviterName ?? "Someone"} invited you as {invite.role}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    className="h-9 gap-1.5"
                    disabled={respondMutation.isPending}
                    onClick={() =>
                      respondMutation.mutate({ id: invite.id, action: "accept" })
                    }
                  >
                    <Check className="size-3.5" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 gap-1.5"
                    disabled={respondMutation.isPending}
                    onClick={() =>
                      respondMutation.mutate({ id: invite.id, action: "decline" })
                    }
                  >
                    <X className="size-3.5" />
                    Decline
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
