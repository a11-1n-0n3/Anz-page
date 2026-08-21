"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";

import { Card } from "@/components/primitives/card";
import { CardGrid } from "@/components/primitives/card-grid";
import { Container, Section, SectionHeading } from "@/components/primitives/section";
import type { Project } from "@/lib/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/** Home teaser — arrow routes to /blog. */
export function ProjectsTeaser({
  posts,
  showAllLink = false,
}: {
  posts: Project[];
  showAllLink?: boolean;
}) {
  const t = useTranslations("projects");
  const tDomain = useTranslations("features");
  const locale = useLocale() as Locale;
  const format = useFormatter();
  // ponytail: cases with real screenshots first; swap when more galleries exist
  const teaser = [...posts]
    .sort((a, b) => Number(Boolean(b.cover)) - Number(Boolean(a.cover)))
    .slice(0, 2);

  if (teaser.length === 0) return null;

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
          {showAllLink ? (
            <Link
              href="/blog"
              className="group inline-flex shrink-0 flex-row-reverse items-center gap-1.5 self-start text-sm font-medium text-brand-ink transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:flex-col md:self-auto md:px-2 md:py-1"
            >
              <ArrowRight
                aria-hidden
                strokeWidth={2}
                className="size-4 transition-transform duration-300 group-hover:translate-x-1 md:size-8"
              />
              <span>{t("viewAll")}</span>
            </Link>
          ) : null}
        </div>

        <CardGrid cols={2} className="mt-8 sm:mt-14">
          {teaser.map((project) => (
            <li key={project.id}>
              <Card
                variant="project"
                href={`/blog/${project.slug}`}
                image={project.cover}
                title={project.title[locale]}
                description={project.excerpt[locale]}
                meta={
                  <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] text-brand-ink uppercase sm:gap-3 sm:text-[12px]">
                    {project.domain ? (
                      <>
                        {tDomain(`items.${project.domain}.title`)}
                        <span aria-hidden className="text-muted-foreground">
                          ·
                        </span>
                      </>
                    ) : null}
                    <time
                      dateTime={project.date}
                      className="tracking-normal normal-case text-muted-foreground"
                    >
                      {format.dateTime(new Date(project.date), {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                }
                action={
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand-ink sm:mt-5 sm:text-sm">
                    {t("readMore")}
                    <ArrowUpRight
                      aria-hidden
                      strokeWidth={2}
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                }
              />
            </li>
          ))}
        </CardGrid>
      </Container>
    </Section>
  );
}
