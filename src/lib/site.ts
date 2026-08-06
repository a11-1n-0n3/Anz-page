import type { Locale } from "@/i18n/routing";

/**
 * Site-wide constants and content records.
 *
 * Interface copy — buttons, labels, validation, section headings — lives in
 * `messages/*.json`. What lives here is data: identifiers, URLs, and content
 * records such as the team list, whose localised fields travel with the record
 * rather than with the interface.
 */
export const siteConfig = {
  name: "ANZ",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://anz.vn",
  /**
   * Short line drawn on the shared OG image. Deliberately NOT translated —
   * `app/opengraph-image.tsx` renders one image for every locale, so this has
   * to read acceptably to both audiences.
   */
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

/**
 * Client / partner logos shown in the strip under the hero.
 *
 * ⚠ EVERY ENTRY HERE IS A PLACEHOLDER. Showing a company logo asserts a real
 * relationship — replace these with logos you have written permission to
 * display, or empty the array and the strip disappears on its own.
 *
 * `logo` is a path under /public. Leave it undefined and the `name` renders as
 * a plain wordmark instead, which is what the placeholders below do.
 */
export type Partner = { id: string; name: string; logo?: string };

export const partners: Partner[] = [
  { id: "p1", name: "PARTNER 01" },
  { id: "p2", name: "PARTNER 02" },
  { id: "p3", name: "PARTNER 03" },
  { id: "p4", name: "PARTNER 04" },
  { id: "p5", name: "PARTNER 05" },
];

/**
 * Team members shown in the experts section.
 *
 * ⚠ PLACEHOLDERS. Name, role and credential come from `messages/*.json` under
 * `team.members.<id>` so roles can be translated. Do not publish invented
 * people — replace with real staff who have consented to appear, or empty the
 * array and the section removes itself.
 *
 * `photo` is a path under /public; without one a neutral avatar is drawn.
 */
/**
 * Text that differs per locale but belongs to a data record rather than to the
 * interface. Adding a locale to `routing.locales` makes TypeScript demand the
 * new key here — a missing translation becomes a build error, not a blank card.
 */
export type Localized = Record<Locale, string>;

export type TeamMember = {
  id: string;
  /** Same in every language — never goes through the translation files. */
  name: string;
  /** Path under /public. Without one a neutral avatar is drawn. */
  photo?: string;
  role: Localized;
  bio: Localized;
};

/**
 * ⚠ PLACEHOLDERS. Do not publish invented people — replace with real staff who
 * have consented to appear, or empty the array and the section removes itself.
 *
 * WHY THE COPY LIVES HERE AND NOT IN `messages/*.json`:
 * these are content RECORDS, not interface strings. A person is one thing with
 * a name, a photo and a couple of localised sentences; splitting that across
 * three files meant editing all three to add one colleague, and typing the same
 * name into vi.json and en.json where the two could silently drift apart.
 *
 * Interface copy — buttons, labels, validation messages, section headings —
 * still belongs in `messages/*.json`. The line is: records here, UI text there.
 *
 * This shape also matches how a CMS would return the same data later, so
 * moving to Sanity or Payload is a swap of the source, not a rewrite.
 */
export const team: TeamMember[] = [
  {
    id: "m1",
    name: "[Tên chuyên gia]",
    role: {
      vi: "Chức danh · Lĩnh vực phụ trách",
      en: "Title · Area of focus",
    },
    bio: {
      vi: "Chuyên môn chính và kinh nghiệm nổi bật — học vị, số năm triển khai, lĩnh vực từng làm.",
      en: "Core expertise and standout experience — degree, years shipping, domains worked in.",
    },
  },
  {
    id: "m2",
    name: "[Tên chuyên gia]",
    role: {
      vi: "Chức danh · Lĩnh vực phụ trách",
      en: "Title · Area of focus",
    },
    bio: {
      vi: "Chuyên môn chính và kinh nghiệm nổi bật — học vị, số năm triển khai, lĩnh vực từng làm.",
      en: "Core expertise and standout experience — degree, years shipping, domains worked in.",
    },
  },
  {
    id: "m3",
    name: "[Tên chuyên gia]",
    role: {
      vi: "Chức danh · Lĩnh vực phụ trách",
      en: "Title · Area of focus",
    },
    bio: {
      vi: "Chuyên môn chính và kinh nghiệm nổi bật — học vị, số năm triển khai, lĩnh vực từng làm.",
      en: "Core expertise and standout experience — degree, years shipping, domains worked in.",
    },
  },
  {
    id: "m4",
    name: "[Tên chuyên gia]",
    role: {
      vi: "Chức danh · Lĩnh vực phụ trách",
      en: "Title · Area of focus",
    },
    bio: {
      vi: "Chuyên môn chính và kinh nghiệm nổi bật — học vị, số năm triển khai, lĩnh vực từng làm.",
      en: "Core expertise and standout experience — degree, years shipping, domains worked in.",
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
