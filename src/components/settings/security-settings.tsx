"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import QRCode from "react-qr-code";

import { FormPasswordField } from "@/components/forms/form-password-field";
import { FormTextField } from "@/components/forms/form-text-field";
import { authClient } from "@/lib/auth/client";
import {
  changePasswordSchema,
  twoFactorCodeSchema,
  twoFactorPasswordSchema,
  type ChangePasswordFormValues,
  type TwoFactorCodeFormValues,
  type TwoFactorPasswordFormValues,
} from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

type SessionRow = {
  id: string;
  token: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  expiresAt: Date | string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

function formatDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleString();
}

function truncateUa(ua?: string | null) {
  if (!ua) return "Unknown device";
  return ua.length > 72 ? `${ua.slice(0, 72)}…` : ua;
}

export function SecuritySettings() {
  const { data: session, refetch } = authClient.useSession();
  const twoFactorEnabled = Boolean(
    (session?.user as { twoFactorEnabled?: boolean } | undefined)
      ?.twoFactorEnabled,
  );

  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [twoFactorMessage, setTwoFactorMessage] = useState<string | null>(null);
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);

  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [sessionsPending, setSessionsPending] = useState(false);

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const enableForm = useForm<TwoFactorPasswordFormValues>({
    resolver: zodResolver(twoFactorPasswordSchema),
    defaultValues: { password: "" },
  });

  const verifyForm = useForm<TwoFactorCodeFormValues>({
    resolver: zodResolver(twoFactorCodeSchema),
    defaultValues: { code: "", trustDevice: true },
  });

  const disableForm = useForm<TwoFactorPasswordFormValues>({
    resolver: zodResolver(twoFactorPasswordSchema),
    defaultValues: { password: "" },
  });

  const loadSessions = useCallback(async () => {
    setSessionsPending(true);
    setSessionsError(null);
    const result = await authClient.listSessions();
    setSessionsPending(false);

    if (result.error) {
      setSessionsError(result.error.message ?? "Unable to load sessions");
      return;
    }

    setSessions((result.data ?? []) as SessionRow[]);
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  async function onChangePassword(values: ChangePasswordFormValues) {
    setPasswordMessage(null);
    setPasswordError(null);

    const result = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: true,
    });

    if (result.error) {
      setPasswordError(result.error.message ?? "Unable to change password");
      return;
    }

    passwordForm.reset();
    setPasswordMessage("Password updated. Other sessions were signed out.");
    await loadSessions();
  }

  async function onEnableTwoFactor(values: TwoFactorPasswordFormValues) {
    setTwoFactorMessage(null);
    setTwoFactorError(null);

    const result = await authClient.twoFactor.enable({
      password: values.password,
      issuer: "Notely",
    });

    if (result.error) {
      setTwoFactorError(result.error.message ?? "Unable to enable 2FA");
      return;
    }

    setTotpUri(result.data?.totpURI ?? null);
    setBackupCodes(result.data?.backupCodes ?? null);
    setTwoFactorMessage(
      "Scan the QR code, then enter a code from your authenticator to finish enabling 2FA.",
    );
  }

  async function onVerifyTotp(values: TwoFactorCodeFormValues) {
    setTwoFactorMessage(null);
    setTwoFactorError(null);

    const result = await authClient.twoFactor.verifyTotp({
      code: values.code,
      trustDevice: values.trustDevice ?? true,
    });

    if (result.error) {
      setTwoFactorError(result.error.message ?? "Invalid verification code");
      return;
    }

    setTotpUri(null);
    setTwoFactorMessage("Two-factor authentication is now enabled.");
    verifyForm.reset({ code: "", trustDevice: true });
    enableForm.reset({ password: "" });
    await refetch();
  }

  async function onDisableTwoFactor(values: TwoFactorPasswordFormValues) {
    setTwoFactorMessage(null);
    setTwoFactorError(null);

    const result = await authClient.twoFactor.disable({
      password: values.password,
    });

    if (result.error) {
      setTwoFactorError(result.error.message ?? "Unable to disable 2FA");
      return;
    }

    setTotpUri(null);
    setBackupCodes(null);
    disableForm.reset({ password: "" });
    setTwoFactorMessage("Two-factor authentication disabled.");
    await refetch();
  }

  async function revokeSession(token: string) {
    setSessionsError(null);
    const result = await authClient.revokeSession({ token });
    if (result.error) {
      setSessionsError(result.error.message ?? "Unable to revoke session");
      return;
    }
    await loadSessions();
  }

  async function revokeOtherSessions() {
    setSessionsError(null);
    const result = await authClient.revokeOtherSessions();
    if (result.error) {
      setSessionsError(result.error.message ?? "Unable to revoke sessions");
      return;
    }
    await loadSessions();
  }

  const currentToken = session?.session?.token;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit(onChangePassword)}
            className="space-y-4"
          >
            <FieldGroup>
              <FormPasswordField
                control={passwordForm.control}
                name="currentPassword"
                label="Current password"
                autoComplete="current-password"
              />
              <FormPasswordField
                control={passwordForm.control}
                name="newPassword"
                label="New password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
              />
              <FormPasswordField
                control={passwordForm.control}
                name="confirmPassword"
                label="Confirm new password"
                autoComplete="new-password"
              />
            </FieldGroup>

            {passwordMessage ? (
              <p className="text-xs text-buy">{passwordMessage}</p>
            ) : null}
            {passwordError ? (
              <p className="text-xs text-destructive">{passwordError}</p>
            ) : null}

            <Button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
            >
              {passwordForm.formState.isSubmitting
                ? "Updating…"
                : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {twoFactorEnabled
              ? "Authenticator app 2FA is enabled on your account."
              : "Add a TOTP authenticator app for an extra sign-in step."}
          </p>

          {!twoFactorEnabled && !totpUri ? (
            <form
              onSubmit={enableForm.handleSubmit(onEnableTwoFactor)}
              className="space-y-4"
            >
              <FieldGroup>
                <FormPasswordField
                  control={enableForm.control}
                  name="password"
                  label="Confirm password"
                  autoComplete="current-password"
                />
              </FieldGroup>
              <Button type="submit" disabled={enableForm.formState.isSubmitting}>
                {enableForm.formState.isSubmitting
                  ? "Generating…"
                  : "Enable 2FA"}
              </Button>
            </form>
          ) : null}

          {totpUri ? (
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-white p-3">
                <QRCode value={totpUri} size={160} />
              </div>
              {backupCodes?.length ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Backup codes</p>
                  <p className="text-xs text-muted-foreground">
                    Store these somewhere safe. Each code works once.
                  </p>
                  <ul className="grid grid-cols-2 gap-1 font-mono text-xs">
                    {backupCodes.map((code) => (
                      <li key={code}>{code}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <form
                onSubmit={verifyForm.handleSubmit(onVerifyTotp)}
                className="space-y-4"
              >
                <FieldGroup>
                  <FormTextField
                    control={verifyForm.control}
                    name="code"
                    label="Authenticator code"
                    placeholder="123456"
                    autoComplete="one-time-code"
                  />
                </FieldGroup>
                <Button
                  type="submit"
                  disabled={verifyForm.formState.isSubmitting}
                >
                  {verifyForm.formState.isSubmitting
                    ? "Verifying…"
                    : "Confirm and enable"}
                </Button>
              </form>
            </div>
          ) : null}

          {twoFactorEnabled ? (
            <form
              onSubmit={disableForm.handleSubmit(onDisableTwoFactor)}
              className="space-y-4"
            >
              <FieldGroup>
                <FormPasswordField
                  control={disableForm.control}
                  name="password"
                  label="Password to disable 2FA"
                  autoComplete="current-password"
                />
              </FieldGroup>
              <Button
                type="submit"
                variant="destructive"
                disabled={disableForm.formState.isSubmitting}
              >
                {disableForm.formState.isSubmitting
                  ? "Disabling…"
                  : "Disable 2FA"}
              </Button>
            </form>
          ) : null}

          {twoFactorMessage ? (
            <p className="text-xs text-buy">{twoFactorMessage}</p>
          ) : null}
          {twoFactorError ? (
            <p className="text-xs text-destructive">{twoFactorError}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void loadSessions()}
              disabled={sessionsPending}
            >
              Refresh
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void revokeOtherSessions()}
            >
              Sign out other devices
            </Button>
          </div>

          {sessionsError ? (
            <p className="text-xs text-destructive">{sessionsError}</p>
          ) : null}

          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active sessions.</p>
          ) : (
            <ul className="space-y-3">
              {sessions.map((row) => {
                const isCurrent = row.token === currentToken;
                return (
                  <li
                    key={row.id}
                    className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 space-y-1 text-sm">
                      <p className="font-medium">
                        {truncateUa(row.userAgent)}
                        {isCurrent ? (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (this device)
                          </span>
                        ) : null}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {row.ipAddress ?? "Unknown IP"} · Created{" "}
                        {formatDate(row.createdAt)} · Expires{" "}
                        {formatDate(row.expiresAt)}
                      </p>
                    </div>
                    {!isCurrent ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => void revokeSession(row.token)}
                      >
                        Revoke
                      </Button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
