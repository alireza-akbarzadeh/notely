"use client";

import { Suspense } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Suspense fallback={null}>
        <AppSidebar />
      </Suspense>
      <SidebarInset className="overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
      <Suspense fallback={null}>
        <MobileBottomNav />
      </Suspense>
    </SidebarProvider>
  );
}
