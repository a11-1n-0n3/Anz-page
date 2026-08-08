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
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-7 transition-[transform,border-color,box-shadow,background-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-brand/40 hover:bg-brand-soft/40 hover:shadow-[0_22px_44px_-20px_rgba(0,7,205,0.35)]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-16 size-44 rounded-full bg-brand/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              />

              <span
                aria-hidden
                className="flex size-11 items-center justify-center rounded-sm bg-[linear-gradient(135deg,var(--brand-soft),var(--card))] ring-1 ring-brand/25 transition-[transform,background-color,box-shadow] duration-300 ease-out group-hover:scale-110 group-hover:bg-brand-soft group-hover:shadow-[0_10px_24px_-10px_rgba(0,7,205,0.45)] group-hover:ring-brand/40"
              >
                <feature.icon
                  strokeWidth={1.5}
                  className="size-5 text-brand-ink"
                />
              </span>

              <h3 className="mt-5 text-base font-semibold tracking-tight transition-colors duration-300 group-hover:text-brand-ink sm:text-lg">
                {t(`items.${feature.id}.title`)}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80 sm:text-[15px]">
                {t(`items.${feature.id}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
