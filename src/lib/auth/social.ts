import { importPKCS8, SignJWT } from "jose";

import type { Env } from "@/lib/env";

/** Normalize env-stored Apple .p8 material for jose `importPKCS8`. */
export function normalizeApplePrivateKey(privateKey: string) {
  let key = privateKey.trim();

  // Vercel / dotenv often wrap values in quotes
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }

  key = key.replace(/\\n/g, "\n").replace(/\r\n/g, "\n").trim();

  // Raw base64 body from a .p8 file (no PEM headers)
  if (!key.includes("BEGIN") && /^[A-Za-z0-9+/=\s]+$/.test(key)) {
    const body = key.replace(/\s+/g, "");
    const lines = body.match(/.{1,64}/g) ?? [body];
    key = `-----BEGIN PRIVATE KEY-----\n${lines.join("\n")}\n-----END PRIVATE KEY-----`;
  }

  return key;
}

export function looksLikePkcs8PrivateKey(privateKey: string) {
  const key = normalizeApplePrivateKey(privateKey);
  return (
    key.includes("-----BEGIN PRIVATE KEY-----") &&
    key.includes("-----END PRIVATE KEY-----")
  );
}

export async function generateAppleClientSecret(env: {
  clientId: string;
  teamId: string;
  keyId: string;
  privateKey: string;
}) {
  const normalizedKey = normalizeApplePrivateKey(env.privateKey);
  const key = await importPKCS8(normalizedKey, "ES256");
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: env.keyId })
    .setIssuer(env.teamId)
    .setSubject(env.clientId)
    .setAudience("https://appleid.apple.com")
    .setIssuedAt(now)
    .setExpirationTime(now + 180 * 24 * 60 * 60)
    .sign(key);
}

export function isGoogleAuthConfigured(env: Env) {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}

export function isAppleAuthConfigured(env: Env) {
  if (
    !(
      env.APPLE_CLIENT_ID &&
      env.APPLE_TEAM_ID &&
      env.APPLE_KEY_ID &&
      env.APPLE_PRIVATE_KEY
    )
  ) {
    return false;
  }

  if (!looksLikePkcs8PrivateKey(env.APPLE_PRIVATE_KEY)) {
    console.warn(
      "[auth] Apple Sign In disabled: APPLE_PRIVATE_KEY is not a PKCS#8 PEM key. Use the contents of your .p8 file (with -----BEGIN PRIVATE KEY-----) or a single line with \\n escapes.",
    );
    return false;
  }

  return true;
}
