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

// TODO(anz): confirm this list matches the domains actually delivered
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

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li
              key={feature.id}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-7 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(11,22,32,0.35)]"
            >
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
