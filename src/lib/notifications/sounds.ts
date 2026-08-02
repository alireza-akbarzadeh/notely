export const REMINDER_SOUNDS = ["chime", "bell", "soft", "none"] as const;

export type ReminderSound = (typeof REMINDER_SOUNDS)[number];

export const REMINDER_SOUND_LABELS: Record<ReminderSound, string> = {
  chime: "Chime",
  bell: "Bell",
  soft: "Soft pulse",
  none: "Silent",
};

export function isReminderSound(value: string): value is ReminderSound {
  return (REMINDER_SOUNDS as readonly string[]).includes(value);
}
