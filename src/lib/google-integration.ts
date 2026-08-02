import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  randomUUID,
} from "node:crypto";
import { and, eq } from "drizzle-orm";

import { db, googleConnections, googleOAuthCredentials } from "@/lib/db";
import { getEnv } from "@/lib/env";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_REVOKE_URL = "https://oauth2.googleapis.com/revoke";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
];

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  token_type: string;
};

type GoogleProfile = {
  id: string;
  email: string;
};

export type GoogleIntegrationItem = {
  id: string;
  kind: "gmail" | "calendar";
  title: string;
  subtitle: string;
  date: string | null;
  content: string;
  url: string | null;
};

export type GoogleCredentialSource = "env" | "user" | null;

function integrationKey() {
  return createHash("sha256")
    .update(`notely-google-integration:${getEnv().BETTER_AUTH_SECRET}`)
    .digest();
}

function encryptToken(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", integrationKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map((part) => part.toString("base64url")).join(".");
}

function decryptToken(value: string) {
  const [ivValue, tagValue, encryptedValue] = value.split(".");
  if (!ivValue || !tagValue || !encryptedValue) {
    throw new Error("Invalid encrypted Google token");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    integrationKey(),
    Buffer.from(ivValue, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

function envGoogleCredentials() {
  const env = getEnv();
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return null;
  return {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  };
}

function googleRedirectUri() {
  return new URL(
    "/api/integrations/google/callback",
    getEnv().NEXT_PUBLIC_APP_URL,
  ).toString();
}

async function getUserOAuthCredentials(userId: string) {
  const [row] = await db
    .select()
    .from(googleOAuthCredentials)
    .where(eq(googleOAuthCredentials.userId, userId))
    .limit(1);
  if (!row) return null;
  return {
    clientId: decryptToken(row.clientId),
    clientSecret: decryptToken(row.clientSecret),
  };
}

async function googleCredentials(userId: string) {
  const userCreds = await getUserOAuthCredentials(userId);
  const envCreds = envGoogleCredentials();
  const creds = userCreds ?? envCreds;
  if (!creds) {
    throw new Error("Google integration is not configured");
  }
  return {
    ...creds,
    redirectUri: googleRedirectUri(),
    source: (userCreds ? "user" : "env") as Exclude<GoogleCredentialSource, null>,
  };
}

function maskClientId(clientId: string) {
  if (clientId.length <= 12) return "••••••••";
  return `${clientId.slice(0, 8)}…${clientId.slice(-4)}`;
}

async function googleJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: "no-store" });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Google API request failed (${response.status}): ${detail}`);
  }
  return response.json() as Promise<T>;
}

export async function isGoogleIntegrationConfigured(userId: string) {
  if (envGoogleCredentials()) return true;
  return Boolean(await getUserOAuthCredentials(userId));
}

export async function saveGoogleOAuthCredentials(
  userId: string,
  clientId: string,
  clientSecret: string,
) {
  const [existing] = await db
    .select({ id: googleOAuthCredentials.id })
    .from(googleOAuthCredentials)
    .where(eq(googleOAuthCredentials.userId, userId))
    .limit(1);
  const now = new Date();
  await db
    .insert(googleOAuthCredentials)
    .values({
      id: existing?.id ?? randomUUID(),
      userId,
      clientId: encryptToken(clientId),
      clientSecret: encryptToken(clientSecret),
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: googleOAuthCredentials.userId,
      set: {
        clientId: encryptToken(clientId),
        clientSecret: encryptToken(clientSecret),
        updatedAt: now,
      },
    });
}

export async function clearGoogleOAuthCredentials(userId: string) {
  await db
    .delete(googleOAuthCredentials)
    .where(eq(googleOAuthCredentials.userId, userId));
}

export async function createGoogleAuthorizationUrl(
  userId: string,
  state: string,
) {
  const { clientId, redirectUri } = await googleCredentials(userId);
  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", GOOGLE_SCOPES.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  return url;
}

export async function connectGoogleAccount(userId: string, code: string) {
  const { clientId, clientSecret, redirectUri } =
    await googleCredentials(userId);
  const tokens = await googleJson<GoogleTokenResponse>(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const profile = await googleJson<GoogleProfile>(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const [existing] = await db
    .select()
    .from(googleConnections)
    .where(eq(googleConnections.userId, userId))
    .limit(1);
  const now = new Date();

  await db
    .insert(googleConnections)
    .values({
      id: existing?.id ?? randomUUID(),
      userId,
      googleAccountId: profile.id,
      email: profile.email,
      accessToken: encryptToken(tokens.access_token),
      refreshToken: tokens.refresh_token
        ? encryptToken(tokens.refresh_token)
        : existing?.refreshToken,
      scope: tokens.scope ?? GOOGLE_SCOPES.join(" "),
      expiresAt: new Date(now.getTime() + tokens.expires_in * 1000),
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: googleConnections.userId,
      set: {
        googleAccountId: profile.id,
        email: profile.email,
        accessToken: encryptToken(tokens.access_token),
        refreshToken: tokens.refresh_token
          ? encryptToken(tokens.refresh_token)
          : existing?.refreshToken,
        scope: tokens.scope ?? GOOGLE_SCOPES.join(" "),
        expiresAt: new Date(now.getTime() + tokens.expires_in * 1000),
        updatedAt: now,
      },
    });
}

async function getConnection(userId: string) {
  const [connection] = await db
    .select()
    .from(googleConnections)
    .where(eq(googleConnections.userId, userId))
    .limit(1);
  return connection ?? null;
}

export async function getGoogleConnectionStatus(userId: string) {
  const connection = await getConnection(userId);
  const userCreds = await getUserOAuthCredentials(userId);
  const envCreds = envGoogleCredentials();
  const source: GoogleCredentialSource = userCreds
    ? "user"
    : envCreds
      ? "env"
      : null;
  return {
    configured: Boolean(userCreds || envCreds),
    credentialSource: source,
    clientIdHint: userCreds
      ? maskClientId(userCreds.clientId)
      : envCreds
        ? maskClientId(envCreds.clientId)
        : null,
    redirectUri: googleRedirectUri(),
    connected: Boolean(connection),
    email: connection?.email ?? null,
  };
}

async function getValidAccessToken(userId: string) {
  const connection = await getConnection(userId);
  if (!connection) throw new Error("Connect Google Workspace first");
  if (connection.expiresAt.getTime() > Date.now() + 60_000) {
    return decryptToken(connection.accessToken);
  }
  if (!connection.refreshToken) {
    throw new Error("Google access expired. Reconnect your account.");
  }

  const { clientId, clientSecret } = await googleCredentials(userId);
  const tokens = await googleJson<GoogleTokenResponse>(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: decryptToken(connection.refreshToken),
      grant_type: "refresh_token",
    }),
  });
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
  await db
    .update(googleConnections)
    .set({
      accessToken: encryptToken(tokens.access_token),
      expiresAt,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(googleConnections.id, connection.id),
        eq(googleConnections.userId, userId),
      ),
    );
  return tokens.access_token;
}

export async function disconnectGoogleAccount(userId: string) {
  const connection = await getConnection(userId);
  if (!connection) return;
  const token = connection.refreshToken
    ? decryptToken(connection.refreshToken)
    : decryptToken(connection.accessToken);
  await fetch(`${GOOGLE_REVOKE_URL}?token=${encodeURIComponent(token)}`, {
    method: "POST",
    cache: "no-store",
  }).catch(() => undefined);
  await db
    .delete(googleConnections)
    .where(eq(googleConnections.userId, userId));
}

type GmailHeader = { name?: string; value?: string };
type GmailPart = {
  mimeType?: string;
  body?: { data?: string };
  parts?: GmailPart[];
};
type GmailMessage = {
  id: string;
  internalDate?: string;
  payload?: GmailPart & { headers?: GmailHeader[] };
};

function gmailHeader(message: GmailMessage, name: string) {
  return (
    message.payload?.headers?.find(
      (header) => header.name?.toLowerCase() === name.toLowerCase(),
    )?.value ?? ""
  );
}

function decodeGmailBody(data?: string) {
  return data ? Buffer.from(data, "base64url").toString("utf8") : "";
}

function findGmailBody(part?: GmailPart, mimeType = "text/plain"): string {
  if (!part) return "";
  if (part.mimeType === mimeType && part.body?.data) {
    return decodeGmailBody(part.body.data);
  }
  for (const child of part.parts ?? []) {
    const body = findGmailBody(child, mimeType);
    if (body) return body;
  }
  return "";
}

function plainTextFromHtml(value: string) {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function listGmailItems(
  accessToken: string,
  query?: string,
): Promise<GoogleIntegrationItem[]> {
  const listUrl = new URL(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages",
  );
  listUrl.searchParams.set("maxResults", "12");
  listUrl.searchParams.set("q", query?.trim() || "newer_than:30d");
  const list = await googleJson<{ messages?: { id: string }[] }>(
    listUrl.toString(),
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  const messages = await Promise.all(
    (list.messages ?? []).map(({ id }) =>
      googleJson<GmailMessage>(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      ),
    ),
  );
  return messages.map((message) => {
    const subject = gmailHeader(message, "Subject") || "(No subject)";
    const from = gmailHeader(message, "From");
    const date = gmailHeader(message, "Date");
    const plain = findGmailBody(message.payload);
    const html = plain
      ? ""
      : plainTextFromHtml(findGmailBody(message.payload, "text/html"));
    const body = (plain || html || "No message body available").slice(0, 10_000);
    return {
      id: message.id,
      kind: "gmail" as const,
      title: subject,
      subtitle: from,
      date: message.internalDate
        ? new Date(Number(message.internalDate)).toISOString()
        : date || null,
      content: `Email: ${subject}\nFrom: ${from}\nDate: ${date}\n\n${body}`,
      url: `https://mail.google.com/mail/u/0/#all/${message.id}`,
    };
  });
}

