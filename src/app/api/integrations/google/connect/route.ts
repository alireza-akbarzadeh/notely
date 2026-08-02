import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import { requireSession } from "@/lib/api/auth-guard";
import { getEnv } from "@/lib/env";
import {
  createGoogleAuthorizationUrl,
  isGoogleIntegrationConfigured,
} from "@/lib/google-integration";
import { workspacePath } from "@/lib/workspace/paths";

const STATE_COOKIE = "notely_google_oauth_state";
const RETURN_COOKIE = "notely_google_oauth_return";

function safeReturnTo(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return workspacePath({ view: "integration" });
  }
  return value;
}

export async function GET(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const returnTo = safeReturnTo(
    new URL(request.url).searchParams.get("returnTo"),
  );
  const appUrl = getEnv().NEXT_PUBLIC_APP_URL;
  const secure = appUrl.startsWith("https://");

  if (!(await isGoogleIntegrationConfigured(session.user.id))) {
    const url = new URL(returnTo, appUrl);
    url.searchParams.set("integration", "error");
    url.searchParams.set(
      "integrationError",
      "Add your Google Client ID and Client Secret first.",
    );
    return NextResponse.redirect(url);
  }

  const state = randomBytes(32).toString("base64url");
  const authUrl = await createGoogleAuthorizationUrl(session.user.id, state);
  const redirect = NextResponse.redirect(authUrl);
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
