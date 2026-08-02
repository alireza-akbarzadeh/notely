import { headers } from "next/headers";

/** Read optional per-tab client id from mutation requests. */
export async function getRequestClientId() {
  const headerStore = await headers();
  const value = headerStore.get("x-client-id")?.trim();
  return value || null;
}
