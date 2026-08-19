import type { Locale } from "@/i18n/routing";

export const siteConfig = {
  name: "ANZ",
  lockupSub: "TECHNOLOGY",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://anz.vn",
  // Shared across locales — opengraph-image.tsx renders one asset
  ogTagline: "Applied AI · Computer Vision · Education AI · Generative AI",
  contact: {
    email: "anz.team.vn@gmail.com",
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
  { labelKey: "home", href: "/" },
  { labelKey: "contact", href: "/#contact" },
  { labelKey: "team", href: "/team" },
  { labelKey: "blog", href: "/blog" },
  { labelKey: "careers", href: "/careers" },
];

// Temporary logos for layout only — do NOT ship as “Trusted by” unless
// you have a real relationship and permission to display these brands.
export type Partner = { id: string; name: string; logo?: string };

export const partners: Partner[] = [
  { id: "p1", name: "Claude", logo: "/assets/partners/anthropic.svg" },
  { id: "p2", name: "Cursor", logo: "/assets/partners/cursor.svg" },
  { id: "p3", name: "Codex", logo: "/assets/partners/openai.svg" },
  { id: "p4", name: "DeepSeek", logo: "/assets/partners/deepseek.svg" },
  { id: "p5", name: "Gemini", logo: "/assets/partners/google.svg" },
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
// real projects, or empty the array.

export type Stat = { id: string; value: string; label: Localized };

export const stats: Stat[] = [
  // ⚠ REPLACE THE TWO VALUES. Labels are final; the numbers are yours.
  {
    id: "years",
    value: "01+",
    label: { vi: "năm hoạt động", en: "years in business" },
  },
  {
    id: "projects",
    value: "10+",
    label: { vi: "dự án đã làm", en: "projects delivered" },
  },
];

export type Industry = {
  id: string;
  name: Localized;
  /** Path under /public, or remote URL allowed in next.config. */
  image: string;
};

// Temporary stock images — replace with owned assets before launch.
export const industries: Industry[] = [
  {
    id: "finance",
    name: { vi: "Tài chính & ngân hàng", en: "Financial services" },
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "healthcare",
    name: { vi: "Y tế & khoa học sự sống", en: "Healthcare & life sciences" },
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "hightech",
    name: { vi: "Công nghệ cao", en: "High-tech" },
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "logistics",
    name: { vi: "Logistics & chuỗi cung ứng", en: "Logistics & supply chain" },
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "manufacturing",
    name: { vi: "Sản xuất", en: "Manufacturing" },
    image:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "education",
    name: { vi: "Giáo dục", en: "Education" },
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
  },
];

export type ProjectIndustry =
  | "manufacturing"
  | "finance"
  | "retail"
  | "education"
  | "real-estate"
  | "computer-vision";

export const projectIndustries: ProjectIndustry[] = [
  "manufacturing",
  "finance",
  "retail",
  "education",
  "real-estate",
  "computer-vision",
];

export type Project = {
  id: string;
  slug: string;
  industry?: ProjectIndustry;
  title: Localized;
  /** Anonymized until the client permits a real name. */
  client?: Localized;
  // ISO date. Rendered with the active locale.
  date: string;
  cover?: string;
  gallery?: string[];
  excerpt: Localized;
  problem?: Localized;
  solution?: Localized;
  outcome?: Localized;
  /**
   * Paragraphs separated by blank lines. A paragraph starting with "## "
   * renders as a section heading; a paragraph that is exactly "![N]"
   * inlines gallery[N] at that point in the article.
   */
  body: Localized;
};

export type JobType = "fulltime" | "intern" | "contract";
export type JobDepartment =
  | "engineering"
  | "ai"
  | "product"
  | "design"
  | "operations";
export type JobLocation = "hanoi" | "hcm" | "remote";

export type JobLevel = "fresher";

export type Job = {
  id: string;
  title: string;
  type: JobType;
  department: JobDepartment;
  locations: JobLocation[];
  level: JobLevel;
  slots: number;
  jd: Localized;
};

export const footerNav: { titleKey: string; items: NavItem[] }[] = [
  {
    titleKey: "productGroup",
    items: [
      { labelKey: "features", href: "/#features" },
      { labelKey: "howItWorks", href: "/#how-it-works" },
      { labelKey: "contact", href: "/#contact" },
    ],
  },
  {
    titleKey: "companyGroup",
    items: [
      { labelKey: "team", href: "/team" },
      { labelKey: "blog", href: "/blog" },
      { labelKey: "careers", href: "/careers" },
    ],
  },
];
