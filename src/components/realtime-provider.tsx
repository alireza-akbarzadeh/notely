"use client";

import type { ReactNode } from "react";

import { useRealtimeSync } from "@/hooks/use-realtime";

/** Mounts the dashboard EventSource connection. */
export function RealtimeProvider({ children }: { children: ReactNode }) {
  useRealtimeSync();
  return <>{children}</>;
}
