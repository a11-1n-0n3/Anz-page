import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";

import { Container, Section, SectionHeading } from "@/components/section";
import { posts } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

// Renders nothing while `posts` is empty — see the warning in lib/site.ts.
export function Insights() {
  const t = useTranslations("insights");
  const locale = useLocale() as Locale;
  const format = useFormatter();

  if (posts.length === 0) return null;

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.id}>
              {/* Whole card is the link — a separate "read more" doubles the tab stop */}
              <a
                href={post.href}
                className="group block overflow-hidden rounded-lg border border-border bg-card transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(11,22,32,0.35)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
              >
                {post.cover ? (
                  <Image
                    src={post.cover}
                    alt=""
                    width={640}
                    height={360}
                    className="aspect-[16/9] w-full object-cover"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="aspect-[16/9] w-full bg-[linear-gradient(140deg,var(--brand-soft),var(--secondary))]"
                  />
                )}

                <div className="p-6">
                  <div className="flex items-center gap-3 text-[12px] font-medium tracking-[0.14em] text-brand-ink uppercase">
                    {post.tag[locale]}
                    {/* muted, not border: --border is 1.28:1 on card white */}
                    <span aria-hidden className="text-muted-foreground">
                      ·
                    </span>
                    <time
                      dateTime={post.date}
                      className="tracking-normal normal-case text-muted-foreground"
                    >
                      {format.dateTime(new Date(post.date), {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>

                  <h3 className="mt-3 text-balance text-base font-semibold tracking-tight sm:text-lg">
                    {post.title[locale]}
                  </h3>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-ink">
                    {t("readMore")}
                    <ArrowUpRight
                      aria-hidden
                      strokeWidth={2}
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
