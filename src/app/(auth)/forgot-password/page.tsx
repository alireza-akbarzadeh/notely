"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AuthError,
  AuthFooterLink,
  AuthPanel,
  AuthSubmit,
} from "@/components/auth/auth-panel";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormTextField } from "@/components/forms/form-text-field";
import { authClient } from "@/lib/auth/client";
import {
  autofillSafeSubmit,
  scrollToFirstInvalidField,
} from "@/lib/forms/autofill-submit";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/auth";
import { FieldGroup } from "@/components/ui/field";

type DevAuthEmail = {
  to: string;
  subject: string;
  text: string;
  at: number;
};

function extractUrl(text: string) {
  const match = text.match(/https?:\/\/\S+/);
  return match?.[0] ?? null;
}

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [devEmail, setDevEmail] = useState<DevAuthEmail | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setServerError(null);
    setDevEmail(null);

    const result = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (result.error) {
      setServerError(result.error.message ?? "Unable to send reset email");
      return;
    }

    setSent(true);

    try {
      const response = await fetch("/api/dev/last-auth-email");
      if (response.ok) {
        const data = (await response.json()) as { email: DevAuthEmail | null };
        if (data.email) setDevEmail(data.email);
      }
    } catch {
      // Console provider only; ignore if unavailable.
    }
  }

  function onInvalid() {
    setServerError("Check the highlighted fields and try again.");
    scrollToFirstInvalidField();
  }

  const devLink = devEmail ? extractUrl(devEmail.text) : null;

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      subtitle="We’ll send a secure link so you can get back to your desk."
    >
      <AuthPanel>
        {sent ? (
          <div className="space-y-5">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-foreground">
                If that email is on Notely, a reset link was sent.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Console email mode logs the link in the server terminal.
              </p>
            </div>

            {devLink ? (
              <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-mono text-[10px] tracking-wider text-primary uppercase">
                  Dev console link
                </p>
                <p className="text-xs text-muted-foreground">{devEmail?.subject}</p>
                <Link
                  href={devLink}
                  className="break-all font-mono text-sm text-primary hover:underline"
                >
                  {devLink}
                </Link>
              </div>
            ) : null}

            <AuthFooterLink prompt="" href="/login" label="Back to sign in" />
          </div>
        ) : (
          <form
            onSubmit={autofillSafeSubmit(form, onSubmit, onInvalid)}
            className="space-y-5"
          >
            <FieldGroup>
              <FormTextField
                control={form.control}
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@notely.app"
              />
            </FieldGroup>

            <AuthError message={serverError} />

            <AuthSubmit
              pending={form.formState.isSubmitting}
              pendingLabel="Sending…"
            >
              Send reset link
            </AuthSubmit>

            <AuthFooterLink prompt="" href="/login" label="Back to sign in" />
          </form>
        )}
      </AuthPanel>
    </AuthShell>
  );
}
