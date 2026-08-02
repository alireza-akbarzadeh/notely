"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getRealtimeClientId } from "@/lib/realtime/client-id";
import type { RealtimeEvent } from "@/lib/realtime/types";

export type RemoteNoteUpdateDetail = {
  noteId: string;
  type: RealtimeEvent["type"];
  at: string;
};

declare global {
  interface WindowEventMap {
    "notely:remote-note": CustomEvent<RemoteNoteUpdateDetail>;
  }
}

export function useRealtimeSync() {
  const queryClient = useQueryClient();
  const clientIdRef = useRef("");

  useEffect(() => {
    clientIdRef.current = getRealtimeClientId();
    let source: EventSource | null = null;
    let closed = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    function handleEvent(event: RealtimeEvent) {
      if (event.type === "ping" || event.type === "connected") return;
      if (event.clientId && event.clientId === clientIdRef.current) return;

      const noteId = event.noteId;
      if (!noteId) return;

      queryClient.invalidateQueries({ queryKey: ["notes"] });

      if (event.type === "note.deleted") {
        queryClient.removeQueries({ queryKey: ["note", noteId] });
        queryClient.removeQueries({ queryKey: ["tasks", noteId] });
        queryClient.removeQueries({ queryKey: ["attachments", noteId] });
      } else if (event.type === "note.updated" || event.type === "note.created") {
        queryClient.invalidateQueries({ queryKey: ["note", noteId] });
      } else if (event.type === "tasks.changed") {
        queryClient.invalidateQueries({ queryKey: ["tasks", noteId] });
      } else if (event.type === "attachments.changed") {
        queryClient.invalidateQueries({ queryKey: ["attachments", noteId] });
      }

      window.dispatchEvent(
        new CustomEvent<RemoteNoteUpdateDetail>("notely:remote-note", {
          detail: { noteId, type: event.type, at: event.at },
        }),
      );
    }

    function connect() {
      if (closed) return;
      source = new EventSource("/api/realtime");
      source.onmessage = (message) => {
        try {
          const event = JSON.parse(message.data) as RealtimeEvent;
          handleEvent(event);
        } catch {
          // ignore malformed payloads
        }
      };
      source.onerror = () => {
        source?.close();
        source = null;
        if (closed) return;
        retryTimer = setTimeout(connect, 2000);
      };
    }

    connect();

    return () => {
      closed = true;
      if (retryTimer) clearTimeout(retryTimer);
      source?.close();
    };
  }, [queryClient]);
}
