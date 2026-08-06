import Image from "next/image";
import { User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Container, Section, SectionHeading } from "@/components/section";
import { team } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

/**
 * Experts section, placed immediately before the contact form.
 *
 * Buyers of AI services are buying people, not a boxed product — background,
 * publications and where someone worked before all move the decision. That
 * makes this a closing argument rather than an attention-grabber, so it sits
 * late in the page, right where the visitor is deciding whether to write.
 *
 * The section's own heading comes from `messages` (interface copy); each
 * person's name, role and bio come from `lib/site.ts` (a content record).
 *
 * Renders nothing when `team` is empty.
 */
export function TeamGrid() {
  const t = useTranslations("team");
  const locale = useLocale() as Locale;

  if (team.length === 0) return null;

  return (
    <Section id="team" className="border-t border-border">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <li key={member.id}>
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt=""
                  width={320}
                  height={320}
                  className="aspect-square w-full rounded-xl object-cover"
                />
              ) : (
                /*
                 * TODO(anz): replace with a real portrait.
                 * Neutral avatar on purpose — an invented face or name would
                 * be a fabricated person on a page that sells trust.
                 */
                <div
                  aria-hidden
                  className="flex aspect-square w-full items-center justify-center rounded-xl border border-dashed border-border bg-secondary/60"
                >
                  <User strokeWidth={1.25} className="size-10 text-muted-foreground/50" />
                </div>
              )}

              <h3 className="mt-5 text-base font-semibold tracking-tight">
                {member.name}
              </h3>
              <p className="mt-1 text-sm text-gold-ink">{member.role[locale]}</p>
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
