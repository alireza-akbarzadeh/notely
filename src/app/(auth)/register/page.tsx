"use client";

import { useRouter } from "next/navigation";
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
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth";
import { FieldGroup } from "@/components/ui/field";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);

    const result = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (result.error) {
      setServerError(result.error.message ?? "Unable to create account");
      return;
    }

    router.push("/workspace");
    router.refresh();
  }

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your Notely account"
      subtitle="One workspace for notes, spaces, and tags."
    >
      <AuthPanel>
        <SocialAuthButtons callbackURL="/workspace" className="mb-5" />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>
            <FormTextField
              control={form.control}
              name="name"
              label="Name"
              autoComplete="name"
              placeholder="Alex"
            />
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
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
            <FormPasswordField
              control={form.control}
              name="confirmPassword"
              label="Confirm password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
            />
          </FieldGroup>

          <AuthError message={serverError} />

          <AuthSubmit
            pending={form.formState.isSubmitting}
            pendingLabel="Creating account…"
          >
            Continue with email
          </AuthSubmit>
        </form>

        <div className="mt-6">
          <AuthFooterLink
            prompt="Already have an account?"
            href="/login"
            label="Sign in"
          />
        </div>
      </AuthPanel>
    </AuthShell>
  );
}
