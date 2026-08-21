import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";

import { MarkdownBody } from "@/components/primitives/markdown-body";
import { Container, Section } from "@/components/primitives/section";
import type { Project } from "@/lib/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const WORDS_PER_MINUTE = 200;

function readingMinutes(md: string) {
  const words = md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`\[\]()!-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function expandGalleryMarkers(body: string, gallery: string[]) {
  return body.replace(/^!\[(\d+)\]\s*$/gm, (_, n) => {
    const src = gallery[Number(n)];
    return src ? `![](${src})` : "";
  });
}

export function ProjectDetail({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const tDomain = useTranslations("features");
  const locale = useLocale() as Locale;
  const format = useFormatter();
  const gallery = project.gallery ?? [];
  const body = expandGalleryMarkers(project.body[locale], gallery);
  const minutes = readingMinutes(body);
  const used = new Set(
    [...body.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1]),
  );
  const heroSrc =
    project.cover && !used.has(project.cover) ? project.cover : undefined;
  const leftoverGallery = gallery
    .map((src, i) => ({ src, i }))
    .filter(({ src, i }) => i !== 0 && !used.has(src));

  return (
    <Section className="pt-6 sm:pt-8">
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ArrowLeft aria-hidden strokeWidth={2} className="size-4" />
          {t("back")}
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-[12px] font-medium tracking-[0.14em] text-brand-ink uppercase">
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
              month: "long",
              day: "numeric",
            })}
          </time>
          <span aria-hidden className="text-muted-foreground">
            ·
          </span>
          <span className="tracking-normal normal-case text-muted-foreground">
            {t("minRead", { count: minutes })}
          </span>
        </div>

        {project.client ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {project.client[locale]}
          </p>
        ) : null}

        <h1 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
          {project.title[locale]}
        </h1>

        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {project.excerpt[locale]}
        </p>

        {heroSrc ? (
          <Image
            src={heroSrc}
            alt=""
            width={1280}
            height={800}
            className="mt-10 w-full rounded-lg border border-border bg-card object-contain"
            priority
          />
        ) : (
          <div
            aria-hidden
            className="mt-10 aspect-[16/9] w-full rounded-lg bg-[linear-gradient(140deg,var(--brand-soft),var(--secondary))]"
          />
        )}

        {(
          [
            ["problem", project.problem],
            ["solution", project.solution],
            ["outcome", project.outcome],
          ] as const
        ).some(([, value]) => value) ? (
          <dl className="mt-10 grid gap-6 sm:grid-cols-1">
            {(
              [
                ["problem", project.problem],
                ["solution", project.solution],
                ["outcome", project.outcome],
              ] as const
            )
              .filter(([, value]) => value)
              .map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-lg border border-border bg-card px-5 py-4 sm:px-6 sm:py-5"
                >
                  <dt className="text-[11px] font-medium tracking-[0.14em] text-brand-ink uppercase">
                    {t(key)}
                  </dt>
                  <dd className="mt-2 text-pretty text-base leading-relaxed text-foreground/90">
                    {value![locale]}
                  </dd>
                </div>
              ))}
          </dl>
        ) : null}

        <div className="mt-10">
          <MarkdownBody markdown={body} />
        </div>

        {leftoverGallery.length > 0 ? (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {leftoverGallery.map(({ src }) => (
              <li key={src}>
                <Image
                  src={src}
                  alt=""
                  width={1280}
                  height={800}
                  className="w-full rounded-lg border border-border bg-card object-contain"
                />
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </Section>
  );
}
