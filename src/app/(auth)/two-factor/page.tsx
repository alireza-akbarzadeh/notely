"use client";

import { Shield } from "lucide-react";
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
import { FormTextField } from "@/components/forms/form-text-field";
import { authClient } from "@/lib/auth/client";
import {
  twoFactorCodeSchema,
  type TwoFactorCodeFormValues,
} from "@/lib/validations/auth";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export default function TwoFactorPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"totp" | "backup">("totp");
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<TwoFactorCodeFormValues>({
    resolver: zodResolver(twoFactorCodeSchema),
    defaultValues: {
      code: "",
      trustDevice: true,
    },
  });

  async function onSubmit(values: TwoFactorCodeFormValues) {
    setServerError(null);

    const result =
      mode === "totp"
        ? await authClient.twoFactor.verifyTotp({
            code: values.code,
            trustDevice: values.trustDevice ?? true,
          })
        : await authClient.twoFactor.verifyBackupCode({
            code: values.code,
            trustDevice: values.trustDevice ?? true,
          });

    if (result.error) {
      setServerError(result.error.message ?? "Invalid code");
      return;
    }

    router.push("/notes");
    router.refresh();
  }

  return (
    <AuthShell
      eyebrow="Second factor"
      title="Confirm it’s you"
      subtitle="Enter a code from your authenticator to unlock your workspace."
    >
      <AuthPanel>
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
          <div className="gradient-primary flex size-9 items-center justify-center rounded-lg">
            <Shield className="size-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Two-factor challenge</p>
            <p className="text-xs text-muted-foreground">
              Session completes after a valid code
            </p>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/[0.03] p-1">
            <button
              type="button"
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors",
                mode === "totp"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setMode("totp")}
            >
              Authenticator
            </button>
            <button
              type="button"
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors",
                mode === "backup"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setMode("backup")}
            >
              Backup code
            </button>
          </div>

          <FieldGroup>
            <FormTextField
              control={form.control}
              name="code"
              label={mode === "totp" ? "6-digit code" : "Backup code"}
              placeholder={mode === "totp" ? "123456" : "xxxxxxxx"}
              autoComplete="one-time-code"
            />
          </FieldGroup>

          <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="size-4 rounded border-input accent-primary"
              checked={form.watch("trustDevice") ?? true}
              onChange={(event) =>
                form.setValue("trustDevice", event.target.checked)
              }
            />
            Trust this device for 30 days
          </label>

          <AuthError message={serverError} />

          <AuthSubmit
            pending={form.formState.isSubmitting}
            pendingLabel="Verifying…"
          >
            Unlock dashboard
          </AuthSubmit>
        </form>

        <div className="mt-6">
          <AuthFooterLink prompt="" href="/login" label="Back to sign in" />
        </div>
      </AuthPanel>
    </AuthShell>
  );
}
