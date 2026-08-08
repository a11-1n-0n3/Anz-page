import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { PostCard } from "@/components/blog-card";
import { Container, Section, SectionHeading } from "@/components/section";
import { posts } from "@/lib/site";
import { Link } from "@/i18n/navigation";

/** Home teaser — arrow routes to /blog. */
export function Insights({
  showBlogLink = false,
}: {
  showBlogLink?: boolean;
}) {
  const t = useTranslations("insights");
  const teaser = posts.slice(0, 2);

  if (teaser.length === 0) return null;

  return (
    <Section>
      <Container>
        <div className="flex items-center justify-between gap-6">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
          {showBlogLink ? (
            <Link
              href="/blog"
              className="group flex shrink-0 flex-col items-center gap-1.5 rounded-md px-2 py-1 text-brand-ink transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <ArrowRight
                aria-hidden
                strokeWidth={2}
                className="size-7 transition-transform duration-300 group-hover:translate-x-1 sm:size-8"
              />
              <span className="text-sm font-medium">{t("viewAll")}</span>
            </Link>
          ) : null}
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {teaser.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
