import {
  Eye,
  GraduationCap,
  MessagesSquare,
  ScanText,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Container, Section, SectionHeading } from "@/components/section";

/**
 * The domains the company works in — not individual products. Named products
 * (Camera AI, AI Mentor, ...) belong under the domain they fall into, so the
 * section stays accurate as the product line-up changes.
 *
 * Only ids and icons live in code; the copy sits in `messages/*.json`.
 *
 * TODO(anz): confirm this list matches the domains actually delivered.
 */
const features = [
  { id: "vision", icon: Eye },
  { id: "education", icon: GraduationCap },
  { id: "conversational", icon: MessagesSquare },
  { id: "generative", icon: Sparkles },
  { id: "document", icon: ScanText },
  { id: "predictive", icon: TrendingUp },
] as const;

export function FeatureGrid() {
  const t = useTranslations("features");

  return (
    <Section id="features" className="border-t border-border">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        {/*
          Two columns, not one.
          Before: icon + a single text column capped at max-w-2xl, so every row
          filled 672px of its 1088px track and the rules ran on through 400px
          of nothing — the section read as unfinished. Splitting label from
          description makes the rule span real content edge to edge, and gives
          a scannable left rail of domain names.
        */}
        <ul className="mt-14 divide-y divide-border border-y border-border">
          {features.map((feature) => (
            <li
              key={feature.id}
              className="group grid gap-x-10 gap-y-2 py-7 md:grid-cols-[minmax(0,22rem)_1fr] md:items-baseline md:py-8"
            >
              <h3 className="flex items-center gap-3 text-base font-semibold tracking-tight sm:text-lg">
                <feature.icon
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-5 shrink-0 text-gold-ink transition-transform duration-300 group-hover:translate-x-0.5"
                />
                {t(`items.${feature.id}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {t(`items.${feature.id}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
