import {
  Banknote,
  Brain,
  Building2,
  Code2,
  Fingerprint,
  Globe2,
  GraduationCap,
  KeyRound,
  LineChart,
  Lock,
  Newspaper,
  PieChart,
  Repeat,
  ScanFace,
  ShieldCheck,
  Smartphone,
  Snowflake,
  Users,
  Video,
  Waves,
  Zap,
  BookOpen,
} from "lucide-react";

import type {
  Asset,
  FaqItem,
  Feature,
  LearningItem,
  Market,
  PricingTier,
  SecurityItem,
  StatItem,
  Testimonial,
} from "./types";

export const STARTING_CASH = 25_000;

export const NAV_LINKS = [
  "Markets",
  "Trade",
  "Derivatives",
  "Institutional",
  "Learn",
] as const;

export const TRUST_STATS: StatItem[] = [
  { v: "$180B+", l: "Monthly volume" },
  { v: "180+", l: "Countries" },
  { v: "10M+", l: "Verified users" },
  { v: "99.99%", l: "Uptime SLA" },
  { v: "$1B", l: "Insurance fund" },
  { v: "24/7", l: "Global support" },
];

export const ASSETS: Asset[] = [
  { sym: "BTC", name: "Bitcoin", price: 68412.3, ch: 2.84, color: "#F7931A" },
  { sym: "ETH", name: "Ethereum", price: 3542.18, ch: 3.42, color: "#627EEA" },
  { sym: "SOL", name: "Solana", price: 184.72, ch: 5.12, color: "#14F195" },
  { sym: "BNB", name: "BNB", price: 612.4, ch: -0.84, color: "#F3BA2F" },
  { sym: "XRP", name: "XRP", price: 0.548, ch: 1.24, color: "#25A2DB" },
  { sym: "DOGE", name: "Dogecoin", price: 0.164, ch: -2.11, color: "#C2A633" },
  { sym: "ADA", name: "Cardano", price: 0.412, ch: 0.72, color: "#0033AD" },
  { sym: "AVAX", name: "Avalanche", price: 34.22, ch: 4.18, color: "#E84142" },
  { sym: "LINK", name: "Chainlink", price: 14.82, ch: 2.02, color: "#2A5ADA" },
  { sym: "SUI", name: "Sui", price: 2.14, ch: 7.42, color: "#4DA2FF" },
];

export const INITIAL_MARKETS: Market[] = [
  { sym: "BTC", name: "Bitcoin", price: 68420.5, color: "oklch(0.78 0.16 60)" },
  { sym: "ETH", name: "Ethereum", price: 3542.18, color: "oklch(0.72 0.19 250)" },
  { sym: "SOL", name: "Solana", price: 182.44, color: "oklch(0.68 0.22 300)" },
  { sym: "AVAX", name: "Avalanche", price: 41.27, color: "oklch(0.65 0.24 25)" },
  { sym: "LINK", name: "Chainlink", price: 18.62, color: "oklch(0.85 0.15 210)" },
];

export const FEATURES: Feature[] = [
  { icon: Zap, title: "Ultra-fast execution", desc: "12ms average match latency across our global matching engine." },
  { icon: Brain, title: "AI market insights", desc: "Real-time signals, sentiment models, and adaptive risk scoring." },
  { icon: LineChart, title: "Pro-grade charting", desc: "Full TradingView integration, 100+ indicators, custom scripts." },
  { icon: Repeat, title: "Recurring investments", desc: "Automated DCA into any portfolio, on any schedule." },
  { icon: Users, title: "Copy trading", desc: "Mirror verified strategies from top-ranked traders instantly." },
  { icon: Waves, title: "Deep liquidity", desc: "Aggregated books across 30+ venues for zero-slippage fills." },
  { icon: Globe2, title: "Global access", desc: "180 countries, 40 languages, native fiat on-ramps." },
  { icon: Banknote, title: "Lowest fees", desc: "0.02% maker / 0.05% taker. Volume-based discounts up to 90%." },
  { icon: Code2, title: "Advanced API", desc: "REST, WebSocket, and FIX 4.4. Sub-millisecond colo available." },
  { icon: Building2, title: "Institutional suite", desc: "OTC desk, prime brokerage, custody, and dedicated coverage." },
  { icon: Smartphone, title: "Mobile-first", desc: "Full trading power on iOS and Android with biometric auth." },
  { icon: PieChart, title: "Portfolio analytics", desc: "P&L attribution, tax exports, and multi-account reporting." },
];

export const SECURITY_ITEMS: SecurityItem[] = [
  { icon: Snowflake, title: "95% cold storage", desc: "Air-gapped vaults across geographically distributed HSMs." },
  { icon: KeyRound, title: "Multi-sig custody", desc: "Threshold signatures with human + hardware quorum." },
  { icon: Fingerprint, title: "Passkeys & 2FA", desc: "WebAuthn, biometrics, hardware keys — no SMS ever." },
  { icon: ShieldCheck, title: "AI fraud detection", desc: "Behavioral ML flags anomalies in under 40ms." },
  { icon: Lock, title: "End-to-end encryption", desc: "All data at rest and in transit. Zero-knowledge vault." },
  { icon: ScanFace, title: "Withdrawal protection", desc: "Allow-listed addresses, cooldowns, and device binding." },
];

