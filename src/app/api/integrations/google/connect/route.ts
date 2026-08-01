import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import { requireSession } from "@/lib/api/auth-guard";
import { getEnv } from "@/lib/env";
import { createGoogleAuthorizationUrl } from "@/lib/google-integration";

const STATE_COOKIE = "notely_google_oauth_state";
const RETURN_COOKIE = "notely_google_oauth_return";

function safeReturnTo(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/notes";
  }
  return value;
}

export async function GET(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const state = randomBytes(32).toString("base64url");
  const returnTo = safeReturnTo(new URL(request.url).searchParams.get("returnTo"));
  const redirect = NextResponse.redirect(createGoogleAuthorizationUrl(state));
  const secure = getEnv().NEXT_PUBLIC_APP_URL.startsWith("https://");
  const cookieOptions = {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    maxAge: 10 * 60,
    path: "/api/integrations/google",
  };
  redirect.cookies.set(STATE_COOKIE, state, cookieOptions);
  redirect.cookies.set(RETURN_COOKIE, returnTo, cookieOptions);
  return redirect;
}
