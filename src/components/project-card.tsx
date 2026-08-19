import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";

import type { Project } from "@/lib/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

export function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const t = useTranslations("projects");
  const locale = useLocale() as Locale;
  const format = useFormatter();

  return (
    <Link
      href={`/blog/${project.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(11,22,32,0.35)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        className,
      )}
    >
      {project.cover ? (
        <Image
          src={project.cover}
          alt=""
          width={640}
          height={360}
          className="aspect-[16/9] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div
          aria-hidden
          className="aspect-[16/9] w-full bg-[linear-gradient(140deg,var(--brand-soft),var(--secondary))]"
        />
      )}

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] text-brand-ink uppercase sm:gap-3 sm:text-[12px]">
          {project.industry ? (
            <>
              {t(`categories.${project.industry}`)}
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

        <h3 className="mt-2 text-balance text-sm font-semibold tracking-tight sm:mt-3 sm:text-lg">
          {project.title[locale]}
        </h3>

        <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-relaxed text-muted-foreground sm:mt-2.5 sm:text-sm">
          {project.excerpt[locale]}
        </p>

        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand-ink sm:mt-5 sm:text-sm">
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
