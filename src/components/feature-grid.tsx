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
    <Section id="features">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        {/*
          Cards, not the ruled two-column list this used to be.

          The old list was a deliberate fix for a real problem: a single narrow
          text column left its horizontal rules running through 400px of empty
          track, and the section read as unfinished. Splitting label from
          description made the rules span real content.

          Cards solve the same problem differently — there is no rule left to
          strand — and they are the form this page's design language is built
          on: rounded surfaces lifted off a tinted ground. What is given up is
          the scannable left rail of domain names; three columns of headings
          are still scannable, just in a grid instead of a line.
        */}
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li
              key={feature.id}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-7 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(11,22,32,0.35)]"
            >
              {/* Faint corner wash — the same light the hero canvas is lit by. */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-neon-soft opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              />

              <span
                aria-hidden
                className="flex size-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--neon-soft),var(--card))] ring-1 ring-neon/25"
              >
                <feature.icon
                  strokeWidth={1.5}
                  className="size-5 text-neon-ink"
                />
              </span>

              <h3 className="mt-5 text-base font-semibold tracking-tight sm:text-lg">
                {t(`items.${feature.id}.title`)}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {t(`items.${feature.id}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
