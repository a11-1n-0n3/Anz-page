"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";

import { CardGrid } from "@/components/primitives/card-grid";
import { EmptyState } from "@/components/blocks/empty-state";
import { PageHero } from "@/components/blocks/page-hero";
import { Card } from "@/components/primitives/card";
import { Container, Section } from "@/components/primitives/section";
import {
  projectDomains,
  type Project,
  type ProjectDomain,
} from "@/lib/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

function FeaturedProject({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const tDomain = useTranslations("features");
  const locale = useLocale() as Locale;
  const format = useFormatter();

  return (
    <Link
      href={`/blog/${project.slug}`}
      className="group grid overflow-hidden rounded-lg border border-border bg-card transition-shadow duration-300 hover:shadow-[0_22px_48px_-24px_rgba(11,22,32,0.4)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none md:grid-cols-2"
    >
      <div className="relative min-h-40 overflow-hidden sm:min-h-72">
        {project.cover ? (
          <Image
            src={project.cover}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(140deg,var(--brand-soft),var(--secondary))]"
          />
        )}
      </div>

      <div className="flex flex-col justify-center p-4 sm:p-10">
        <div className="flex flex-wrap items-center gap-3 text-[12px] font-medium tracking-[0.14em] text-brand-ink uppercase">
          {project.domain ? (
            <span className="rounded-sm border border-brand/25 bg-brand-soft px-2 py-0.5">
              {tDomain(`items.${project.domain}.title`)}
            </span>
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

        {project.client ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {project.client[locale]}
          </p>
        ) : null}

        <h2 className="mt-2 text-balance text-lg font-semibold tracking-tight sm:text-3xl">
          {project.title[locale]}
        </h2>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-base">
          {project.excerpt[locale]}
        </p>

        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink">
          {t("readMore")}
          <ArrowUpRight
            aria-hidden
            strokeWidth={2}
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

export function ProjectIndex({ posts }: { posts: Project[] }) {
  const t = useTranslations("projects");
  const tDomain = useTranslations("features");
  const locale = useLocale() as Locale;
  const format = useFormatter();
  const [domain, setDomain] = useState<ProjectDomain | "all">("all");

  const filtered = useMemo(() => {
    const list =
      domain === "all"
        ? posts
        : posts.filter((p) => p.domain === domain);
    return [...list].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [domain, posts]);

  const [featured, ...rest] = filtered;

  return (
    <>
      <PageHero
        title={t("pageTitle")}
        description={t("pageDescription")}
        titleClassName="text-2xl sm:text-5xl"
      />

      <Section className="pt-6 sm:pt-8">
        <Container>
          <div
            role="tablist"
            aria-label={t("categoriesLabel")}
            className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={domain === "all"}
              onClick={() => setDomain("all")}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:px-4 sm:py-2 sm:text-sm",
                domain === "all"
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground",
              )}
            >
              {t("allCategories")}
            </button>
            {projectDomains.map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={domain === id}
                onClick={() => setDomain(id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:px-4 sm:py-2 sm:text-sm",
                  domain === id
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground",
                )}
              >
                {tDomain(`items.${id}.title`)}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState className="mt-14">{t("empty")}</EmptyState>
          ) : (
            <div className="mt-8 space-y-4 sm:mt-12 sm:space-y-8">
              {featured ? <FeaturedProject project={featured} /> : null}

              {rest.length > 0 ? (
                <CardGrid cols={3}>
                  {rest.map((project) => (
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
                                <span
                                  aria-hidden
                                  className="text-muted-foreground"
                                >
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
              ) : null}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
