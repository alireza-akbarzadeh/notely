import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Notely",
    short_name: "Notely",
    description:
      "Think. Note. Plan. A calm workspace for notes, spaces, reminders, and calendar.",
    start_url: "/notes",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#1a1814",
    theme_color: "#e07838",
    categories: ["productivity", "utilities"],
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