export const MOBILE_FEATURES = [
  "Face ID & Touch ID sign-in",
  "Push alerts on price, whale moves, and portfolio thresholds",
  "One-tap converts and recurring buys",
  "Full derivatives, futures, and margin trading",
] as const;

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Nexora's execution and API stability let us route 40% of our daily flow through them within a quarter. The institutional desk is exceptional.",
    name: "Elena Marchetti",
    role: "Head of Digital Assets, Meridian Capital",
  },
  {
    quote:
      "The AI signal engine has genuinely changed how I structure entries. It's the first tool that doesn't feel like a gimmick.",
    name: "David Okafor",
    role: "Independent trader · 12yr FX",
  },
  {
    quote:
      "We evaluated seven venues for our treasury allocation. Nexora was the only one that met all of our custody, reporting, and insurance requirements.",
    name: "Priya Ramanathan",
    role: "CFO, Halcyon Ventures",
  },
];

export const LEARNING_ITEMS: LearningItem[] = [
  { icon: GraduationCap, title: "Trading Academy", desc: "80+ interactive lessons from beginner to advanced derivatives.", tag: "Free" },
  { icon: Brain, title: "AI Market Analysis", desc: "Daily reports generated by our proprietary market intelligence.", tag: "New" },
  { icon: Newspaper, title: "Nexora Research", desc: "In-depth coverage of macro, protocols, and on-chain flows.", tag: "Pro" },
  { icon: Video, title: "Live sessions", desc: "Weekly deep dives with pro traders and portfolio managers.", tag: "Live" },
  { icon: BookOpen, title: "Trading guides", desc: "Playbooks for every strategy, from DCA to delta-neutral.", tag: "Free" },
  { icon: ShieldCheck, title: "Security tips", desc: "How to sleep well when your net worth is on-chain.", tag: "Free" },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Basic",
    price: "0",
    desc: "For beginners exploring crypto.",
    features: [
      "Spot trading, 300+ assets",
      "0.10% maker / 0.15% taker",
      "Fiat on-ramp (30+ methods)",
      "Basic charts & alerts",
      "Mobile + web",
    ],
  },
  {
    name: "Pro",
    price: "29",
    desc: "For active traders who need more.",
    featured: true,
    features: [
      "Everything in Basic",
      "0.02% maker / 0.05% taker",
      "Perps, futures, margin",
      "Advanced charting & API",
      "AI signal engine",
      "Priority support",
    ],
  },
  {
    name: "Institutional",
    price: "Custom",
    desc: "For funds, firms, and treasuries.",
    features: [
      "Everything in Pro",
      "OTC desk & prime brokerage",
      "FIX 4.4 + colocation",
      "Dedicated account manager",
      "Custom custody & reporting",
      "24/7 SLAs",
    ],
  },
];

export const FAQS: FaqItem[] = [
  {
    q: "How secure is Nexora?",
    a: "95% of client assets sit in air-gapped cold storage across multiple jurisdictions, secured by multi-signature HSMs. We maintain SOC 2 Type II, ISO 27001, and PCI DSS certifications, and hold a $1B insurance fund.",
  },
  {
    q: "How do deposits work?",
    a: "Deposit crypto from any wallet or fund your account via bank transfer, card, Apple Pay, Google Pay, or 30+ local payment methods across 180 countries. Crypto deposits credit after network confirmations; fiat is typically instant.",
  },
  {
    q: "Can I withdraw anytime?",
    a: "Yes. Withdrawals are processed 24/7. Crypto typically arrives within minutes; fiat withdrawals settle in 1-2 business days depending on rail and jurisdiction.",
  },
  {
    q: "What are the trading fees?",
    a: "Basic tier is 0.10%/0.15% maker/taker. Pro tier is 0.02%/0.05%. Institutional pricing scales down to 0% maker for high-volume flow. Full schedule in your account settings.",
  },
  {
    q: "Which countries are supported?",
    a: "180 countries and territories. Certain products (like perpetuals or margin) are gated by local regulation. You'll always see what's available to you at signup.",
  },
  {
    q: "How long do withdrawals take?",
    a: "Crypto: 5-30 min typical, up to 60 for BTC network. Fiat: SEPA instant in seconds, ACH 1-2 days, Wire same-day for cutoffs before 2pm ET.",
  },
];

export const FOOTER_GROUPS: Record<string, string[]> = {
  Products: ["Exchange", "Derivatives", "Wallet", "Earn", "NFT", "Card"],
  Markets: ["Bitcoin", "Ethereum", "Solana", "All markets", "Market data", "Heatmap"],
  Developers: ["API docs", "Websocket", "FIX", "Status", "GitHub", "Bug bounty"],
  Institutional: ["Prime", "OTC desk", "Custody", "Loans", "Reporting", "Contact"],
  Company: ["About", "Careers", "Press", "Blog", "Security", "Legal"],
  Support: ["Help centre", "Fees", "Contact", "System status", "Community", "Learn"],
};

/** Icons referenced in security orbit — kept here to avoid unused import lint in security.tsx */
export const SECURITY_ORBIT_ICONS = [Lock, KeyRound, Fingerprint, ScanFace] as const;