type CalendarEvent = {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
};

async function listCalendarItems(
  accessToken: string,
  query?: string,
): Promise<GoogleIntegrationItem[]> {
  const url = new URL(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
  );
  url.searchParams.set("maxResults", "20");
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set(
    "timeMin",
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  );
  url.searchParams.set(
    "timeMax",
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  );
  if (query?.trim()) url.searchParams.set("q", query.trim());
  const data = await googleJson<{ items?: CalendarEvent[] }>(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return (data.items ?? []).map((event) => {
    const title = event.summary || "(Untitled event)";
    const start = event.start?.dateTime ?? event.start?.date ?? "";
    const end = event.end?.dateTime ?? event.end?.date ?? "";
    return {
      id: event.id,
      kind: "calendar" as const,
      title,
      subtitle: event.location || start,
      date: start || null,
      content: [
        `Calendar event: ${title}`,
        start ? `Starts: ${start}` : "",
        end ? `Ends: ${end}` : "",
        event.location ? `Location: ${event.location}` : "",
        "",
        event.description || "",
        event.htmlLink ? `Open in Google Calendar: ${event.htmlLink}` : "",
      ]
        .filter((line, index, lines) => line || lines[index - 1] !== "")
        .join("\n")
        .trim(),
      url: event.htmlLink ?? null,
    };
  });
}

export async function listGoogleIntegrationItems(
  userId: string,
  source: "gmail" | "calendar",
  query?: string,
) {
  const accessToken = await getValidAccessToken(userId);
  return source === "gmail"
    ? listGmailItems(accessToken, query)
    : listCalendarItems(accessToken, query);
}
