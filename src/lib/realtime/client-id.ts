const STORAGE_KEY = "notely-client-id";

/** Stable per-browser-tab id so we can ignore our own realtime echoes. */
export function getRealtimeClientId() {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.sessionStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return `client-${Date.now()}`;
  }
}

export function realtimeHeaders(
  init?: HeadersInit,
): Record<string, string> {
  const headers = new Headers(init);
  const clientId = getRealtimeClientId();
  if (clientId) headers.set("x-client-id", clientId);
  const out: Record<string, string> = {};
  headers.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}
