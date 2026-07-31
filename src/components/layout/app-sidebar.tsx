"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  FolderOpen,
  Inbox,
  Plus,
  Search,
  Settings,
  Star,
} from "lucide-react";

import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
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

const primaryNav = [
  {
    href: "/notes",
    label: "Notes",
    icon: FolderOpen,
    match: (path: string) => path.startsWith("/notes") && !path.includes("favorites"),
  },
  {
    href: "/notes?view=today",
    label: "Today",
    icon: CalendarDays,
    match: (path: string) => path.includes("view=today"),
  },
  {
    href: "/notes?view=favorites",
    label: "Favorites",
    icon: Star,
    match: (path: string) => path.includes("view=favorites"),
  },
  {
    href: "/notes?view=inbox",
    label: "Inbox",
    icon: Inbox,
    match: (path: string) => path.includes("view=inbox"),
  },
];

async function fetchSpaces(): Promise<{ spaces: SpaceSummary[] }> {
  const response = await fetch("/api/spaces");
  if (!response.ok) throw new Error("Failed to load spaces");
  return response.json();
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const spacesQuery = useQuery({
    queryKey: ["spaces"],
    queryFn: fetchSpaces,
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
    mutationFn: async () => {
      const name = window.prompt("Space name");
      if (!name?.trim()) return null;
      const response = await fetch("/api/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to create space");
      return data.space as SpaceSummary;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
  });

  const spaces = spacesQuery.data?.spaces ?? [];
  const defaultSpaceId = spaces[0]?.id;

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
          className="mt-2 w-full justify-start gap-2"
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
                <SidebarMenuButton tooltip="Search" disabled>
                  <Search />
                  <span>Search</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">⌘K</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {primaryNav.map(({ href, label, icon: Icon, match }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    isActive={match(`${pathname}${typeof window !== "undefined" ? window.location.search : ""}`)}
                    tooltip={label}
                    render={<Link href={href} />}
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between gap-2">
            <span>Spaces</span>
            <button
              type="button"
              className="rounded p-0.5 text-muted-foreground hover:text-foreground"
              onClick={() => createSpaceMutation.mutate()}
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
                    isActive={pathname.startsWith("/notes") && !pathname.includes("view=")}
                    tooltip={space.name}
                    render={<Link href={`/notes?spaceId=${space.id}`} />}
                    onClick={() => {
                      if (defaultSpaceId === space.id) return;
                    }}
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
    </Sidebar>
  );
}
