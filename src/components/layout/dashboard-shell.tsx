"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import { AppBar } from "@/components/layout/app-bar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { ReminderRuntime } from "@/components/notifications/reminder-runtime";
import { NoteSearchDialog } from "@/components/notes/note-search-dialog";
import { RealtimeProvider } from "@/components/realtime-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { isNotesChromePath } from "@/lib/workspace/paths";

function DashboardChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isNotesChrome = isNotesChromePath(pathname);

  return (
<<<<<<< HEAD
    <SidebarProvider>
      <RealtimeProvider>
        <Suspense fallback={null}>
          <AppSidebar />
        </Suspense>
        <SidebarInset className="overflow-hidden">
          <AppBar />
          <div className="flex min-h-0 flex-1">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
            <UtilitySidebar />
          </div>
        </SidebarInset>
        <Suspense fallback={null}>
          <MobileBottomNav />
        </Suspense>
        <NoteSearchDialog />
      </RealtimeProvider>
=======
    <>
      <Suspense fallback={null}>
        <AppSidebar />
      </Suspense>
      <SidebarInset
        className={cn(
          "min-h-0 overflow-hidden bg-background",
          isNotesChrome &&
            "md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none",
        )}
      >
        {isNotesChrome ? null : <AppBar />}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
      <Suspense fallback={null}>
        <MobileBottomNav />
      </Suspense>
      <NoteSearchDialog />
    </>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPlans =
    pathname.startsWith("/plans") || pathname.startsWith("/calendar");

  if (isPlans) {
    return (
      <div className="flex h-svh min-h-0 w-full flex-col overflow-hidden bg-background">
        <div className="min-h-0 flex-1 overflow-hidden pb-16 md:pb-0">
          {children}
        </div>
        <Suspense fallback={null}>
          <MobileBottomNav />
        </Suspense>
        <ReminderRuntime />
      </div>
    );
  }

  return (
    <SidebarProvider
      className="h-svh overflow-hidden bg-background"
      style={
        {
          "--sidebar-width": "15rem",
        } as React.CSSProperties
      }
    >
      <DashboardChrome>{children}</DashboardChrome>
      <ReminderRuntime />
>>>>>>> refs/remotes/origin/main
    </SidebarProvider>
  );
}
