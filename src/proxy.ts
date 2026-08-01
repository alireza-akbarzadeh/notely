import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

const exactPublicRoutes = new Set([
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/two-factor",
]);

function isPublicPath(pathname: string) {
  if (exactPublicRoutes.has(pathname)) return true;
  return [...exactPublicRoutes].some(
    (route) => route !== "/" && pathname.startsWith(`${route}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/dev") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/apple-icon") ||
    pathname.startsWith("/manifest") ||
    pathname === "/sw.js"
  ) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const publicRoute = isPublicPath(pathname);

  if (!session && !publicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    session &&
    publicRoute &&
    pathname !== "/" &&
    pathname !== "/two-factor" &&
    pathname !== "/reset-password"
  ) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
