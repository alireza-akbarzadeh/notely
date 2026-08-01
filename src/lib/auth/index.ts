import { dash } from "@better-auth/infra";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { sendAuthEmail } from "@/lib/email/send";
import { getEnv } from "@/lib/env";
import { importPKCS8 } from "jose";

import {
  generateAppleClientSecret,
  isAppleAuthConfigured,
  isGoogleAuthConfigured,
  normalizeApplePrivateKey,
} from "@/lib/auth/social";

const env = getEnv();
const googleEnabled = isGoogleAuthConfigured(env);

async function resolveAppleEnabled() {
  if (!isAppleAuthConfigured(env)) return false;
  try {
    await importPKCS8(
      normalizeApplePrivateKey(env.APPLE_PRIVATE_KEY!),
      "ES256",
    );
    return true;
  } catch (error) {
    console.warn(
      "[auth] Apple Sign In disabled: APPLE_PRIVATE_KEY failed PKCS#8 import.",
      error,
    );
    return false;
  }
}

const appleEnabled = await resolveAppleEnabled();

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, "");
}

export const auth = betterAuth({
  appName: "Notely",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      twoFactor: schema.twoFactor,
    },
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: normalizeBaseUrl(env.BETTER_AUTH_URL ?? env.NEXT_PUBLIC_APP_URL),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      void sendAuthEmail({
        to: user.email,
        subject: "Reset your Notely password",
        text: `Reset your password using this link:\n${url}\n\nIf you did not request this, you can ignore this email.`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendAuthEmail({
        to: user.email,
        subject: "Verify your Notely email",
        text: `Verify your email using this link:\n${url}\n\nIf you did not create a Notely account, you can ignore this email.`,
      });
    },
  },
  socialProviders: {
    ...(googleEnabled
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID!,
            clientSecret: env.GOOGLE_CLIENT_SECRET!,
            prompt: "select_account",
            accessType: "offline" as const,
          },
        }
      : {}),
    ...(appleEnabled
      ? {
          apple: async () => ({
            clientId: env.APPLE_CLIENT_ID!,
            clientSecret: await generateAppleClientSecret({
              clientId: env.APPLE_CLIENT_ID!,
              teamId: env.APPLE_TEAM_ID!,
              keyId: env.APPLE_KEY_ID!,
              privateKey: env.APPLE_PRIVATE_KEY!,
            }),
            ...(env.APPLE_APP_BUNDLE_IDENTIFIER
              ? { appBundleIdentifier: env.APPLE_APP_BUNDLE_IDENTIFIER }
              : {}),
          }),
        }
      : {}),
  },
  trustedOrigins: appleEnabled ? ["https://appleid.apple.com"] : [],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  plugins: [
    twoFactor({
      issuer: "Notely",
    }),
    ...(env.BETTER_AUTH_API_KEY
      ? [
          dash({
            apiKey: env.BETTER_AUTH_API_KEY,
          }),
        ]
      : []),
  ],
});

export type Session = typeof auth.$Infer.Session;
