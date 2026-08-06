import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Layout primitives that carry the page's rhythm.
 *
 * The whole page uses ONE alignment rule: section headings are left-aligned.
 * Only the hero is centred, because it is the single moment where the page
 * speaks rather than explains. Mixing centred and left-aligned headings down
 * a long page forces the eye to re-anchor at every scroll stop.
 */

export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

export function Section({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return <section className={cn("py-20 sm:py-28", className)} {...props} />;
}

/**
 * Small caps label above a heading.
 *
 * Uses `gold-ink`, not `gold` — this is text, and plain gold sits at 2.8:1
 * against white.
 */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.14em] text-gold-ink uppercase">
      <span aria-hidden className="size-1.5 rounded-full bg-gold" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
