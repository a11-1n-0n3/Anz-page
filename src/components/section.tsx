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
 * Rounded canvas that content sits inside rather than running edge to edge.
 *
 * The hero uses it to become an object on the page. `overflow-hidden` is load
 * bearing: the wave backdrop is drawn well past the frame's bounds so the
 * curves stay smooth, and this is what crops them back to the radius.
 */
export function Frame({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-frame",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Small caps label above a heading.
 *
 * Uses `neon-ink`, not `neon` — this is text, and plain neon sits at 1.81:1
 * against white. Both tokens re-declare themselves inside `.surface-dark`, so
 * this reads correctly on either ground without a prop.
 */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.14em] text-neon-ink uppercase">
      <span aria-hidden className="size-1.5 rounded-full bg-neon" />
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
      <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">
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
