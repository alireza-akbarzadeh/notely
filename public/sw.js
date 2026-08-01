/* Notely service worker — Web Push + notification click routing */

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {
    title: "Notely reminder",
    body: "You have a reminder",
    url: "/notes",
    sound: "chime",
    reminderId: null,
  };

  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch {
    // keep defaults
  }

  const options = {
    body: data.body,
    icon: "/window.svg",
    badge: "/window.svg",
    tag: data.reminderId ? `reminder-${data.reminderId}` : "notely-reminder",
    renotify: true,
    data: {
      url: data.url || "/notes",
      sound: data.sound || "chime",
      reminderId: data.reminderId,
    },
    vibrate: data.sound === "none" ? [] : [120, 60, 120],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Notely", options).then(
      () => {
        // Notify open clients so they can play Web Audio (SW cannot reliably play custom tones).
        return self.clients
          .matchAll({ type: "window", includeUncontrolled: true })
          .then((clients) => {
            for (const client of clients) {
              client.postMessage({
                type: "notely-reminder",
                payload: data,
              });
            }
          });
      },
    ),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/notes";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if ("focus" in client) {
            client.postMessage({
              type: "notely-open",
              url,
            });
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
        return undefined;
      }),
  );
});
