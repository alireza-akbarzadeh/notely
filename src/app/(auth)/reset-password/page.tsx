"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AuthError,
  AuthFooterLink,
  AuthPanel,
  AuthSubmit,
} from "@/components/auth/auth-panel";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormPasswordField } from "@/components/forms/form-password-field";
import { authClient } from "@/lib/auth/client";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth";
import { FieldGroup } from "@/components/ui/field";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const errorParam = searchParams.get("error");
  const [serverError, setServerError] = useState<string | null>(
    errorParam === "INVALID_TOKEN"
      ? "This reset link is invalid or expired."
      : null,
  );

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      setServerError("Missing reset token. Request a new password reset link.");
      return;
    }

    setServerError(null);

    const result = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });

    if (result.error) {
      setServerError(result.error.message ?? "Unable to reset password");
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <AuthShell
      eyebrow="New credentials"
      title="Choose a new password"
      subtitle="Pick something strong — you’ll use it to unlock your trading desk."
    >
      <AuthPanel>
        {!token && !errorParam ? (
          <div className="space-y-5">
            <AuthError message="Missing reset token." />
            <p className="text-sm text-muted-foreground">
              <Link href="/forgot-password" className="text-primary hover:underline">
                Request a new link
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FieldGroup>
              <FormPasswordField
                control={form.control}
                name="password"
                label="New password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
              />
              <FormPasswordField
                control={form.control}
                name="confirmPassword"
                label="Confirm password"
                autoComplete="new-password"
              />
            </FieldGroup>

            <AuthError message={serverError} />

            <AuthSubmit
              pending={form.formState.isSubmitting}
              pendingLabel="Saving…"
              disabled={!token}
            >
              Reset password
            </AuthSubmit>
          </form>
        )}

        <div className="mt-6">
          <AuthFooterLink prompt="" href="/login" label="Back to sign in" />
        </div>
      </AuthPanel>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
