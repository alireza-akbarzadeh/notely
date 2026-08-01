import { NextRequest, NextResponse } from "next/server";

import { requireSession } from "@/lib/api/auth-guard";
import { getEnv } from "@/lib/env";
import { connectGoogleAccount } from "@/lib/google-integration";
import { workspacePath } from "@/lib/workspace/paths";

const STATE_COOKIE = "notely_google_oauth_state";
const RETURN_COOKIE = "notely_google_oauth_return";

function callbackRedirect(request: NextRequest, error?: string) {
  const appUrl = getEnv().NEXT_PUBLIC_APP_URL;
  const storedReturn = request.cookies.get(RETURN_COOKIE)?.value;
  const returnTo =
    storedReturn?.startsWith("/") && !storedReturn.startsWith("//")
      ? storedReturn
      : workspacePath({ view: "integration" });
  const url = new URL(returnTo, appUrl);
  url.searchParams.set("integration", error ? "error" : "google");
  if (error) url.searchParams.set("integrationError", error);
  const response = NextResponse.redirect(url);
  const expiredCookie = {
    httpOnly: true,
    secure: appUrl.startsWith("https://"),
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/api/integrations/google",
  };
  response.cookies.set(STATE_COOKIE, "", expiredCookie);
  response.cookies.set(RETURN_COOKIE, "", expiredCookie);
  return response;
}

export async function GET(request: NextRequest) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");
  const storedState = request.cookies.get(STATE_COOKIE)?.value;

  if (oauthError) return callbackRedirect(request, "Google access was denied");
  if (!code || !state || !storedState || state !== storedState) {
    return callbackRedirect(request, "Google connection expired. Try again.");
  }

  try {
    await connectGoogleAccount(session.user.id, code);
    return callbackRedirect(request);
  } catch {
    return callbackRedirect(request, "Could not connect Google Workspace");
  }
}
