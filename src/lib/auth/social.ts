import { importPKCS8, SignJWT } from "jose";

import type { Env } from "@/lib/env";

export async function generateAppleClientSecret(env: {
  clientId: string;
  teamId: string;
  keyId: string;
  privateKey: string;
}) {
  const normalizedKey = env.privateKey.includes("\\n")
    ? env.privateKey.replace(/\\n/g, "\n")
    : env.privateKey;

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
  return Boolean(
    env.APPLE_CLIENT_ID &&
      env.APPLE_TEAM_ID &&
      env.APPLE_KEY_ID &&
      env.APPLE_PRIVATE_KEY,
  );
}
