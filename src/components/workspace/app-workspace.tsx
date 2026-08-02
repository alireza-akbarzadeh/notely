"use client";

import { useSearchParams } from "next/navigation";

import { IntegrationsPanel } from "@/components/integrations/integrations-panel";
import { NotesWorkspace } from "@/components/notes/notes-workspace";
import { normalizeWorkspaceView } from "@/lib/workspace/paths";

export function AppWorkspace() {
  const searchParams = useSearchParams();
  const view = normalizeWorkspaceView(searchParams.get("view"));

  if (view === "integration") {
    return <IntegrationsPanel />;
  }

  return <NotesWorkspace />;
}
