"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormTextField } from "@/components/forms/form-text-field";
import { authClient } from "@/lib/auth/client";
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from "@/lib/validations/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

export function AccountSettings() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const user = session?.user;
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifyPending, setVerifyPending] = useState(false);

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (user?.name) {
      form.reset({ name: user.name });
    }
  }, [user?.name, form]);

  async function onSubmit(values: UpdateProfileFormValues) {
    setMessage(null);
    setError(null);

    const result = await authClient.updateUser({ name: values.name });
    if (result.error) {
      setError(result.error.message ?? "Unable to update profile");
      return;
    }

    setMessage("Profile updated.");
    await refetch();
  }

  async function resendVerification() {
    if (!user?.email) return;
    setVerifyPending(true);
    setMessage(null);
    setError(null);

    const result = await authClient.sendVerificationEmail({
      email: user.email,
      callbackURL: "/settings",
    });

    setVerifyPending(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to send verification email");
      return;
    }

    setMessage(
      "Verification email sent. With EMAIL_PROVIDER=console, check the server logs (or the link below after requesting).",
    );
  }

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Loading your profile…</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-24 animate-pulse rounded-lg bg-muted/60" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Update how you appear across notes and shared spaces.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl border border-border/70 bg-background/40 px-3.5 py-3">
          <p className="text-xs text-muted-foreground">Email</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{user?.email ?? "—"}</span>
            {user?.emailVerified ? (
              <Badge variant="secondary">Verified</Badge>
            ) : (
              <Badge variant="outline">Unverified</Badge>
            )}
          </div>
          {!user?.emailVerified ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              disabled={verifyPending}
              onClick={resendVerification}
            >
              {verifyPending ? "Sending…" : "Resend verification email"}
            </Button>
          ) : null}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <FormTextField
              control={form.control}
              name="name"
              label="Display name"
              autoComplete="name"
              placeholder="Your name"
            />
          </FieldGroup>

          {message ? <p className="text-xs text-buy">{message}</p> : null}
          {error ? <p className="text-xs text-destructive">{error}</p> : null}

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
