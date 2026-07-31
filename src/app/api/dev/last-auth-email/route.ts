import { NextResponse } from "next/server";

import { getLastConsoleAuthEmail } from "@/lib/email/send";
import { getEnv } from "@/lib/env";

export async function GET() {
  const env = getEnv();

  if (env.EMAIL_PROVIDER !== "console") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const email = getLastConsoleAuthEmail();
  if (!email) {
    return NextResponse.json({ email: null });
  }

  return NextResponse.json({ email });
}
