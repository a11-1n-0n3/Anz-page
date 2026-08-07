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

// PLACEHOLDERS — each section below hides itself when its array is emptied.
// Everything here is a CLAIM about the company. The values are deliberately
// unmistakable (XX, PLACEHOLDER) so nothing reads as real if this ships early —
// replace with verified figures, quotes you have permission to publish, and
// real posts, or empty the array.

export type Stat = { id: string; value: string; label: Localized };

export const stats: Stat[] = [
  // ⚠ REPLACE THE TWO VALUES. Labels are final; the numbers are yours.
  {
    id: "years",
    value: "XX",
    label: { vi: "năm hoạt động", en: "years in business" },
  },
  {
    id: "engineers",
    value: "XX",
    label: { vi: "kỹ sư trong đội", en: "engineers on the team" },
  },
];

export type Testimonial = {
  id: string;
  quote: Localized;
  author: string;
  role: Localized;
  company: string;
  // Path under /public. Only ship a logo you have written permission to show.
  logo?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    author: "PLACEHOLDER 01",
    company: "PLACEHOLDER CO",
    role: { vi: "Chức danh", en: "Job title" },
    quote: {
      vi: "Chỗ đặt trích dẫn khách hàng. Thay bằng phản hồi thật đã được người nói cho phép đăng.",
      en: "Placeholder for a client quote. Replace with real feedback you have permission to publish.",
    },
  },
  {
    id: "t2",
    author: "PLACEHOLDER 02",
    company: "PLACEHOLDER CO",
    role: { vi: "Chức danh", en: "Job title" },
    quote: {
      vi: "Chỗ đặt trích dẫn thứ hai. Hai đến ba câu là vừa.",
      en: "A second quote goes here. Two or three sentences reads best.",
    },
  },
];

export type Post = {
  id: string;
  href: string;
  title: Localized;
  tag: Localized;
  // ISO date. Rendered with the active locale.
  date: string;
  cover?: string;
};

export const posts: Post[] = [
  {
    id: "b1",
    href: "#",
    date: "2026-01-01",
    tag: { vi: "Chuyên mục", en: "Category" },
    title: {
      vi: "PLACEHOLDER — tiêu đề bài viết, khoảng một tới hai dòng",
      en: "PLACEHOLDER — post title, about one or two lines long",
    },
  },
  {
    id: "b2",
    href: "#",
    date: "2026-01-01",
    tag: { vi: "Chuyên mục", en: "Category" },
    title: {
      vi: "PLACEHOLDER — tiêu đề bài viết thứ hai",
      en: "PLACEHOLDER — a second post title",
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
