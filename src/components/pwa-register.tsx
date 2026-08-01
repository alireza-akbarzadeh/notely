"use client";

import { useEffect } from "react";

import { registerNotelyServiceWorker } from "@/lib/notifications/push-client";

/** Registers the service worker site-wide for PWA + push. */
export function PwaRegister() {
  useEffect(() => {
    void registerNotelyServiceWorker().catch(() => undefined);
  }, []);

  return null;
}
