import Image from "next/image";
import { User } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type CardVariant = "media" | "project" | "portrait";

type CardProps = {
  variant?: CardVariant;
  /** When set, wraps the card in next-intl `Link` */
  href?: string;
  image?: string;
  title: string;
  description?: string;
  /** Eyebrow row (e.g. domain · date) — project variant */
  meta?: React.ReactNode;
  /** Footer row (e.g. read more) — project variant */
  action?: React.ReactNode;
  className?: string;
  sizes?: string;
  titleAs?: "h2" | "h3";
};

const aspectClass: Record<CardVariant, string> = {
  media: "aspect-[16/9]",
  project: "aspect-[16/9]",
  portrait: "aspect-[4/5]",
};

/**
 * Shared image+copy card. Variants keep the three existing looks:
 * - media: feature grid (border + long hover)
 * - project: blog teaser (link + meta/action)
 * - portrait: team member (4:5, text below, no outer chrome)
 */
export function Card({
  variant = "media",
  href,
  image,
  title,
  description,
  meta,
  action,
  className,
  sizes,
  titleAs = "h3",
}: CardProps) {
  const Title = titleAs;
  const media = (
    <CardMedia
      variant={variant}
      image={image}
      sizes={
        sizes ??
        (variant === "portrait"
          ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          : "(max-width: 768px) 78vw, (max-width: 1024px) 50vw, 33vw")
      }
    />
  );

  if (variant === "portrait") {
    return (
      <div className={cn("group text-center sm:text-left", className)}>
        {media}
        <Title className="mt-5 text-lg font-semibold tracking-tight sm:text-xl">
          {title}
        </Title>
        {meta ? (
          <p className="mt-1 text-sm font-medium text-brand-ink">{meta}</p>
        ) : null}
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    );
  }

  const body = (
    <>
      {media}
      <div
        className={cn(
          "flex flex-1 flex-col",
          variant === "project" ? "p-4 sm:p-6" : "p-4 sm:p-7",
        )}
      >
        {meta}
        <Title
          className={cn(
            "text-sm font-semibold tracking-tight sm:text-lg",
            variant === "project" && "mt-2 text-balance sm:mt-3",
            variant === "media" &&
              "transition-colors duration-[1500ms] group-hover:text-brand-ink",
          )}
        >
          {title}
        </Title>
        {description ? (
          <p
            className={cn(
              "text-[13px] leading-relaxed text-muted-foreground",
              variant === "project" &&
                "mt-2 line-clamp-2 flex-1 sm:mt-2.5 sm:text-sm",
              variant === "media" &&
                "mt-1.5 transition-colors duration-[1500ms] group-hover:text-foreground/80 sm:mt-2.5 sm:text-[15px]",
            )}
          >
            {description}
          </p>
        ) : null}
        {action}
      </div>
    </>
  );

  const shellClass = cn(
    "group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card",
    variant === "media" &&
      "[transition-property:transform,border-color,box-shadow,background-color] [transition-duration:3s,1.5s,1.5s,1.5s] ease-out hover:-translate-y-1.5 hover:border-brand/40 hover:bg-brand-soft/40 hover:shadow-[0_22px_44px_-20px_rgba(0,7,205,0.35)]",
    variant === "project" &&
      "transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(11,22,32,0.35)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
    className,
  );

  if (href) {
    return (
      <Link href={href as "/"} className={shellClass}>
        {variant === "media" ? <MediaGlow /> : null}
        {body}
      </Link>
    );
  }

  return (
    <div className={shellClass}>
      {variant === "media" ? <MediaGlow /> : null}
      {body}
    </div>
  );
}

function MediaGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-16 -right-16 size-44 rounded-full bg-brand/20 opacity-0 blur-2xl transition-opacity duration-[1500ms] group-hover:opacity-100"
    />
  );
}

function CardMedia({
  variant,
  image,
  sizes,
}: {
  variant: CardVariant;
  image?: string;
  sizes: string;
}) {
  const frame = cn(
    "overflow-hidden bg-secondary",
    aspectClass[variant],
    variant === "portrait" && "relative rounded-lg",
    variant === "media" && "relative",
    variant === "project" && !image && "w-full",
  );

  if (image) {
    if (variant === "project") {
      return (
        <Image
          src={image}
          alt=""
          width={640}
          height={360}
          className="aspect-[16/9] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      );
    }

    return (
      <div className={frame}>
        <Image
          src={image}
          alt=""
          fill
          sizes={sizes}
          className={cn(
            "object-cover",
            variant === "portrait"
              ? "transition-transform duration-500 group-hover:scale-[1.03]"
              : "object-top transition-transform duration-[1500ms] ease-out group-hover:scale-[1.03]",
          )}
        />
      </div>
    );
  }

  if (variant === "portrait") {
    return (
      <div
        aria-hidden
        className={cn(
          frame,
          "flex items-center justify-center border border-dashed border-border bg-[linear-gradient(160deg,var(--brand-soft),var(--secondary))]",
        )}
      >
        <User
          strokeWidth={1.25}
          className="size-12 text-muted-foreground/45"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        aspectClass[variant],
        "w-full bg-[linear-gradient(140deg,var(--brand-soft),var(--secondary))]",
      )}
    />
  );
}
