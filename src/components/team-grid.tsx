import Image from "next/image";
import { User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Container, Section, SectionHeading } from "@/components/section";
import { team } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export function TeamGrid() {
  const t = useTranslations("team");
  const locale = useLocale() as Locale;

  if (team.length === 0) return null;

  return (
    <Section id="team">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <li
              key={member.id}
              className="rounded-lg border border-border bg-card p-5"
            >
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt=""
                  width={320}
                  height={320}
                  className="aspect-square w-full rounded-sm object-cover"
                />
              ) : (
                // TODO(anz): replace with a real portrait
                <div
                  aria-hidden
                  className="flex aspect-square w-full items-center justify-center rounded-sm border border-dashed border-border bg-[linear-gradient(160deg,var(--brand-soft),var(--secondary))]"
                >
                  <User strokeWidth={1.25} className="size-10 text-muted-foreground/50" />
                </div>
              )}

              <h3 className="mt-5 text-base font-semibold tracking-tight">
                {member.name}
              </h3>
              <p className="mt-1 text-sm text-brand-ink">{member.role[locale]}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {member.bio[locale]}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
