"use client";

import { Suspense } from "react";

import { AppBar } from "@/components/layout/app-bar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { UtilitySidebar } from "@/components/layout/utility-sidebar";
import { NoteSearchDialog } from "@/components/notes/note-search-dialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
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
    </SidebarProvider>
  );
}
