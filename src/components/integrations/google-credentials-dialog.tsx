"use client";

import { useState } from "react";
import { Copy, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type GoogleCredentialsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectUri: string;
  pending?: boolean;
  error?: string | null;
  onSubmit: (values: { clientId: string; clientSecret: string }) => void;
};

export function GoogleCredentialsDialog({
  open,
  onOpenChange,
  redirectUri,
  pending = false,
  error = null,
  onSubmit,
}: GoogleCredentialsDialogProps) {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [copied, setCopied] = useState(false);

  function handleOpenChange(next: boolean) {
    if (!next) {
      setClientId("");
      setClientSecret("");
      setCopied(false);
    }
    onOpenChange(next);
  }

  function handleSubmit() {
    const id = clientId.trim();
    const secret = clientSecret.trim();
    if (!id || !secret || pending) return;
    onSubmit({ clientId: id, clientSecret: secret });
  }

  async function copyRedirectUri() {
    try {
      await navigator.clipboard.writeText(redirectUri);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Google OAuth credentials</DialogTitle>
          <DialogDescription>
            Paste your Google Cloud OAuth Client ID and Client Secret. Enable
            the Gmail and Calendar APIs, then add the redirect URI below to your
            OAuth client.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-1">
          <div className="grid gap-1.5">
            <Label htmlFor="google-client-id">Client ID</Label>
            <Input
              id="google-client-id"
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
              placeholder="xxxx.apps.googleusercontent.com"
              autoComplete="off"
              autoFocus
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="google-client-secret">Client secret</Label>
            <Input
              id="google-client-secret"
              type="password"
              value={clientSecret}
              onChange={(event) => setClientSecret(event.target.value)}
              placeholder="GOCSPX-…"
              autoComplete="off"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="google-redirect-uri">Authorized redirect URI</Label>
            <div className="flex gap-2">
              <Input
                id="google-redirect-uri"
                value={redirectUri}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Copy redirect URI"
                onClick={copyRedirectUri}
              >
                <Copy />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {copied
                ? "Copied to clipboard."
                : "Add this exact URI in Google Cloud Console → Credentials."}
            </p>
          </div>
          {error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            disabled={!clientId.trim() || !clientSecret.trim() || pending}
            onClick={handleSubmit}
          >
            {pending ? <LoaderCircle className="animate-spin" /> : null}
            {pending ? "Saving…" : "Save & connect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
