import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";

import type { Post } from "@/lib/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

export function PostCard({
  post,
  className,
}: {
  post: Post;
  className?: string;
}) {
  const t = useTranslations("insights");
  const locale = useLocale() as Locale;
  const format = useFormatter();

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(11,22,32,0.35)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        className,
      )}
    >
      {post.cover ? (
        <Image
          src={post.cover}
          alt=""
          width={640}
          height={360}
          className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div
          aria-hidden
          className="aspect-[16/9] w-full bg-[linear-gradient(140deg,var(--brand-soft),var(--secondary))]"
        />
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-[12px] font-medium tracking-[0.14em] text-brand-ink uppercase">
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
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>

        <h3 className="mt-3 text-balance text-base font-semibold tracking-tight sm:text-lg">
          {post.title[locale]}
        </h3>

        <p className="mt-2.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt[locale]}
        </p>

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-ink">
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
