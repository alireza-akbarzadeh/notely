export type WorkspaceView =
  | "notes"
  | "today"
  | "archive"
  | "inbox"
  | "trash"
  | "integration"
  | "favorites";

const WORKSPACE_VIEWS = new Set<string>([
  "notes",
  "today",
  "archive",
  "inbox",
  "trash",
  "integration",
  "favorites",
  // legacy alias used before archive rename
  "shared",
]);

export function normalizeWorkspaceView(
  view: string | null | undefined,
): WorkspaceView | null {
  if (!view) return null;
  if (view === "shared") return "archive";
  if (WORKSPACE_VIEWS.has(view)) return view as WorkspaceView;
  return null;
}

export function isNotesListView(view: string | null | undefined) {
  const normalized = normalizeWorkspaceView(view);
  return normalized !== "integration";
}

type WorkspacePathOptions = {
  view?: WorkspaceView | string | null;
  spaceId?: string | null;
  params?: Record<string, string | null | undefined>;
};

/** Build `/workspace` with optional view / spaceId query params. */
export function workspacePath(options: WorkspacePathOptions = {}) {
  const params = new URLSearchParams();
  const view = normalizeWorkspaceView(options.view ?? null);

  if (view && view !== "notes") {
    params.set("view", view);
  }
  if (options.spaceId) {
    params.set("spaceId", options.spaceId);
  }
  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value != null && value !== "") params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `/workspace?${query}` : "/workspace";
}

export function notePath(noteId: string, search?: string | URLSearchParams) {
  const query =
    typeof search === "string"
      ? search
      : search
        ? search.toString()
        : "";
  return query ? `/notes/${noteId}?${query}` : `/notes/${noteId}`;
}

export function isWorkspacePath(pathname: string) {
  return pathname === "/workspace" || pathname.startsWith("/workspace/");
}

/** Routes that use the notes chrome (no top AppBar). */
export function isNotesChromePath(pathname: string) {
  return pathname.startsWith("/notes") || isWorkspacePath(pathname);
}
