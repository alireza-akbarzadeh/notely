export type EditorFontOption = {
  value: string
  label: string
  family: string
  /** Optional Google Fonts family name to load on demand */
  google?: string
}

export const EDITOR_FONTS: EditorFontOption[] = [
  {
    value: "geist",
    label: "Geist Sans",
    family: "var(--font-geist-sans), system-ui, sans-serif",
  },
  {
    value: "inter",
    label: "Inter",
    family: "Inter, system-ui, sans-serif",
    google: "Inter:wght@400;500;600;700",
  },
  {
    value: "source-sans",
    label: "Source Sans 3",
    family: '"Source Sans 3", system-ui, sans-serif',
    google: "Source+Sans+3:wght@400;600;700",
  },
  {
    value: "ibm-plex",
    label: "IBM Plex Sans",
    family: '"IBM Plex Sans", system-ui, sans-serif',
    google: "IBM+Plex+Sans:wght@400;500;600;700",
  },
  {
    value: "dm-sans",
    label: "DM Sans",
    family: '"DM Sans", system-ui, sans-serif',
    google: "DM+Sans:wght@400;500;600;700",
  },
  {
    value: "georgia",
    label: "Georgia",
    family: "Georgia, 'Times New Roman', serif",
  },
  {
    value: "lora",
    label: "Lora",
    family: '"Lora", Georgia, serif',
    google: "Lora:ital,wght@0,400;0,600;0,700;1,400",
  },
  {
    value: "merriweather",
    label: "Merriweather",
    family: '"Merriweather", Georgia, serif',
    google: "Merriweather:ital,wght@0,400;0,700;1,400",
  },
  {
    value: "source-serif",
    label: "Source Serif 4",
    family: '"Source Serif 4", Georgia, serif',
    google: "Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400",
  },
  {
    value: "playfair",
    label: "Playfair Display",
    family: '"Playfair Display", Georgia, serif',
    google: "Playfair+Display:ital,wght@0,400;0,600;0,700;1,400",
  },
  {
    value: "mono",
    label: "Geist Mono",
    family: "var(--font-geist-mono), ui-monospace, monospace",
  },
  {
    value: "jetbrains",
    label: "JetBrains Mono",
    family: '"JetBrains Mono", ui-monospace, monospace',
    google: "JetBrains+Mono:wght@400;500;600",
  },
]

const loadedGoogleFonts = new Set<string>()

export function ensureEditorFontLoaded(font: EditorFontOption) {
  if (!font.google || typeof document === "undefined") return
  if (loadedGoogleFonts.has(font.google)) return
  loadedGoogleFonts.add(font.google)
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`
  document.head.appendChild(link)
}

export function getEditorFont(value: string | null | undefined) {
  return (
    EDITOR_FONTS.find((font) => font.value === value) ?? EDITOR_FONTS[0]!
  )
}
