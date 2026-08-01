"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import { AppBar } from "@/components/layout/app-bar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { UtilitySidebar } from "@/components/layout/utility-sidebar";
import { NoteSearchDialog } from "@/components/notes/note-search-dialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

function DashboardChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isNotes = pathname.startsWith("/notes");
  const isSettings = pathname.startsWith("/settings");

  return (
    <>
      <Suspense fallback={null}>
        <AppSidebar />
      </Suspense>
      <SidebarInset
        className={cn(
          "min-h-0 overflow-hidden bg-background",
          isNotes &&
            "md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none",
        )}
      >
        {isNotes ? null : <AppBar />}
        <div className="flex min-h-0 flex-1">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
          {isSettings ? <UtilitySidebar /> : null}
        </div>
      </SidebarInset>
      <Suspense fallback={null}>
        <MobileBottomNav />
      </Suspense>
      <NoteSearchDialog />
    </>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
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
    </SidebarProvider>
  );
}
