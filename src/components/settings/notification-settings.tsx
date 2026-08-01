"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getPushSubscriptionState,
  pushSupported,
  subscribeToPush,
  unsubscribeFromPush,
  ensureNotificationPermission,
} from "@/lib/notifications/push-client";
import { playReminderSound } from "@/lib/notifications/sound-player";
import {
  REMINDER_SOUND_LABELS,
  REMINDER_SOUNDS,
  type ReminderSound,
} from "@/lib/notifications/sounds";
import { cn } from "@/lib/utils";

const SOUND_PREF_KEY = "notely.reminderSound";

export function NotificationSettings() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [preferredSound, setPreferredSound] = useState<ReminderSound>("chime");
  const [pushConfigured, setPushConfigured] = useState(false);

  useEffect(() => {
    setSupported(pushSupported());
    const stored = localStorage.getItem(SOUND_PREF_KEY);
    if (stored && (REMINDER_SOUNDS as readonly string[]).includes(stored)) {
      setPreferredSound(stored as ReminderSound);
    }
    void (async () => {
      const state = await getPushSubscriptionState();
      setPermission(state.permission);
      setSubscribed(state.subscribed);
      const res = await fetch("/api/push/subscribe");
      if (res.ok) {
        const data = await res.json();
        setPushConfigured(Boolean(data.configured));
      }
    })();
  }, []);

  async function enablePush() {
    setBusy(true);
    setMessage(null);
    try {
      const perm = await ensureNotificationPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setMessage("Allow notifications in your browser to continue.");
        return;
      }
      if (pushConfigured) {
        await subscribeToPush();
        setSubscribed(true);
        setMessage("Push reminders enabled for this device.");
      } else {
        setMessage(
          "Browser alerts enabled. Add VAPID keys on the server for background push.",
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to enable notifications",
      );
    } finally {
      setBusy(false);
    }
  }

  async function disablePush() {
    setBusy(true);
    setMessage(null);
    try {
      await unsubscribeFromPush();
      setSubscribed(false);
      setMessage("Push reminders disabled on this device.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to disable push",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="size-4" />
          Reminders & alerts
        </CardTitle>
        <CardDescription>
          Sound cues when a note reminder or calendar event arrives, plus
          optional Web Push when the app is closed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            disabled={!supported || busy}
            onClick={() => void enablePush()}
            className="gap-1.5"
          >
            <Bell className="size-3.5" />
            {subscribed ? "Refresh permission" : "Enable notifications"}
          </Button>
          {subscribed ? (
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => void disablePush()}
            >
              Disable on this device
            </Button>
          ) : null}
        </div>

        <dl className="grid gap-1 text-xs text-muted-foreground">
          <div className="flex justify-between gap-2">
            <dt>Browser support</dt>
            <dd>{supported ? "Yes" : "Not available"}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>Permission</dt>
            <dd className="capitalize">{permission}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>Push subscription</dt>
            <dd>{subscribed ? "Active" : "Off"}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>Server Web Push</dt>
            <dd>{pushConfigured ? "Configured" : "Not configured"}</dd>
          </div>
        </dl>

        {message ? (
          <p className="text-xs text-muted-foreground">{message}</p>
        ) : null}

        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-sm font-medium">
            <Volume2 className="size-3.5" />
            Preview sounds
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {REMINDER_SOUNDS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setPreferredSound(value);
                  localStorage.setItem(SOUND_PREF_KEY, value);
                  if (value !== "none") void playReminderSound(value);
                }}
                className={cn(
                  "rounded-lg border px-2.5 py-2 text-left text-xs transition-colors",
                  preferredSound === value
                    ? "border-primary/60 bg-primary/10"
                    : "border-border/80 hover:bg-accent/50",
                )}
              >
                {REMINDER_SOUND_LABELS[value]}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Preferred preview sound is stored on this device. Each reminder can
            still pick its own tone.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
