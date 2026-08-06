import type { Locale } from "@/i18n/routing";

export const siteConfig = {
  name: "ANZ",
  lockupSub: "TECHNOLOGY",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://anz.vn",
  // Shared across locales — opengraph-image.tsx renders one asset
  ogTagline: "Applied AI · Computer Vision · Education AI · Generative AI",
  contact: {
    email: "hello@anz.vn",
    phone: "+84 000 000 000",
  },
  social: {
    facebook: "https://facebook.com/",
    linkedin: "https://linkedin.com/company/",
    github: "https://github.com/",
  },
} as const;

export type NavItem = {
  labelKey: string;
  href: string;
  external?: boolean;
};

export const mainNav: NavItem[] = [
  { labelKey: "features", href: "/#features" },
  { labelKey: "howItWorks", href: "/#how-it-works" },
  { labelKey: "team", href: "/#team" },
  { labelKey: "contact", href: "/#contact" },
];

// PLACEHOLDERS — empty the array to hide the strip; only ship logos you may display
export type Partner = { id: string; name: string; logo?: string };

export const partners: Partner[] = [
  { id: "p1", name: "PARTNER 01" },
  { id: "p2", name: "PARTNER 02" },
  { id: "p3", name: "PARTNER 03" },
  { id: "p4", name: "PARTNER 04" },
  { id: "p5", name: "PARTNER 05" },
];

export type Localized = Record<Locale, string>;

export type TeamMember = {
  id: string;
  name: string;
  photo?: string;
  role: Localized;
  bio: Localized;
};

// PLACEHOLDERS — replace with real staff who consented, or empty the array
export const team: TeamMember[] = [
  {
    id: "m1",
    name: "Mr. Bùi Chí Minh",
    role: {
      vi: "Tech Lead",
      en: "Tech Lead",
    },
    bio: {
      vi: "Hơn 7 năm dẫn dắt kỹ thuật các hệ thống AI production — LLM, RAG và tối ưu inference cho sản phẩm doanh nghiệp.",
      en: "7+ years leading production AI systems — LLMs, RAG, and inference optimization for enterprise products.",
    },
  },
  {
    id: "m2",
    name: "Mr. Bùi Quốc Tuấn",
    role: {
      vi: "CEO",
      en: "CEO",
    },
    bio: {
      vi: "Hơn 10 năm chuyên sâu bảo mật ứng dụng và hạ tầng — đánh giá rủi ro, hardening và tuân thủ cho sản phẩm số quy mô lớn.",
      en: "10+ years in application and infrastructure security — risk assessment, hardening, and compliance for large-scale digital products.",
    },
  },
  {
    id: "m3",
    name: "Mr. Văn Sang",
    role: {
      vi: "Senior AI Engineer",
      en: "Senior AI Engineer",
    },
    bio: {
      vi: "Hơn 5 năm xây dựng và vận hành mô hình AI trên production — fine-tuning, đánh giá chất lượng và tích hợp hệ thống thực tế.",
      en: "5+ years building and running production AI models — fine-tuning, quality evaluation, and real-world system integration.",
    },
  },
];

export const footerNav: { titleKey: string; items: NavItem[] }[] = [
  {
    titleKey: "productGroup",
    items: [
      { labelKey: "features", href: "/#features" },
      { labelKey: "howItWorks", href: "/#how-it-works" },
      { labelKey: "team", href: "/#team" },
    ],
  },
  {
    titleKey: "companyGroup",
    items: [
      { labelKey: "contact", href: "/#contact" },
      { labelKey: "careers", href: "/#contact" },
    ],
  },
];
