"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";

import { ProjectCard } from "@/components/project-card";
import { Container, Section } from "@/components/section";
import {
  projectIndustries,
  type Project,
  type ProjectIndustry,
} from "@/lib/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

function FeaturedProject({ project }: { project: Project }) {
  const t = useTranslations("projects");
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
          {project.industry ? (
            <span className="rounded-sm border border-brand/25 bg-brand-soft px-2 py-0.5">
              {t(`categories.${project.industry}`)}
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
  const [industry, setIndustry] = useState<ProjectIndustry | "all">("all");

  const filtered = useMemo(() => {
    const list =
      industry === "all"
        ? posts
        : posts.filter((p) => p.industry === industry);
    const sorted = [...list].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return sorted;
  }, [industry, posts]);

  const [featured, ...rest] = filtered;

  return (
    <>
      <section className="surface-dark border-b border-border bg-background">
        <Container className="flex flex-col items-center py-8 text-center sm:py-12">
          <h1 className="max-w-3xl text-balance text-2xl font-semibold tracking-tight sm:text-5xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
            {t("pageDescription")}
          </p>
        </Container>
      </section>

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
              aria-selected={industry === "all"}
              onClick={() => setIndustry("all")}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:px-4 sm:py-2 sm:text-sm",
                industry === "all"
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground",
              )}
            >
              {t("allCategories")}
            </button>
            {projectIndustries.map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={industry === id}
                onClick={() => setIndustry(id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:px-4 sm:py-2 sm:text-sm",
                  industry === id
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground",
                )}
              >
                {t(`categories.${id}`)}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="mt-14 text-center text-sm text-muted-foreground">
              {t("empty")}
            </p>
          ) : (
            <div className="mt-8 space-y-4 sm:mt-12 sm:space-y-8">
              {featured ? <FeaturedProject project={featured} /> : null}

              {rest.length > 0 ? (
                <ul className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  {rest.map((project) => (
                    <li key={project.id}>
                      <ProjectCard project={project} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
