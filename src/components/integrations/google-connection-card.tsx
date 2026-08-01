"use client";

import { useState } from "react";
import {
  CalendarDays,
  KeyRound,
  LoaderCircle,
  Mail,
  Plug,
  Unplug,
} from "lucide-react";

import { GoogleCredentialsDialog } from "@/components/integrations/google-credentials-dialog";
import {
  useCallbackError,
  useGoogleConnection,
} from "@/components/integrations/use-google-connection";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { workspacePath } from "@/lib/workspace/paths";

const SCOPES = [
  {
    icon: Mail,
    label: "Gmail",
    description: "Read recent messages and import them into a note.",
  },
  {
    icon: CalendarDays,
    label: "Google Calendar",
    description: "Browse upcoming events and import their details.",
  },
];

export function GoogleConnectionCard() {
  const {
    statusQuery,
    disconnectMutation,
    saveCredentialsMutation,
    clearCredentialsMutation,
    connect,
    connected,
  } = useGoogleConnection();
  const callbackError = useCallbackError();
  const [credentialsOpen, setCredentialsOpen] = useState(false);

  if (statusQuery.isLoading) {
    return (
      <Card>
        <CardContent className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
          <LoaderCircle className="mr-2 size-4 animate-spin" />
          Loading connection status…
        </CardContent>
      </Card>
    );
  }

  if (statusQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load integrations</AlertTitle>
        <AlertDescription>{statusQuery.error.message}</AlertDescription>
      </Alert>
    );
  }

  const configured = statusQuery.data?.configured === true;
  const credentialSource = statusQuery.data?.credentialSource ?? null;
  const redirectUri = statusQuery.data?.redirectUri ?? "";

  function startConnect() {
    if (configured) {
      connect(
        workspacePath({
          view: "integration",
          params: { integration: "google" },
        }),
      );
      return;
    }
    setCredentialsOpen(true);
  }

  return (
    <div className="space-y-3">
      {callbackError ? (
        <Alert variant="destructive">
          <AlertTitle>Google was not connected</AlertTitle>
          <AlertDescription>{callbackError}</AlertDescription>
        </Alert>
      ) : null}

      {disconnectMutation.isError ? (
        <Alert variant="destructive">
          <AlertDescription>
            {disconnectMutation.error.message}
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="flex flex-wrap items-center gap-2">
                Google Workspace
                <Badge variant={connected ? "default" : "outline"}>
                  {connected ? "Connected" : "Not connected"}
                </Badge>
              </CardTitle>
              <CardDescription className="truncate">
                {connected
                  ? statusQuery.data?.email
                  : "Gmail and Google Calendar, read-only."}
              </CardDescription>
            </div>
          </div>
          <CardAction className="flex flex-wrap gap-2">
            {!connected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCredentialsOpen(true)}
              >
                <KeyRound />
                {configured ? "Credentials" : "Add credentials"}
              </Button>
            ) : null}
            {connected ? (
              <Button
                variant="outline"
                size="sm"
                disabled={disconnectMutation.isPending}
                onClick={() => disconnectMutation.mutate()}
              >
                {disconnectMutation.isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Unplug />
                )}
                Disconnect
              </Button>
            ) : (
              <Button size="sm" onClick={startConnect}>
                <Plug />
                Connect
              </Button>
            )}
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-3">
          {!configured ? (
            <Alert>
              <AlertTitle>Add your Google OAuth app</AlertTitle>
              <AlertDescription>
                Enter a Client ID and Client Secret from Google Cloud Console,
                enable the Gmail and Calendar APIs, and register the redirect
                URI shown in the dialog.
              </AlertDescription>
            </Alert>
          ) : (
            <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              Using{" "}
              {credentialSource === "user"
                ? `your saved credentials (${statusQuery.data?.clientIdHint})`
                : `server credentials (${statusQuery.data?.clientIdHint})`}
              {credentialSource === "user" ? (
                <>
                  .{" "}
                  <button
                    type="button"
                    className="underline underline-offset-2 hover:text-foreground"
                    disabled={clearCredentialsMutation.isPending}
                    onClick={() => clearCredentialsMutation.mutate()}
                  >
                    Remove saved credentials
                  </button>
                </>
              ) : null}
            </p>
          )}

          <ul className="space-y-2">
            {SCOPES.map((scope) => (
              <li key={scope.label} className="flex items-start gap-3">
                <scope.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{scope.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {scope.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {connected ? (
            <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              To pull content in, open a note and choose the plug icon in the
              editor toolbar.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <GoogleCredentialsDialog
        open={credentialsOpen}
        onOpenChange={setCredentialsOpen}
        redirectUri={redirectUri}
        pending={saveCredentialsMutation.isPending}
        error={saveCredentialsMutation.error?.message ?? null}
        onSubmit={(values) => {
          saveCredentialsMutation.mutate(values, {
            onSuccess: () => {
              setCredentialsOpen(false);
              connect(
                workspacePath({
                  view: "integration",
                  params: { integration: "google" },
                }),
              );
            },
          });
        }}
      />
    </div>
  );
}
