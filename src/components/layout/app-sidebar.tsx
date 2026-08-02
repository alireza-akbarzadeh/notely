"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  FolderOpen,
  Inbox,
  Plus,
  Search,
  Settings,
  Share2,
  Star,
} from "lucide-react";

import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
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
import type { SpaceSummary } from "@/types/notes";
import { realtimeHeaders } from "@/lib/realtime/client-id";

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

  const spacesQuery = useQuery({
    queryKey: ["spaces"],
    queryFn: fetchSpaces,
  });

  const createNoteMutation = useMutation({
    mutationFn: async (spaceId: string) => {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: realtimeHeaders({ "Content-Type": "application/json" }),
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

  function openCreateSpaceDialog() {
    setSpaceName("");
    setCreateSpaceError(null);
    setCreateSpaceOpen(true);
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

  const inboxQuery = useQuery({
    queryKey: ["inbox"],
    queryFn: async (): Promise<{ invites: unknown[] }> => {
      const response = await fetch("/api/inbox");
      if (!response.ok) throw new Error("Failed to load inbox");
      return response.json();
    },
  });
  const pendingInvites = inboxQuery.data?.invites.length ?? 0;

  const spaces: SpaceSummary[] = spacesQuery.data?.spaces ?? [];
  const defaultSpaceId = spaces[0]?.id;
  const onNotes = pathname.startsWith("/notes");

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/notes" />}
              className="data-active:bg-sidebar-accent"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                N
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold">Notely</span>
                <span className="truncate text-xs text-muted-foreground">
                  Think. Note. Plan.
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <Button
          className="mt-2 h-10 w-full justify-start gap-2"
          size="sm"
          disabled={!defaultSpaceId || createNoteMutation.isPending}
          onClick={() => defaultSpaceId && createNoteMutation.mutate(defaultSpaceId)}
        >
          <Plus className="size-4" />
          New note
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Search"
                  onClick={() =>
                    window.dispatchEvent(new Event("notely:open-search"))
                  }
                >
                  <Search />
                  <span>Search</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">⌘K</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={onNotes && !view}
                  tooltip="Notes"
                  render={<Link href="/notes" />}
                >
                  <FolderOpen />
                  <span>Notes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={view === "shared"}
                  tooltip="Shared"
                  render={<Link href="/notes?view=shared" />}
                >
                  <Share2 />
                  <span>Shared</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={view === "today"}
                  tooltip="Today"
                  render={<Link href="/notes?view=today" />}
                >
                  <CalendarDays />
                  <span>Today</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={view === "favorites"}
                  tooltip="Favorites"
                  render={<Link href="/notes?view=favorites" />}
                >
                  <Star />
                  <span>Favorites</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={view === "inbox"}
                  tooltip="Inbox"
                  render={<Link href="/notes?view=inbox" />}
                >
                  <Inbox />
                  <span>Inbox</span>
                  {pendingInvites > 0 ? (
                    <span className="ml-auto rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                      {pendingInvites}
                    </span>
                  ) : null}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between gap-2 pr-1">
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
              {spaces.map((space) => (
                <SidebarMenuItem key={space.id}>
                  <SidebarMenuButton
                    isActive={activeSpaceId === space.id || (!activeSpaceId && !view && space.id === defaultSpaceId && onNotes)}
                    tooltip={space.name}
                    render={<Link href={`/notes?spaceId=${space.id}`} />}
                  >
                    <FolderOpen />
                    <span>{space.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/settings")}
                  tooltip="Settings"
                  render={<Link href="/settings" />}
                >
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
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
    </Sidebar>
  );
}
