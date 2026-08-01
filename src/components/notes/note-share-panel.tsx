"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronDown,
  Globe2,
  Link2,
  Lock,
  Share2,
  UserPlus,
  X,
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

type ShareRole = "editor" | "viewer";
type AccessMode = "restricted" | "anyone";

type NoteShareMenuProps = {
  noteId: string;
  canShare: boolean;
  noteTitle?: string;
  className?: string;
};

const ROLE_LABEL: Record<ShareRole, string> = {
  editor: "Can edit",
  viewer: "Can view",
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

function statusLabel(status: string) {
  if (status === "pending") return "Invite pending";
  if (status === "accepted") return "Accepted";
  return status;
}

type NoteSharePanelProps = {
  noteTitle?: string;
  me: { name?: string | null; email: string; image?: string | null } | null;
  shares: ShareRow[];
  emails: string;
  inviteRole: ShareRole;
  access: AccessMode;
  error: string | null;
  copied: boolean;
  inviting: boolean;
  rolePending: boolean;
  removePending: boolean;
  onClose: () => void;
  onEmailsChange: (value: string) => void;
  onInviteRoleChange: (role: ShareRole) => void;
  onAccessChange: (access: AccessMode) => void;
  onSubmitInvite: (event: FormEvent) => void;
  onSetRole: (id: string, role: ShareRole) => void;
  onRemoveShare: (id: string) => void;
  onCopyLink: () => void;
};

export function NoteSharePanel({
  noteTitle,
  me,
  shares,
  emails,
  inviteRole,
  access,
  error,
  copied,
  inviting,
  rolePending,
  removePending,
  onClose,
  onEmailsChange,
  onInviteRoleChange,
  onAccessChange,
  onSubmitInvite,
  onSetRole,
  onRemoveShare,
  onCopyLink,
}: NoteSharePanelProps) {
  const title = noteTitle?.trim();

  return (
    <div className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="truncate text-sm font-medium text-foreground">
          {title ? (
            <>
              Share &ldquo;{title}&rdquo;
            </>
          ) : (
            "Share note"
          )}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div className="px-4 pt-3.5">
        <form onSubmit={onSubmitInvite} className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <UserPlus className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={emails}
              onChange={(event) => onEmailsChange(event.target.value)}
              placeholder="Add people by email"
              className="h-9 pl-8 text-[13px]"
              autoComplete="email"
              aria-label="Invite by email"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 shrink-0 gap-1 px-2.5 text-xs"
                />
              }
            >
              {ROLE_LABEL[inviteRole]}
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-36">
              <DropdownMenuItem onClick={() => onInviteRoleChange("editor")}>
                Can edit
                {inviteRole === "editor" ? (
                  <Check className="ml-auto size-3.5" />
                ) : null}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onInviteRoleChange("viewer")}>
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
            className="h-9 shrink-0 px-3"
            disabled={!emails.trim() || inviting}
          >
            {inviting ? "…" : "Invite"}
          </Button>
        </form>
        {error ? (
          <p className="mt-2 text-xs text-destructive">{error}</p>
        ) : null}
      </div>

      <div className="max-h-56 space-y-0.5 overflow-y-auto px-4 pt-3">
        {me ? (
          <div className="flex items-center gap-2.5 py-1.5">
            <Avatar size="default">
              {me.image ? <AvatarImage src={me.image} alt="" /> : null}
              <AvatarFallback className="bg-primary/15 text-[11px] font-semibold text-primary">
                {initials(me.name || me.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-foreground">
                {me.name || "You"}{" "}
                <span className="font-normal text-muted-foreground">(you)</span>
              </p>
              <p className="truncate text-xs text-muted-foreground">{me.email}</p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">Owner</span>
          </div>
        ) : null}

        {shares.map((share) => {
          const role = (share.role === "viewer" ? "viewer" : "editor") as ShareRole;
          return (
            <div key={share.id} className="flex items-center gap-2.5 py-1.5">
              <Avatar size="default">
                <AvatarFallback className="bg-muted text-[11px] font-semibold text-muted-foreground">
                  {initials(share.email)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-foreground">
                  {share.email}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {statusLabel(share.status)}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="flex h-7 shrink-0 items-center gap-1 rounded-md px-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                    />
                  }
                >
                  {ROLE_LABEL[role]}
                  <ChevronDown className="size-3.5 opacity-60" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-36">
                  <DropdownMenuItem
                    disabled={role === "editor" || rolePending}
                    onClick={() => onSetRole(share.id, "editor")}
                  >
                    Can edit
                    {role === "editor" ? (
                      <Check className="ml-auto size-3.5" />
                    ) : null}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={role === "viewer" || rolePending}
                    onClick={() => onSetRole(share.id, "viewer")}
                  >
                    Can view
                    {role === "viewer" ? (
                      <Check className="ml-auto size-3.5" />
                    ) : null}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={removePending}
                    onClick={() => onRemoveShare(share.id)}
                  >
                    Remove access
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>

      <div className="mx-4 mt-3 border-t border-border pt-3">
        <p className="mb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          General access
        </p>
        <div className="flex items-center gap-2.5 pb-1">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {access === "restricted" ? (
              <Lock className="size-3.5" />
            ) : (
              <Globe2 className="size-3.5" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="inline-flex max-w-full items-center gap-1 text-left text-[13px] font-medium text-foreground hover:opacity-80"
                  />
                }
              >
                <span className="truncate">
                  {access === "restricted"
                    ? "Only people invited"
                    : "Anyone with the link"}
                </span>
                <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-56">
                <DropdownMenuItem onClick={() => onAccessChange("restricted")}>
                  Only people invited
                  {access === "restricted" ? (
                    <Check className="ml-auto size-3.5" />
                  ) : null}
                </DropdownMenuItem>
                <DropdownMenuItem disabled onClick={() => onAccessChange("anyone")}>
                  Anyone with the link
                  {access === "anyone" ? (
                    <Check className="ml-auto size-3.5" />
                  ) : null}
                </DropdownMenuItem>
                <p className="px-2 py-1.5 text-[11px] leading-snug text-muted-foreground">
                  Public link sharing isn&apos;t available yet.
                </p>
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {access === "restricted"
                ? "Invited people can open this with their account."
                : "Anyone who has the link can view this note."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2 border-t border-border px-4 py-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCopyLink}
          className="gap-1.5 text-xs"
        >
          {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
          {copied ? "Link copied" : "Copy link"}
        </Button>
        <Button type="button" size="sm" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}

export function NoteShareMenu({
  noteId,
  canShare,
  noteTitle,
  className,
}: NoteShareMenuProps) {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState("");
  const [inviteRole, setInviteRole] = useState<ShareRole>("editor");
  const [access, setAccess] = useState<AccessMode>("restricted");
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
    mutationFn: async ({ id, role }: { id: string; role: ShareRole }) => {
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

  const me = session?.user ?? null;
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
        className="w-[min(100vw-1.5rem,22.5rem)] gap-0 overflow-hidden rounded-xl p-0 shadow-lg ring-1 ring-border/60"
      >
        <NoteSharePanel
          noteTitle={noteTitle}
          me={me}
          shares={shares}
          emails={emails}
          inviteRole={inviteRole}
          access={access}
          error={error}
          copied={copied}
          inviting={inviteMutation.isPending}
          rolePending={roleMutation.isPending}
          removePending={removeMutation.isPending}
          onClose={() => setOpen(false)}
          onEmailsChange={(value) => {
            setEmails(value);
            if (error) setError(null);
          }}
          onInviteRoleChange={setInviteRole}
          onAccessChange={setAccess}
          onSubmitInvite={submitInvite}
          onSetRole={(id, role) => roleMutation.mutate({ id, role })}
          onRemoveShare={(id) => removeMutation.mutate(id)}
          onCopyLink={copyLink}
        />
      </PopoverContent>
    </Popover>
  );
}
