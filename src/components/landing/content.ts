/** Marketing copy for the public landing page, kept apart from layout. */

export type FeatureKey =
  | "spaces"
  | "editor"
  | "tags"
  | "tasks"
  | "attachments"
  | "sharing"
  | "calendar"
  | "reminders"
  | "search"
  | "assistant"
  | "security"
  | "mobile";

export const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#demo", label: "Demo" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

export const HERO_STATS = [
  { value: "1 tap", label: "capture to note" },
  { value: "Auto", label: "saved as you type" },
  { value: "2FA", label: "on every account" },
  { value: "Dark", label: "and light, always" },
] as const;

export const FEATURES: {
  key: FeatureKey;
  title: string;
  body: string;
}[] = [
  {
    key: "spaces",
    title: "Spaces that separate contexts",
    body: "Work, side projects, and personal writing each get their own space with its own icon, order, and favorites.",
  },
  {
    key: "editor",
    title: "Rich editor, zero ceremony",
    body: "Headings, lists, quotes, code, and images in one calm surface. Drafts save themselves while you keep typing.",
  },
  {
    key: "tags",
    title: "Color-coded tags",
    body: "Tag once and scan later. Colors make the right note obvious before you finish reading the list.",
  },
  {
    key: "tasks",
    title: "Checklists inside notes",
    body: "Turn any line into a task. Reorder, tick off, and watch progress without leaving the note it belongs to.",
  },
  {
    key: "attachments",
    title: "Files and links attached",
    body: "Drop images, documents, or reference links onto a note and keep the whole context in one place.",
  },
  {
    key: "sharing",
    title: "Share with editors or viewers",
    body: "Invite someone by email, choose their role, and collaborate on a single note without exposing the space.",
  },
  {
    key: "calendar",
    title: "Calendar linked to notes",
    body: "Events carry a link back to the note behind them, so prep and follow-up live next to the meeting.",
  },
  {
    key: "reminders",
    title: "Reminders that reach you",
    body: "Schedule a nudge on a note or event and receive it as a push notification, even with the tab closed.",
  },
  {
    key: "search",
    title: "Search across everything",
    body: "One query spans titles and bodies in every space, ranked so the note you meant surfaces first.",
  },
  {
    key: "assistant",
    title: "Ask your notes",
    body: "The built-in assistant reads the note you have open and answers, summarizes, or drafts the next paragraph.",
  },
  {
    key: "security",
    title: "Accounts you can lock down",
    body: "Email sessions, two-factor authentication, and per-user access checks on every server route.",
  },
  {
    key: "mobile",
    title: "Mobile-native by design",
    body: "Bottom navigation, safe-area padding, and a list-to-editor flow that feels like an installed app.",
  },
];

export const WORKFLOW = [
  {
    step: "01",
    title: "Capture",
    body: "Start a note from anywhere in the app. The editor opens empty and focused, and your draft persists from the first keystroke.",
  },
  {
    step: "02",
    title: "Organize",
    body: "File it into a space, add tags, break it into tasks, and attach the files that explain it. Structure arrives after the thought, not before.",
  },
  {
    step: "03",
    title: "Recall",
    body: "Search, filter by tag, or let a reminder bring the note back to you at the moment it matters again.",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Every meeting note, task, and follow-up now lives in one space. I stopped keeping a second list somewhere else.",
    name: "Marion Vale",
    role: "Product lead",
  },
  {
    quote:
      "The reminders are the part I did not expect to need. A note pings me the morning it becomes relevant again.",
    name: "Ilya Sorensen",
    role: "Research engineer",
  },
  {
    quote:
      "Sharing a single note with an editor instead of my whole workspace is exactly the granularity I wanted.",
    name: "Dana Whitfield",
    role: "Freelance writer",
  },
] as const;

export type PricingPlan = {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Personal",
    price: "Free",
    description: "Everything you need to keep one life organized.",
    features: [
      "Unlimited notes and spaces",
      "Tags, tasks, and attachments",
      "Full-text search",
      "Light and dark themes",
    ],
    cta: { label: "Create your workspace", href: "/register" },
  },
  {
    name: "Pro",
    price: "$6",
    period: "/month",
    description: "For people whose notes drive their week.",
    features: [
      "Everything in Personal",
      "Note sharing with roles",
      "Calendar events linked to notes",
      "Push reminders on every device",
      "AI assistant on your notes",
    ],
    cta: { label: "Start free trial", href: "/register" },
    featured: true,
  },
  {
    name: "Team",
    price: "$12",
    period: "/user / month",
    description: "Shared context for small, fast teams.",
    features: [
      "Everything in Pro",
      "Shared spaces across the team",
      "Admin controls and audit of shares",
      "Priority support",
    ],
    cta: { label: "Talk to us", href: "/register" },
  },
];

export type ComparisonRow = {
  feature: string;
  personal: boolean;
  pro: boolean;
  team: boolean;
};

export const COMPARISON_ROWS: ComparisonRow[] = [
  { feature: "Unlimited notes & spaces", personal: true, pro: true, team: true },
  { feature: "Tags, tasks & attachments", personal: true, pro: true, team: true },
  { feature: "Full-text search", personal: true, pro: true, team: true },
  { feature: "Two-factor authentication", personal: true, pro: true, team: true },
  { feature: "Note sharing with roles", personal: false, pro: true, team: true },
  { feature: "Calendar linked to notes", personal: false, pro: true, team: true },
  { feature: "Push reminders", personal: false, pro: true, team: true },
  { feature: "AI assistant on notes", personal: false, pro: true, team: true },
  { feature: "Shared team spaces", personal: false, pro: false, team: true },
  { feature: "Priority support", personal: false, pro: false, team: true },
];

export const FAQS = [
  {
    question: "Is Notely really free to start?",
    answer:
      "Yes. The Personal plan covers unlimited notes, spaces, tags, tasks, attachments, and search for as long as you want. You only upgrade when you need sharing, calendar, reminders, or the assistant.",
  },
  {
    question: "How is my account protected?",
    answer:
      "Notely uses email sessions with optional two-factor authentication, and every server route verifies that the note, space, or file you request actually belongs to you before returning anything.",
  },
  {
    question: "Can I share a single note without opening my whole workspace?",
    answer:
      "That is the default. You invite a person by email to one note and choose whether they can edit or only read it. The rest of your space stays private.",
  },
  {
    question: "Does it work on a phone?",
    answer:
      "Notely is built mobile-first: bottom navigation, safe-area padding, and a list-to-editor flow. Add it to your home screen and it behaves like an installed app, including push reminders.",
  },
  {
    question: "What does the assistant actually see?",
    answer:
      "Only the note you have open. You ask a question, it reads that note's title and content to answer, summarize, or continue writing. It is never pointed at your whole workspace without you asking.",
  },
  {
    question: "Can I get my notes out again?",
    answer:
      "Always. Your notes are plain content in your account, deleted notes stay recoverable in trash, and nothing is locked behind a proprietary format.",
  },
] as const;

export const FOOTER_LINKS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Demo", href: "#demo" },
      { label: "How it works", href: "#how" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/register" },
      { label: "Your notes", href: "/notes" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "mailto:hello@notely.app" },
    ],
  },
];
