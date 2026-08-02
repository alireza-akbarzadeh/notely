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
  Plug,
  Plus,
  Settings,
  Share2,
  Star,
  Tags,
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { SpaceDeleteDialog } from "@/components/notes/space-delete-dialog";
import { TagManageDialog } from "@/components/notes/tag-manage-dialog";
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
<<<<<<< HEAD
import type { SpaceSummary } from "@/types/notes";
import { realtimeHeaders } from "@/lib/realtime/client-id";
=======
import { readJson } from "@/lib/api/read-json";
import { cn } from "@/lib/utils";
import {
  isNotesChromePath,
  notePath,
  normalizeWorkspaceView,
  workspacePath,
} from "@/lib/workspace/paths";
import { useFocusMode } from "@/stores/focus-mode";
import type { NoteSummary, NoteTag, SpaceSummary } from "@/types/notes";
>>>>>>> refs/remotes/origin/main

async function fetchSpaces(): Promise<{ spaces: SpaceSummary[] }> {
  return readJson<{ spaces: SpaceSummary[] }>(
    await fetch("/api/spaces"),
    "Failed to load spaces",
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const view = normalizeWorkspaceView(searchParams.get("view"));
  const activeSpaceId = searchParams.get("spaceId");
  const activeTagId = searchParams.get("tagId");
  const [createSpaceOpen, setCreateSpaceOpen] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const [createSpaceError, setCreateSpaceError] = useState<string | null>(null);
  const [renameSpace, setRenameSpace] = useState<SpaceSummary | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameError, setRenameError] = useState<string | null>(null);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState<SpaceSummary | null>(null);
  const focusMode = useFocusMode();

  const spacesQuery = useQuery({
    queryKey: ["spaces"],
    queryFn: fetchSpaces,
  });

  const notesCountQuery = useQuery({
    queryKey: ["notes", "stats"],
    queryFn: async (): Promise<{ notes: NoteSummary[] }> =>
      readJson<{ notes: NoteSummary[] }>(
        await fetch("/api/notes"),
        "Failed to load notes",
      ),
  });

  const tagsQuery = useQuery({
    queryKey: ["tags"],
    queryFn: async (): Promise<{ tags: NoteTag[] }> =>
      readJson<{ tags: NoteTag[] }>(await fetch("/api/tags"), "Failed to load tags"),
  });

  const tags = tagsQuery.data?.tags ?? [];

  const createNoteMutation = useMutation({
    mutationFn: async (spaceId: string) => {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: realtimeHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ spaceId, title: "Untitled" }),
      });
      const data = await readJson<{ note: { id: string } }>(
        response,
        "Failed to create note",
      );
      return data.note;
    },
    onSuccess: (note) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push(notePath(note.id));
    },
  });

  const createSpaceMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch("/api/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await readJson<{ space: SpaceSummary }>(
        response,
        "Failed to create space",
      );
      return data.space;
    },
    onSuccess: (space) => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      setCreateSpaceOpen(false);
      setSpaceName("");
      setCreateSpaceError(null);
      if (space) router.push(workspacePath({ spaceId: space.id }));
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
      const data = await readJson<{ space: SpaceSummary }>(
        response,
        "Failed to rename space",
      );
      return data.space;
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
      const data = await readJson<{ space: SpaceSummary }>(
        response,
        "Failed to update space",
      );
      return data.space;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
  });

  const deleteSpaceMutation = useMutation({
    mutationFn: async ({
      id,
      keepNoteIds,
      moveTargetSpaceId,
    }: {
      id: string;
      keepNoteIds?: string[];
      moveTargetSpaceId?: string;
    }) => {
      const hasBody =
        (keepNoteIds?.length ?? 0) > 0 || Boolean(moveTargetSpaceId);
      const response = await fetch(`/api/spaces/${id}`, {
        method: "DELETE",
        ...(hasBody
          ? {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ keepNoteIds, moveTargetSpaceId }),
            }
          : {}),
      });
      await readJson(response, "Failed to delete space");
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      if (activeSpaceId === id) {
        router.push(workspacePath({ view: "trash" }));
      }
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
  const notesInSpaceToDelete = spaceToDelete
    ? (notesCountQuery.data?.notes ?? []).filter(
        (note) => note.spaceId === spaceToDelete.id,
      )
    : [];
  // Prefer the note-picker dialog while counts are loading so we don't flash
  // a simple confirm for a multi-note space.
  const useNotePickerDialog =
    Boolean(spaceToDelete) &&
    (notesCountQuery.isLoading || notesInSpaceToDelete.length > 1);
  const fallbackSpaceForDelete =
    spaces.find((space) => space.id !== spaceToDelete?.id) ?? null;
  const onWorkspace = isNotesChromePath(pathname);
  const onNotesList =
    onWorkspace &&
    view !== "today" &&
    view !== "archive" &&
    view !== "shared" &&
    view !== "inbox" &&
    view !== "trash" &&
    view !== "integration" &&
    view !== "favorites";
  const noteCount = notesCountQuery.data?.notes.length ?? 0;
  const storageMb = (noteCount * 0.018).toFixed(1);

  const navItems = [
    {
      label: "Notes",
      href: workspacePath({ view: "notes" }),
      icon: NotebookPen,
      active: onNotesList && !activeSpaceId,
      tooltip: "Notes",
    },
    {
      label: "Plans",
      href: "/plans",
      icon: CalendarDays,
      active: pathname.startsWith("/plans") || pathname.startsWith("/calendar"),
      tooltip: "Time-based planning",
    },
    {
      label: "Today",
      href: workspacePath({ view: "today" }),
      icon: BookOpen,
      active: view === "today",
      tooltip: "Notes updated today",
    },
    {
      label: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
      active: pathname.startsWith("/tasks"),
      tooltip: "Task workflow",
    },
    {
      label: "Favorites",
      href: workspacePath({ view: "favorites" }),
      icon: Star,
      active: view === "favorites",
      tooltip: "Starred notes",
    },
    {
      label: "Archive",
      href: workspacePath({ view: "archive" }),
      icon: Archive,
      active: view === "archive",
      tooltip: "Archived notes",
    },
    {
      label: "Shared with me",
      href: workspacePath({ view: "shared" }),
      icon: Share2,
      active: view === "shared",
      tooltip: "Notes others shared with you",
    },
    {
      label: "Inbox",
      href: workspacePath({ view: "inbox" }),
      icon: Inbox,
      active: view === "inbox",
      tooltip: "Inbox",
    },
    {
      label: "Trash",
      href: workspacePath({ view: "trash" }),
      icon: Trash2,
      active: view === "trash",
      tooltip: "Trash",
    },
    {
      label: "Integrations",
      href: workspacePath({ view: "integration" }),
      icon: Plug,
      active: view === "integration",
      tooltip: "Connected apps",
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
      (!activeSpaceId && onNotesList && space.id === defaultSpaceId)
    );
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r border-sidebar-border">
      <SidebarHeader className="gap-3 px-3 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href={workspacePath()} />}
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
                          render={<Link href={workspacePath({ spaceId: space.id })} />}
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
                              router.push(workspacePath({ spaceId: space.id }))
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
                            onClick={() => setSpaceToDelete(space)}
                          >
                            <Trash2 />
                            Move to Trash
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

        <SidebarSeparator className="mx-3" />

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between gap-2 pr-1 text-[11px] tracking-wide text-muted-foreground uppercase">
            <span>Tags</span>
            <button
              type="button"
              className="rounded p-1 text-muted-foreground hover:text-foreground"
              onClick={() => setTagsOpen(true)}
              aria-label="Manage tags"
            >
              <Pencil className="size-3.5" />
            </button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tags.length === 0 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Manage tags"
                    onClick={() => setTagsOpen(true)}
                    className="h-9 rounded-lg"
                  >
                    <Tags className="size-4 text-muted-foreground" />
                    <span>Add tags</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                tags.map((tag) => {
                  const active = activeTagId === tag.id;
                  return (
                    <SidebarMenuItem key={tag.id}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={`#${tag.name}`}
                        render={
                          <Link
                            href={workspacePath({
                              params: { tagId: tag.id },
                            })}
                          />
                        }
                        className="h-9 rounded-lg"
                      >
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: tag.color }}
                          aria-hidden
                        />
                        <span className="truncate">#{tag.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
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

      <ConfirmDialog
        open={Boolean(spaceToDelete) && !useNotePickerDialog}
        onOpenChange={(open) => {
          if (!open) setSpaceToDelete(null);
        }}
        title="Move space to Trash?"
        description={
          spaceToDelete
            ? notesInSpaceToDelete.length === 1
              ? `“${spaceToDelete.name}” and its note will move to Trash. You can restore them later.`
              : `“${spaceToDelete.name}” will move to Trash. You can restore it later.`
            : "This space will move to Trash."
        }
        confirmLabel="Move to Trash"
        pendingLabel="Moving…"
        pending={deleteSpaceMutation.isPending}
        destructive
        onConfirm={() => {
          if (!spaceToDelete) return;
          deleteSpaceMutation.mutate(
            { id: spaceToDelete.id },
            { onSettled: () => setSpaceToDelete(null) },
          );
        }}
      />

      <SpaceDeleteDialog
        space={useNotePickerDialog ? spaceToDelete : null}
        fallbackSpace={fallbackSpaceForDelete}
        pending={deleteSpaceMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setSpaceToDelete(null);
        }}
        onConfirm={({ keepNoteIds, moveTargetSpaceId }) => {
          if (!spaceToDelete) return;
          deleteSpaceMutation.mutate(
            {
              id: spaceToDelete.id,
              keepNoteIds,
              moveTargetSpaceId,
            },
            { onSettled: () => setSpaceToDelete(null) },
          );
        }}
      />

      <TagManageDialog open={tagsOpen} onOpenChange={setTagsOpen} />
    </Sidebar>
  );
}
