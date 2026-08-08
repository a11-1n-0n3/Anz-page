import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";

import { Container, Section } from "@/components/section";
import type { Post } from "@/lib/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export function BlogPost({ post }: { post: Post }) {
  const t = useTranslations("blog");
  const locale = useLocale() as Locale;
  const format = useFormatter();
  const paragraphs = post.body[locale].split(/\n\n+/).filter(Boolean);

  return (
    <Section className="pt-10 sm:pt-14">
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ArrowLeft aria-hidden strokeWidth={2} className="size-4" />
          {t("back")}
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-[12px] font-medium tracking-[0.14em] text-brand-ink uppercase">
          {post.tag[locale]}
          <span aria-hidden className="text-muted-foreground">
            ·
          </span>
          <time
            dateTime={post.date}
            className="tracking-normal normal-case text-muted-foreground"
          >
            {format.dateTime(new Date(post.date), {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {post.title[locale]}
        </h1>

        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {post.excerpt[locale]}
        </p>

        {post.cover ? (
          <Image
            src={post.cover}
            alt=""
            width={960}
            height={540}
            className="mt-10 aspect-[16/9] w-full rounded-lg object-cover"
            priority
          />
        ) : (
          <div
            aria-hidden
            className="mt-10 aspect-[16/9] w-full rounded-lg bg-[linear-gradient(140deg,var(--brand-soft),var(--secondary))]"
          />
        )}

        <div className="mt-10 space-y-5 text-base leading-relaxed text-foreground/90 sm:text-[17px]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Container>
    </Section>
  );
}
