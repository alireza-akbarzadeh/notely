import { Suspense } from "react";

import { NotesWorkspace } from "@/components/notes/notes-workspace";

export default function NotesPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">Loading notes…</div>}>
      <NotesWorkspace />
    </Suspense>
  );
}
