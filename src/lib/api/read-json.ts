/**
 * Reads a JSON API response. Route handlers that crash return an empty body,
 * so parsing is guarded to surface the status instead of a JSON syntax error.
 */
export async function readJson<T>(
  response: Response,
  fallbackError: string,
): Promise<T> {
  const raw = await response.text();

  let data: unknown = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : `${fallbackError} (${response.status})`;
    throw new Error(message);
  }

  if (data === null) {
    throw new Error(fallbackError);
  }

  return data as T;
}
