const SW_PATH = "/sw.js";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

export function pushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export async function registerNotelyServiceWorker() {
  if (!pushSupported()) return null;
  return navigator.serviceWorker.register(SW_PATH);
}

export async function ensureNotificationPermission() {
  if (!("Notification" in window)) return "denied" as NotificationPermission;
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

export async function subscribeToPush() {
  if (!pushSupported()) {
    throw new Error("Push notifications are not supported in this browser");
  }

  const configRes = await fetch("/api/push/subscribe");
  const config = await configRes.json();
  if (!config.configured || !config.publicKey) {
    throw new Error("Web Push is not configured on the server");
  }

  const permission = await ensureNotificationPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted");
  }

  await registerNotelyServiceWorker();
  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.publicKey),
    });
  }

  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error("Invalid push subscription");
  }

  const response = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: json.endpoint,
      keys: {
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
      },
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Failed to save push subscription");
  }

  return subscription;
}

export async function unsubscribeFromPush() {
  if (!pushSupported()) return false;
  const registration = await navigator.serviceWorker.getRegistration(SW_PATH);
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return false;

  await fetch("/api/push/subscribe", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  });
  await subscription.unsubscribe();
  return true;
}

export async function getPushSubscriptionState() {
  if (!pushSupported()) {
    return { supported: false, subscribed: false, permission: "denied" as const };
  }
  const permission = Notification.permission;
  const registration = await navigator.serviceWorker.getRegistration(SW_PATH);
  const subscription = await registration?.pushManager.getSubscription();
  return {
    supported: true,
    subscribed: Boolean(subscription),
    permission,
  };
}
