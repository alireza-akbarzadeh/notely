"use client";

import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Bell, Search, Share2 } from "lucide-react";

import { UserMenu } from "@/components/layout/user-menu";
import { ThemeModeButton } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { readJson } from "@/lib/api/read-json";
import { cn } from "@/lib/utils";
import { isWorkspacePath, workspacePath } from "@/lib/workspace/paths";

type AppBarProps = {
  title?: string;
  subtitle?: string;
  className?: string;
};

export function AppBar({ title, subtitle, className }: AppBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const inboxQuery = useQuery({
    queryKey: ["inbox"],
    queryFn: async (): Promise<{ invites: unknown[] }> =>
      readJson<{ invites: unknown[] }>(
        await fetch("/api/inbox"),
        "Failed to load inbox",
      ),
  });
  const pendingInvites = inboxQuery.data?.invites.length ?? 0;

  const pageTitle =
    title ??
    (pathname.startsWith("/settings")
      ? "Settings"
      : isWorkspacePath(pathname)
        ? "Workspace"
        : pathname.startsWith("/notes")
          ? "Notes"
          : "Notely");

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur-md pt-[env(safe-area-inset-top)] md:px-4",
        className,
      )}
    >
      <SidebarTrigger className="-ml-0.5" />
      <Separator orientation="vertical" className="mr-1 hidden h-4 sm:block" />

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold tracking-tight">
          {pageTitle}
        </h1>
        {subtitle ? (
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9"
                onClick={() =>
                  window.dispatchEvent(new Event("notely:open-search"))
                }
                aria-label="Search notes"
              />
            }
          >
            <Search className="size-4" />
          </TooltipTrigger>
          <TooltipContent>Search · ⌘K</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9"
                onClick={() => router.push(workspacePath({ view: "shared" }))}
                aria-label="Shared with me"
              />
            }
          >
            <Share2 className="size-4" />
          </TooltipTrigger>
          <TooltipContent>Shared with me</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="relative size-9"
                onClick={() => router.push(workspacePath({ view: "inbox" }))}
                aria-label={
                  pendingInvites > 0
                    ? `Inbox, ${pendingInvites} pending`
                    : "Inbox"
                }
              />
            }
          >
            <Bell className="size-4" />
            {pendingInvites > 0 ? (
              <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
                {pendingInvites > 9 ? "9+" : pendingInvites}
              </span>
            ) : null}
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        <ThemeModeButton />

        <Separator orientation="vertical" className="mx-1 hidden h-4 sm:block" />

        <UserMenu variant="appbar" />
      </div>
    </header>
  );
}

/** @deprecated Prefer AppBar — kept for existing imports */
export function Header(props: AppBarProps) {
  return <AppBar {...props} />;
}
