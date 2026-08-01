"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Archive,
  BookOpen,
  CalendarDays,
  CheckSquare,
  FolderOpen,
  Inbox,
  Moon,
  NotebookPen,
  Pencil,
  Plus,
  Settings,
  Star,
  Trash2,
} from "lucide-react";

import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useFocusMode } from "@/stores/focus-mode";
import type { NoteSummary, SpaceSummary } from "@/types/notes";

async function fetchSpaces(): Promise<{ spaces: SpaceSummary[] }> {
  const response = await fetch("/api/spaces");
  if (!response.ok) throw new Error("Failed to load spaces");
  return (await response.json()) as { spaces: SpaceSummary[] };
}

export function AppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const view = searchParams.get("view");
  const activeSpaceId = searchParams.get("spaceId");
  const [createSpaceOpen, setCreateSpaceOpen] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const [createSpaceError, setCreateSpaceError] = useState<string | null>(null);
  const [renameSpace, setRenameSpace] = useState<SpaceSummary | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameError, setRenameError] = useState<string | null>(null);
  const focusMode = useFocusMode();

  const spacesQuery = useQuery({
    queryKey: ["spaces"],
    queryFn: fetchSpaces,
  });

  const notesCountQuery = useQuery({
    queryKey: ["notes", "stats"],
    queryFn: async (): Promise<{ notes: NoteSummary[] }> => {
      const response = await fetch("/api/notes");
      if (!response.ok) throw new Error("Failed to load notes");
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

  const createSpaceMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch("/api/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to create space");
      return data.space as SpaceSummary;
    },
    onSuccess: (space) => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      setCreateSpaceOpen(false);
      setSpaceName("");
      setCreateSpaceError(null);
      if (space) router.push(`/notes?spaceId=${space.id}`);
    },
    onError: (error) => {
      setCreateSpaceError(
        error instanceof Error ? error.message : "Failed to create space",
      );
    },
  });

  const renameSpaceMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await fetch(`/api/spaces/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to rename space");
      return data.space as SpaceSummary;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      setRenameSpace(null);
      setRenameValue("");
      setRenameError(null);
    },
    onError: (error) => {
      setRenameError(
        error instanceof Error ? error.message : "Failed to rename space",
      );
    },
  });

  const favoriteSpaceMutation = useMutation({
    mutationFn: async ({
      id,
      isFavorite,
    }: {
      id: string;
      isFavorite: boolean;
    }) => {
      const response = await fetch(`/api/spaces/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to update space");
      return data.space as SpaceSummary;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
  });

  const deleteSpaceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/spaces/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to delete space");
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      if (activeSpaceId === id) router.push("/notes");
    },
  });

  function openCreateSpaceDialog() {
    setSpaceName("");
    setCreateSpaceError(null);
    setCreateSpaceOpen(true);
  }

  function openRenameDialog(space: SpaceSummary) {
    setRenameSpace(space);
    setRenameValue(space.name);
    setRenameError(null);
  }

  function submitCreateSpace(event: React.FormEvent) {
    event.preventDefault();
    const name = spaceName.trim();
    if (!name) {
      setCreateSpaceError("Enter a space name");
      return;
    }
    setCreateSpaceError(null);
    createSpaceMutation.mutate(name);
  }

  function submitRenameSpace(event: React.FormEvent) {
    event.preventDefault();
    if (!renameSpace) return;
    const name = renameValue.trim();
    if (!name) {
      setRenameError("Enter a space name");
      return;
    }
    setRenameError(null);
    renameSpaceMutation.mutate({ id: renameSpace.id, name });
  }

  const spaces: SpaceSummary[] = spacesQuery.data?.spaces ?? [];
  const defaultSpaceId = spaces[0]?.id;
  const onNotes = pathname.startsWith("/notes");
  const noteCount = notesCountQuery.data?.notes.length ?? 0;
  const storageMb = (noteCount * 0.018).toFixed(1);

  const navItems = [
    {
      label: "Notes",
      href: "/notes",
      icon: NotebookPen,
      active: onNotes && !view,
      tooltip: "Notes",
    },
    {
      label: "Calendar",
      href: "/calendar",
      icon: CalendarDays,
      active: pathname.startsWith("/calendar"),
      tooltip: "Calendar",
    },
    {
      label: "Journal",
      href: "/notes?view=today",
      icon: BookOpen,
      active: view === "today",
      tooltip: "Journal",
    },
    {
      label: "Tasks",
      href: "/notes?view=favorites",
      icon: CheckSquare,
      active: view === "favorites",
      tooltip: "Favorites & tasks",
    },
    {
      label: "Archive",
      href: "/notes?view=shared",
      icon: Archive,
      active: view === "shared",
      tooltip: "Shared archive",
    },
    {
      label: "Inbox",
      href: "/notes?view=inbox",
      icon: Inbox,
      active: view === "inbox",
      tooltip: "Inbox",
    },
    {
      label: "Trash",
      href: "/notes?view=trash",
      icon: Trash2,
      active: view === "trash",
      tooltip: "Trash",
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname.startsWith("/settings"),
      tooltip: "Settings",
    },
  ] as const;

  function isSpaceActive(space: SpaceSummary) {
    return (
      activeSpaceId === space.id ||
      (!activeSpaceId && !view && space.id === defaultSpaceId && onNotes)
    );
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r border-sidebar-border">
      <SidebarHeader className="gap-3 px-3 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/notes" />}
              className="hover:bg-transparent data-active:bg-transparent"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary/15 text-primary">
                <NotebookPen className="size-4" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold tracking-tight text-sidebar-accent-foreground">
                  Notely
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  Writing desk
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <Button
          className="h-9 w-full justify-start gap-2 bg-primary/90 text-primary-foreground hover:bg-primary"
          size="sm"
          disabled={!defaultSpaceId || createNoteMutation.isPending}
          onClick={() => defaultSpaceId && createNoteMutation.mutate(defaultSpaceId)}
        >
          <Plus className="size-4" />
          New note
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    isActive={item.active}
                    tooltip={item.tooltip}
                    render={<Link href={item.href} />}
                    className={cn(
                      "relative h-10 rounded-lg text-sidebar-foreground",
                      item.active &&
                        "note-active-rail bg-sidebar-accent font-medium text-sidebar-accent-foreground",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-4",
                        item.active ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-3" />

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between gap-2 pr-1 text-[11px] tracking-wide text-muted-foreground uppercase">
            <span>Spaces</span>
            <button
              type="button"
              className="rounded p-1 text-muted-foreground hover:text-foreground"
              onClick={openCreateSpaceDialog}
              aria-label="Add space"
            >
              <Plus className="size-3.5" />
            </button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {spaces.map((space) => {
                const active = isSpaceActive(space);
                return (
                  <SidebarMenuItem key={space.id}>
                    <ContextMenu>
                      <ContextMenuTrigger className="w-full rounded-lg">
                        <SidebarMenuButton
                          isActive={active}
                          tooltip={space.name}
                          render={<Link href={`/notes?spaceId=${space.id}`} />}
                          className={cn(
                            "h-9 rounded-lg",
                            active && "note-active-rail bg-sidebar-accent",
                          )}
                        >
                          <FolderOpen className="size-4 text-muted-foreground" />
                          <span className="truncate">{space.name}</span>
                          {space.isFavorite ? (
                            <Star className="ml-auto size-3 fill-primary text-primary" />
                          ) : null}
                        </SidebarMenuButton>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuGroup>
                          <ContextMenuLabel className="truncate">
                            {space.name}
                          </ContextMenuLabel>
                          <ContextMenuItem
                            onClick={() => createNoteMutation.mutate(space.id)}
                            disabled={createNoteMutation.isPending}
                          >
                            <Plus />
                            New note
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() =>
                              router.push(`/notes?spaceId=${space.id}`)
                            }
                          >
                            <FolderOpen />
                            Open space
                          </ContextMenuItem>
                        </ContextMenuGroup>
                        <ContextMenuSeparator />
                        <ContextMenuGroup>
                          <ContextMenuItem
                            onClick={() => openRenameDialog(space)}
                          >
                            <Pencil />
                            Rename
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() =>
                              favoriteSpaceMutation.mutate({
                                id: space.id,
                                isFavorite: !space.isFavorite,
                              })
                            }
                            disabled={favoriteSpaceMutation.isPending}
                          >
                            <Star
                              className={
                                space.isFavorite
                                  ? "fill-primary text-primary"
                                  : undefined
                              }
                            />
                            {space.isFavorite
                              ? "Remove favorite"
                              : "Add to favorites"}
                          </ContextMenuItem>
                        </ContextMenuGroup>
                        <ContextMenuSeparator />
                        <ContextMenuGroup>
                          <ContextMenuItem
                            variant="destructive"
                            disabled={
                              spaces.length <= 1 ||
                              deleteSpaceMutation.isPending
                            }
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Delete “${space.name}”? Notes in this space will be removed.`,
                                )
                              ) {
                                deleteSpaceMutation.mutate(space.id);
                              }
                            }}
                          >
                            <Trash2 />
                            Delete space
                          </ContextMenuItem>
                        </ContextMenuGroup>
                      </ContextMenuContent>
                    </ContextMenu>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-3 px-3 pb-4">
        <button
          type="button"
          onClick={() => focusMode.toggle()}
          className={cn(
            "flex w-full items-start gap-3 rounded-xl border border-sidebar-border px-3 py-3 text-left transition-colors",
            focusMode.enabled
              ? "border-primary/40 bg-primary/10"
              : "bg-sidebar-accent/40 hover:bg-sidebar-accent",
          )}
        >
          <Moon
            className={cn(
              "mt-0.5 size-4 shrink-0",
              focusMode.enabled ? "text-primary" : "text-muted-foreground",
            )}
          />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-sidebar-accent-foreground">
              Focus
            </span>
            <span className="block text-[11px] leading-snug text-muted-foreground">
              Distraction free writing.
            </span>
          </span>
        </button>

        <div className="space-y-2 px-1 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{noteCount.toLocaleString()} notes</span>
            <span>{storageMb} MB</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-sidebar-accent">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.min(100, Math.max(8, noteCount / 20))}%` }}
            />
          </div>
        </div>

        <UserMenu variant="sidebar" />
      </SidebarFooter>

      <SidebarRail />

      <Dialog
        open={createSpaceOpen}
        onOpenChange={(open) => {
          setCreateSpaceOpen(open);
          if (!open) {
            setSpaceName("");
            setCreateSpaceError(null);
          }
        }}
      >
        <DialogContent>
          <form onSubmit={submitCreateSpace}>
            <DialogHeader>
              <DialogTitle>New space</DialogTitle>
              <DialogDescription>
                Spaces group related notes. Give this one a short name.
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <Input
                autoFocus
                value={spaceName}
                onChange={(event) => setSpaceName(event.target.value)}
                placeholder="e.g. Work, Personal, Ideas"
                maxLength={80}
                aria-label="Space name"
              />
              {createSpaceError ? (
                <p className="mt-2 text-xs text-destructive">{createSpaceError}</p>
              ) : null}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateSpaceOpen(false)}
                disabled={createSpaceMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!spaceName.trim() || createSpaceMutation.isPending}
              >
                {createSpaceMutation.isPending ? "Creating…" : "Create space"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(renameSpace)}
        onOpenChange={(open) => {
          if (!open) {
            setRenameSpace(null);
            setRenameValue("");
            setRenameError(null);
          }
        }}
      >
        <DialogContent>
          <form onSubmit={submitRenameSpace}>
            <DialogHeader>
              <DialogTitle>Rename space</DialogTitle>
              <DialogDescription>
                Update the name for this workspace.
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <Input
                autoFocus
                value={renameValue}
                onChange={(event) => setRenameValue(event.target.value)}
                placeholder="Space name"
                maxLength={80}
                aria-label="Space name"
              />
              {renameError ? (
                <p className="mt-2 text-xs text-destructive">{renameError}</p>
              ) : null}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRenameSpace(null)}
                disabled={renameSpaceMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!renameValue.trim() || renameSpaceMutation.isPending}
              >
                {renameSpaceMutation.isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
