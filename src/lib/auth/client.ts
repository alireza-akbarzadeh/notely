"use client";

import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

/**
 * Do not pass NEXT_PUBLIC_APP_URL here. That value is inlined at build time, so a
 * Vercel deploy built with localhost (or an outdated domain) makes sign-in call
 * the wrong origin — on iPhone it looks like the button does nothing.
 *
 * Omitting baseURL lets Better Auth use same-origin `/api/auth`.
 */
export const authClient = createAuthClient({
  plugins: [
    twoFactorClient({
      twoFactorPage: "/two-factor",
    }),
  ],
});
