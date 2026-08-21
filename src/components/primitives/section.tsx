import * as React from "react";

import { cn } from "@/lib/utils";

export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

export function Section({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return <section className={cn("pb-8 sm:pb-16", className)} {...props} />;
}

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

// Boxed tag, not bare small-caps. brand-ink not brand — brand is 1.75:1 on dark
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2 py-0.5 text-[10px] font-medium tracking-[0.14em] text-foreground uppercase sm:gap-2 sm:px-2.5 sm:py-1 sm:text-[11px]">
      <span aria-hidden className="size-1.5 bg-brand-ink" />
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
      <h2 className="mt-3 text-balance text-2xl font-semibold sm:mt-4 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
