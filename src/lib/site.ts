import type { Locale } from "@/i18n/routing";

export const siteConfig = {
  name: "ANZ",
  lockupSub: "TECHNOLOGY",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://anz.vn",
  // Shared across locales — opengraph-image.tsx renders one asset
  ogTagline: "Applied AI · Computer Vision · Education AI · Generative AI",
  contact: {
    email: "anz.team.vn@gmail.com",
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

// Education uses a shipped case-study frame; vision/assistant/document are generated stills.
export const features = [
  { id: "vision", image: "/assets/solutions/solution-vision.png" },
  { id: "education", image: "/assets/solutions/solution-education.png" },
  { id: "conversational", image: "/assets/solutions/solution-assistant.png" },
  {
    id: "generative",
    image:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=800&q=80",
  },
  { id: "document", image: "/assets/solutions/solution-document.png" },
  {
    id: "predictive",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  },
] as const;

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
    // Temporary stock portrait — replace with owned asset before launch.
    photo:
      "https://media.licdn.com/dms/image/v2/D5603AQHTby3UXAfnKg/profile-displayphoto-scale_400_400/B56Z_GF2i7KYAg-/0/1785734854198?e=1788998400&v=beta&t=abkl54BcVD9LkH0_LL35HwIKTu5EHU_EstRiyPDaS1Y",
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
    photo:
      "https://media.licdn.com/dms/image/v2/D5603AQHKrtRuyNVlBg/profile-displayphoto-scale_400_400/B56aAanwdPIYAk-/0/1787153026702?e=1788998400&v=beta&t=lJF88VwoQAR1RqABGNzwtMFBojWBb-rYW2NHwSwYuNA",
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

// Derived from `features` so the blog filter can never drift from the Solutions section.
export type ProjectDomain = (typeof features)[number]["id"];

export const projectDomains: ProjectDomain[] = features.map((f) => f.id);

export type Project = {
  /** Primary key; also the blog-media folder name. */
  id: number;
  /** URL only — /blog/<slug>. Safe to change; images hang off `id`. */
  slug: string;
  domain?: ProjectDomain;
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

export type JobLevel = "intern" | "fresher" | "junior" | "middle" | "senior";

export type Job = {
  id: number;
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
