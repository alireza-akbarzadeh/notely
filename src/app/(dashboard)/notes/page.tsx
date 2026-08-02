import { redirect } from "next/navigation";

import { normalizeWorkspaceView, workspacePath } from "@/lib/workspace/paths";

type NotesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams;
  const rawView = typeof params.view === "string" ? params.view : null;
  const spaceId = typeof params.spaceId === "string" ? params.spaceId : null;
  const view = normalizeWorkspaceView(rawView);

  redirect(
    workspacePath({
      view,
      spaceId,
    }),
  );
}
