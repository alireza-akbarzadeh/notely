import {
  listDueReminders,
  listReminders,
  markReminderFired,
  type ReminderSummary,
} from "@/lib/notes/reminders";
import { sendReminderPush } from "@/lib/notifications/push";

async function fireReminder(reminder: ReminderSummary) {
  const push = await sendReminderPush(reminder.userId, reminder);
  await markReminderFired(reminder.id);
  return {
    reminderId: reminder.id,
    sent: push.sent,
    skipped: push.skipped,
  };
}

/** Cron / scheduled job: all users. */
export async function dispatchDueReminders(limit = 100) {
  const due = await listDueReminders(new Date(), limit);
  const results = [];
  for (const reminder of due) {
    results.push(await fireReminder(reminder));
  }
  return {
    processed: due.length,
    results,
    reminders: due,
  };
}

/** Authenticated user: only their due reminders (in-app / local ack). */
export async function dispatchUserDueReminders(userId: string) {
  const now = new Date();
  const pending = await listReminders(userId, {
    status: "pending",
    to: now,
  });
  const results = [];
  for (const reminder of pending) {
    results.push(await fireReminder(reminder));
  }
  return {
    processed: pending.length,
    results,
    reminders: pending,
  };
}
