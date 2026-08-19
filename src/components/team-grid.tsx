import Image from "next/image";
import { ArrowUpRight, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/button";
import { Container, Section } from "@/components/section";
import { team } from "@/lib/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

// Layout inspired by kms-technology.com/leadership — hero + portrait grid + CTA.
export function TeamPage() {
  const t = useTranslations("team");
  const locale = useLocale() as Locale;

  return (
    <>
      <section className="surface-dark border-b border-border bg-background">
        <Container className="flex flex-col items-center py-8 text-center sm:py-12">
          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("description")}
          </p>
        </Container>
      </section>

      <Section className="pt-8 sm:pt-10">
        <Container>
          {team.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              {t("empty")}
            </p>
          ) : (
            <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <li key={member.id} className="group text-center sm:text-left">
                  {member.photo ? (
                    <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary">
                      <Image
                        src={member.photo}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    // TODO(anz): replace with a real portrait
                    <div
                      aria-hidden
                      className="flex aspect-[4/5] items-center justify-center rounded-lg border border-dashed border-border bg-[linear-gradient(160deg,var(--brand-soft),var(--secondary))]"
                    >
                      <User
                        strokeWidth={1.25}
                        className="size-12 text-muted-foreground/45"
                      />
                    </div>
                  )}

                  <h2 className="mt-5 text-lg font-semibold tracking-tight sm:text-xl">
                    {member.name}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-brand-ink">
                    {member.role[locale]}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {member.bio[locale]}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      <Section className="border-t border-border pt-10 sm:pt-12">
        <Container className="flex flex-col items-center text-center">
          <h2 className="max-w-2xl text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("ctaTitle")}
          </h2>
          <p className="mt-3 max-w-xl text-pretty text-base text-muted-foreground">
            {t("ctaBody")}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="brand">
              <Link href="/#contact">
                <ArrowUpRight aria-hidden strokeWidth={2} className="size-4" />
                {t("ctaContact")}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/careers">{t("ctaCareers")}</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
