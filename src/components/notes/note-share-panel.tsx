"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronDown,
  CircleHelp,
  Globe,
  Link2,
  Lock,
  Share2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth/client";
import { readJson } from "@/lib/api/read-json";
import { notePath } from "@/lib/workspace/paths";
import { cn } from "@/lib/utils";

type ShareRow = {
  id: string;
  email: string;
  role: string;
  status: string;
};

type NoteShareMenuProps = {
  noteId: string;
  canShare: boolean;
  className?: string;
};

function initials(nameOrEmail: string) {
  const base = nameOrEmail.trim();
  if (!base) return "?";
  if (base.includes("@")) return base[0]!.toUpperCase();
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  }
  return base.slice(0, 2).toUpperCase();
}

function roleLabel(role: string) {
  if (role === "viewer") return "Can view";
  return "Can edit";
}

function statusLabel(status: string) {
  if (status === "pending") return "Invite pending";
  if (status === "accepted") return "Accepted";
  return status;
}

export function NoteShareMenu({
  noteId,
  canShare,
  className,
}: NoteShareMenuProps) {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("editor");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sharesQuery = useQuery({
    queryKey: ["shares", noteId],
    enabled: canShare && open,
    queryFn: async (): Promise<{ shares: ShareRow[] }> =>
      readJson<{ shares: ShareRow[] }>(
        await fetch(`/api/shares?noteId=${encodeURIComponent(noteId)}`),
        "Failed to load shares",
      ),
  });

  const inviteMutation = useMutation({
    mutationFn: async (targets: string[]) => {
      const results: ShareRow[] = [];
      for (const email of targets) {
        const response = await fetch("/api/shares", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ noteId, email, role: inviteRole }),
        });
        const data = await readJson<{ share: ShareRow }>(
          response,
          "Invite failed",
        );
        results.push(data.share);
      }
      return results;
    },
    onSuccess: () => {
      setEmails("");
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["shares", noteId] });
    },
    onError: (mutationError) => {
      setError(
        mutationError instanceof Error ? mutationError.message : "Invite failed",
      );
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({
      id,
      role,
    }: {
      id: string;
      role: "editor" | "viewer";
    }) => {
      const response = await fetch(`/api/shares/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      return readJson<{ share: ShareRow }>(response, "Failed to update role");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shares", noteId] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/shares/${id}`, { method: "DELETE" });
      await readJson(response, "Failed to remove");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shares", noteId] });
    },
  });

  const me = session?.user;
  const shares = sharesQuery.data?.shares ?? [];
  const noteUrl = useMemo(() => {
    if (typeof window === "undefined") return notePath(noteId);
    return `${window.location.origin}${notePath(noteId)}`;
  }, [noteId]);

  if (!canShare) return null;

  function submitInvite(event: FormEvent) {
    event.preventDefault();
    const targets = emails
      .split(/[,;\s]+/)
      .map((value) => value.trim())
      .filter(Boolean);
    if (targets.length === 0) return;
    inviteMutation.mutate(targets);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(noteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy link");
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "size-8 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
              open && "bg-accent text-foreground",
              className,
            )}
            aria-label="Share note"
          />
        }
      >
        <Share2 className="size-3.5" />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(100vw-1.5rem,24rem)] gap-0 overflow-hidden rounded-xl p-0 shadow-lg ring-1 ring-border/60"
      >
        <Tabs defaultValue="share" className="gap-0">
          <div className="border-b border-border px-4 pt-2">
            <TabsList
              variant="line"
              className="h-9 w-full justify-start gap-5 rounded-none bg-transparent p-0"
            >
              <TabsTrigger
                value="share"
                className="rounded-none px-0 pb-2.5 text-sm data-active:text-foreground"
              >
                Share
              </TabsTrigger>
              <TabsTrigger
                value="publish"
                className="rounded-none px-0 pb-2.5 text-sm data-active:text-foreground"
              >
                Publish
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="rounded-none px-0 pb-2.5 text-sm data-active:text-foreground"
              >
                Advanced
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="share" className="mt-0 px-4 pt-3.5 pb-0">
            <form className="flex items-center gap-2" onSubmit={submitInvite}>
              <Input
                value={emails}
                onChange={(event) => {
                  setEmails(event.target.value);
                  if (error) setError(null);
                }}
                placeholder="Email or group, separated by commas"
                className="h-9 flex-1 rounded-lg border-input bg-background text-sm"
                autoComplete="email"
                aria-label="Invite by email"
              />
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="hidden h-9 shrink-0 gap-1 rounded-lg px-2.5 text-xs sm:inline-flex"
                    />
                  }
                >
                  {roleLabel(inviteRole)}
                  <ChevronDown className="size-3.5 opacity-60" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-36">
                  <DropdownMenuItem onClick={() => setInviteRole("editor")}>
                    Can edit
                    {inviteRole === "editor" ? (
                      <Check className="ml-auto size-3.5" />
                    ) : null}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setInviteRole("viewer")}>
                    Can view
                    {inviteRole === "viewer" ? (
                      <Check className="ml-auto size-3.5" />
                    ) : null}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                type="submit"
                size="sm"
                className="h-9 shrink-0 rounded-lg px-3.5"
                disabled={!emails.trim() || inviteMutation.isPending}
              >
                {inviteMutation.isPending ? "…" : "Share"}
              </Button>
            </form>
            {error ? (
              <p className="mt-2 text-xs text-destructive">{error}</p>
            ) : null}

            <ul className="mt-4 max-h-52 space-y-0.5 overflow-y-auto">
              {me ? (
                <li className="flex items-center gap-2.5 rounded-lg px-0.5 py-1.5">
                  <Avatar size="default">
                    {me.image ? (
                      <AvatarImage src={me.image} alt="" />
                    ) : null}
                    <AvatarFallback className="bg-primary/15 text-[11px] font-semibold text-primary">
                      {initials(me.name || me.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {me.name || "You"}{" "}
                      <span className="font-normal text-muted-foreground">
                        (You)
                      </span>
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {me.email}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 shrink-0 gap-1 px-2 text-xs text-muted-foreground"
                        />
                      }
                    >
                      Full access
                      <ChevronDown className="size-3.5 opacity-60" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-40">
                      <DropdownMenuItem disabled>
                        Full access
                        <Check className="ml-auto size-3.5" />
                      </DropdownMenuItem>
                      <p className="px-2 py-1.5 text-[11px] leading-snug text-muted-foreground">
                        Owners always keep full access to their notes.
                      </p>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ) : null}

              {shares.map((share) => (
                <li
                  key={share.id}
                  className="flex items-center gap-2.5 rounded-lg px-0.5 py-1.5"
                >
                  <Avatar size="default">
                    <AvatarFallback className="bg-muted text-[11px] font-semibold text-muted-foreground">
                      {initials(share.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {share.email}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {statusLabel(share.status)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 shrink-0 gap-1 px-2 text-xs text-muted-foreground"
                        />
                      }
                    >
                      {roleLabel(share.role)}
                      <ChevronDown className="size-3.5 opacity-60" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-36">
                      <DropdownMenuItem
                        disabled={
                          share.role === "editor" || roleMutation.isPending
                        }
                        onClick={() =>
                          roleMutation.mutate({
                            id: share.id,
                            role: "editor",
                          })
                        }
                      >
                        Can edit
                        {share.role === "editor" ? (
                          <Check className="ml-auto size-3.5" />
                        ) : null}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={
                          share.role === "viewer" || roleMutation.isPending
                        }
                        onClick={() =>
                          roleMutation.mutate({
                            id: share.id,
                            role: "viewer",
                          })
                        }
                      >
                        Can view
                        {share.role === "viewer" ? (
                          <Check className="ml-auto size-3.5" />
                        ) : null}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        disabled={removeMutation.isPending}
                        onClick={() => removeMutation.mutate(share.id)}
                      >
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
            </ul>

            <div className="mt-3 border-t border-border pt-3">
              <p className="mb-2 text-[11px] font-medium text-muted-foreground">
                General access
              </p>
              <div className="flex items-center gap-2.5 px-0.5 py-1">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Lock className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          type="button"
                          className="inline-flex max-w-full items-center gap-1 text-left text-sm font-medium text-foreground hover:opacity-90"
                        />
                      }
                    >
                      <span className="truncate">Only people invited</span>
                      <ChevronDown className="size-3.5 shrink-0 opacity-60" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-52">
                      <DropdownMenuItem disabled>
                        Only people invited
                        <Check className="ml-auto size-3.5" />
                      </DropdownMenuItem>
                      <p className="px-2 py-1.5 text-[11px] leading-snug text-muted-foreground">
                        Anyone with the link isn&apos;t available yet.
                      </p>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Invited people open this note with their Notely account.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-border py-3">
              <span
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
                title="Invite registered Notely users by email. Editors can update the note and checklist; viewers can read only."
              >
                <CircleHelp className="size-3.5" />
                Learn about sharing
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-2.5 text-xs"
                onClick={copyLink}
              >
                {copied ? (
                  <Check className="size-3.5" />
                ) : (
                  <Link2 className="size-3.5" />
                )}
                {copied ? "Copied" : "Copy link"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="publish" className="mt-0 space-y-3 px-4 py-4">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Globe className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium">Publish to web</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Public publishing isn&apos;t available yet. Use Share to invite
                  people by email for now.
                </p>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" disabled>
              Publish
            </Button>
          </TabsContent>

          <TabsContent value="advanced" className="mt-0 space-y-3 px-4 py-4">
            <div>
              <p className="text-sm font-medium">Note link</p>
              <p className="mt-1 break-all rounded-lg bg-muted/50 px-2.5 py-2 font-mono text-[11px] text-muted-foreground">
                {noteUrl}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={copyLink}
            >
              <Link2 className="size-3.5" />
              {copied ? "Copied" : "Copy link"}
            </Button>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
