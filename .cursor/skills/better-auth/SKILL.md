---
name: better-auth
description: >-
  Nexora Better Auth setup (Drizzle adapter, sessions, route protection). Use when
  changing auth config, login/register, sessions, requireSession, or src/lib/auth/**,
  src/proxy.ts, or /api/auth.
---

# Nexora Better Auth

## Layout

- Server: `src/lib/auth/index.ts` — `betterAuth` + `drizzleAdapter` + `twoFactor` + optional Google/Apple
- Social helpers: `src/lib/auth/social.ts` (Apple JWT secret, provider gates)
- Client: `src/lib/auth/client.ts` — `twoFactorClient` (`twoFactorPage: /two-factor`)
- UI: `src/components/auth/{auth-shell,auth-panel,social-auth}.tsx`
- Catch-all API: `src/app/api/auth/[...all]/route.ts`
- Edge/proxy guard: `src/proxy.ts` (`auth.api.getSession`)
- API helper: `src/lib/api/auth-guard.ts` → `requireSession()` / `jsonError()`
- Email: `src/lib/email/send.ts` — `EMAIL_PROVIDER=console|resend`

## Rules

- Email/password is enabled; min password length 8
- Google/Apple buttons always render on login/register; OAuth only succeeds when credentials are set and `NEXT_PUBLIC_AUTH_GOOGLE|APPLE=true`
- Google callback: `{BETTER_AUTH_URL}/api/auth/callback/google`
- Apple callback: `{BETTER_AUTH_URL}/api/auth/callback/apple` (+ `trustedOrigins` includes `https://appleid.apple.com`)
- `requireEmailVerification` stays **false** until a real email provider + domain is wired
- Password reset + verification emails go through `sendAuthEmail()` (console by default)
- Session: 7d expiry, 1d update age
- Env via `getEnv()` — never read social secrets ad hoc in feature code
- Auth tables live in `src/lib/db/schema.ts` (`user`, `session`, `account`, `verification`, `twoFactor`)
- Protected API routes must call `requireSession()` first and return its `response` on failure
- Public routes in proxy: `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/two-factor`; `/api/auth` and `/api/dev` stay open

## Pattern (API route)

```typescript
const { session, response } = await requireSession();
if (!session) return response!;
// use session.user.id
```

Do not invent a parallel auth system. Extend Better Auth plugins/config in `src/lib/auth/index.ts`.
