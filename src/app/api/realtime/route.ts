import { requireSession } from "@/lib/api/auth-guard";
import { subscribe } from "@/lib/realtime/hub";
import type { RealtimeEvent } from "@/lib/realtime/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function encodeSse(event: RealtimeEvent) {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function GET() {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const userId = session.user.id;
  const encoder = new TextEncoder();
  let cleanup = () => {};
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: RealtimeEvent) => {
        try {
          controller.enqueue(encoder.encode(encodeSse(event)));
        } catch {
          cleanup();
        }
      };

      send({
        type: "connected",
        at: new Date().toISOString(),
        actorUserId: userId,
      });

      cleanup = subscribe(userId, send);

      heartbeat = setInterval(() => {
        send({ type: "ping", at: new Date().toISOString() });
      }, 25_000);
    },
    cancel() {
      if (heartbeat) clearInterval(heartbeat);
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
