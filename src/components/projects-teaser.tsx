import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { ProjectCard } from "@/components/project-card";
import { Container, Section, SectionHeading } from "@/components/section";
import type { Project } from "@/lib/site";
import { Link } from "@/i18n/navigation";

/** Home teaser — arrow routes to /blog. */
export function ProjectsTeaser({
  posts,
  showAllLink = false,
}: {
  posts: Project[];
  showAllLink?: boolean;
}) {
  const t = useTranslations("projects");
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

        <ul className="mt-8 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-5">
          {teaser.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
