"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";

import { PostCard } from "@/components/blog-card";
import { Container, Section } from "@/components/section";
import {
  postCategories,
  posts,
  type Post,
  type PostCategory,
} from "@/lib/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

// Layout inspired by kms-technology.com/blog — hero + category pills + featured + grid.
function FeaturedPost({ post }: { post: Post }) {
  const t = useTranslations("insights");
  const locale = useLocale() as Locale;
  const format = useFormatter();

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid overflow-hidden rounded-lg border border-border bg-card transition-shadow duration-300 hover:shadow-[0_22px_48px_-24px_rgba(11,22,32,0.4)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none lg:grid-cols-2"
    >
      <div className="relative min-h-56 overflow-hidden sm:min-h-72">
        {post.cover ? (
          <Image
            src={post.cover}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(140deg,var(--brand-soft),var(--secondary))]"
          />
        )}
      </div>

      <div className="flex flex-col justify-center p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-3 text-[12px] font-medium tracking-[0.14em] text-brand-ink uppercase">
          <span className="rounded-sm border border-brand/25 bg-brand-soft px-2 py-0.5">
            {post.tag[locale]}
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

        <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          {post.title[locale]}
        </h2>
        <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
          {post.excerpt[locale]}
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

export function BlogIndex() {
  const t = useTranslations("blog");
  const [category, setCategory] = useState<PostCategory | "all">("all");

  const filtered = useMemo(() => {
    const list =
      category === "all"
        ? posts
        : posts.filter((p) => p.category === category);
    return [...list].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [category]);

  const [featured, ...rest] = filtered;

  return (
    <>
      <section className="surface-dark border-b border-border bg-background">
        <Container className="flex flex-col items-center py-16 text-center sm:py-20">
          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("description")}
          </p>
        </Container>
      </section>

      <Section className="pt-10 sm:pt-14">
        <Container>
          <div
            role="tablist"
            aria-label={t("categoriesLabel")}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={category === "all"}
              onClick={() => setCategory("all")}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                category === "all"
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground",
              )}
            >
              {t("allCategories")}
            </button>
            {postCategories.map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={category === id}
                onClick={() => setCategory(id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  category === id
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
            <div className="mt-12 space-y-8">
              {featured ? <FeaturedPost post={featured} /> : null}

              {rest.length > 0 ? (
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <li key={post.id}>
                      <PostCard post={post} />
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
