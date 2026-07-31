import { Suspense } from "react";

import { NotesWorkspace } from "@/components/notes/notes-workspace";

type Params = { params: Promise<{ id: string }> };

export default async function NotePage({ params }: Params) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">Loading note…</div>}>
      <NotesWorkspace noteId={id} />
    </Suspense>
  );
}
