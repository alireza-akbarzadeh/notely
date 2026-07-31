import type { LucideIcon } from "lucide-react";

export type Asset = {
  sym: string;
  name: string;
  price: number;
  ch: number;
  color: string;
};

export type Market = {
  sym: string;
  name: string;
  price: number;
  color: string;
};

export type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

export type SecurityItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export type LearningItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
  tag: string;
};

export type PricingTier = {
  name: string;
  price: string;
  desc: string;
  featured?: boolean;
  features: string[];
};

export type FaqItem = {
  q: string;
  a: string;
};

export type StatItem = {
  v: string;
  l: string;
};

export type Holding = {
  qty: number;
  costBasis: number;
};

export type FlashMessage = {
  kind: "ok" | "err";
  msg: string;
};
