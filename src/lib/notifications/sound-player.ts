import type { ReminderSound } from "@/lib/notifications/sounds";

let sharedCtx: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedCtx) sharedCtx = new Ctx();
  return sharedCtx;
}

function tone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  type: OscillatorType,
  gainValue: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/** Play a synthesized reminder sound (no asset files). */
export async function playReminderSound(sound: ReminderSound | string) {
  if (sound === "none") return;
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      return;
    }
  }

  const t = ctx.currentTime;

  if (sound === "bell") {
    tone(ctx, 880, t, 0.35, "sine", 0.18);
    tone(ctx, 1174, t + 0.08, 0.4, "sine", 0.12);
    tone(ctx, 1480, t + 0.16, 0.5, "triangle", 0.08);
    return;
  }

  if (sound === "soft") {
    tone(ctx, 392, t, 0.45, "sine", 0.1);
    tone(ctx, 523, t + 0.2, 0.5, "sine", 0.08);
    return;
  }

  // chime (default)
  tone(ctx, 659, t, 0.18, "sine", 0.16);
  tone(ctx, 880, t + 0.14, 0.22, "sine", 0.14);
  tone(ctx, 1047, t + 0.28, 0.35, "triangle", 0.1);
}
