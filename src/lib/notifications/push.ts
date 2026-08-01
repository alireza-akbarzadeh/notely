import { and, eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import webpush from "web-push";

import { db, pushSubscriptions } from "@/lib/db";
import { getEnv } from "@/lib/env";
import type { ReminderSummary } from "@/lib/notes/reminders";

export type PushSubscriptionInput = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

function configureWebPush() {
  const env = getEnv();
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) {
    return false;
  }
  webpush.setVapidDetails(
    env.VAPID_SUBJECT ?? "mailto:notifications@notely.app",
    env.VAPID_PUBLIC_KEY,
    env.VAPID_PRIVATE_KEY,
  );
  return true;
}

export function isPushConfigured() {
  const env = getEnv();
  return Boolean(env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY);
}

export async function savePushSubscription(
  userId: string,
  subscription: PushSubscriptionInput,
  userAgent?: string | null,
) {
  const now = new Date();
  const [existing] = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, subscription.endpoint))
    .limit(1);

  if (existing) {
    await db
      .update(pushSubscriptions)
      .set({
        userId,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent: userAgent ?? existing.userAgent,
        updatedAt: now,
      })
      .where(eq(pushSubscriptions.id, existing.id));
    return existing.id;
  }

  const id = randomUUID();
  await db.insert(pushSubscriptions).values({
    id,
    userId,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
    userAgent: userAgent ?? null,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function removePushSubscription(
  userId: string,
  endpoint: string,
) {
  const [existing] = await db
    .select()
    .from(pushSubscriptions)
    .where(
      and(
        eq(pushSubscriptions.userId, userId),
        eq(pushSubscriptions.endpoint, endpoint),
      ),
    )
    .limit(1);
  if (!existing) return false;
  await db
    .delete(pushSubscriptions)
    .where(eq(pushSubscriptions.id, existing.id));
  return true;
}

export async function listUserPushSubscriptions(userId: string) {
  return db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));
}

function reminderUrl(reminder: ReminderSummary) {
  if (reminder.noteId) return `/notes/${reminder.noteId}`;
  if (reminder.eventId) return `/calendar`;
  return "/notes";
}

export async function sendReminderPush(
  userId: string,
  reminder: ReminderSummary,
) {
  if (!configureWebPush()) {
    return { sent: 0, skipped: true as const };
  }

  const subs = await listUserPushSubscriptions(userId);
  if (subs.length === 0) return { sent: 0, skipped: false as const };

  const payload = JSON.stringify({
    title: reminder.title,
    body: reminder.body ?? "Reminder from Notely",
    sound: reminder.sound,
    url: reminderUrl(reminder),
    reminderId: reminder.id,
    noteId: reminder.noteId,
    eventId: reminder.eventId,
  });

  let sent = 0;
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        payload,
      );
      sent += 1;
    } catch (error) {
      const statusCode =
        typeof error === "object" &&
        error &&
        "statusCode" in error &&
        typeof (error as { statusCode?: unknown }).statusCode === "number"
          ? (error as { statusCode: number }).statusCode
          : null;
      if (statusCode === 404 || statusCode === 410) {
        await db
          .delete(pushSubscriptions)
          .where(eq(pushSubscriptions.id, sub.id));
      }
    }
  }

  return { sent, skipped: false as const };
}
