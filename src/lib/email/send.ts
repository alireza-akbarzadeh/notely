import { getEnv } from "@/lib/env";

export type AuthEmailPayload = {
  to: string;
  subject: string;
  text: string;
};

let lastConsoleEmail: (AuthEmailPayload & { at: number }) | null = null;

export function getLastConsoleAuthEmail() {
  return lastConsoleEmail;
}

/**
 * Pluggable auth email sender.
 * Default `console` logs the message (and keeps the last payload for local UI).
 * Set EMAIL_PROVIDER=resend + RESEND_API_KEY + EMAIL_FROM when you have a domain.
 */
export async function sendAuthEmail(payload: AuthEmailPayload): Promise<void> {
  const env = getEnv();
  const provider = env.EMAIL_PROVIDER ?? "console";

  if (provider === "resend") {
    const apiKey = env.RESEND_API_KEY;
    const from = env.EMAIL_FROM;
    if (!apiKey || !from) {
      throw new Error(
        "EMAIL_PROVIDER=resend requires RESEND_API_KEY and EMAIL_FROM",
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [payload.to],
        subject: payload.subject,
        text: payload.text,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Resend failed (${response.status}): ${body}`);
    }
    return;
  }

  lastConsoleEmail = { ...payload, at: Date.now() };
  console.info(
    `[auth-email:console]\nto: ${payload.to}\nsubject: ${payload.subject}\n${payload.text}\n`,
  );
}
