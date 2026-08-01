"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { SocialAuthButtons } from "@/components/auth/social-auth";
import { FormPasswordField } from "@/components/forms/form-password-field";
import { FormTextField } from "@/components/forms/form-text-field";
import { authClient } from "@/lib/auth/client";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth";
import { FieldGroup } from "@/components/ui/field";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/workspace";
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);

    const result = await authClient.signIn.email(values);

    if (result.error) {
      setServerError(result.error.message ?? "Unable to sign in");
      return;
    }

    if (
      result.data &&
      "twoFactorRedirect" in result.data &&
      result.data.twoFactorRedirect
    ) {
      router.push("/two-factor");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to Notely"
      subtitle="Access your spaces, notes, and tags."
    >
      <AuthPanel>
        <SocialAuthButtons callbackURL={callbackUrl} className="mb-5" />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>
            <FormTextField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@notely.app"
            />
            <FormPasswordField
              control={form.control}
              name="password"
              label="Password"
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </FieldGroup>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Forgot password?
            </Link>
          </div>

          <AuthError message={serverError} />

          <AuthSubmit
            pending={form.formState.isSubmitting}
            pendingLabel="Signing in…"
          >
            Sign in with email
          </AuthSubmit>
        </form>

        <div className="mt-6">
          <AuthFooterLink
            prompt="New to Notely?"
            href="/register"
            label="Create an account"
          />
        </div>
      </AuthPanel>
    </AuthShell>
  );
}
