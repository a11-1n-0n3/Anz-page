import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/primitives/button";
import { Container, Section } from "@/components/primitives/section";
import { Link } from "@/i18n/navigation";

type BtnVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

export type CtaAction = {
  href: "/" | "/team" | "/blog" | "/careers" | "/#contact" | "/#features" | "/#how-it-works" | (string & {});
  label: string;
  variant?: BtnVariant;
  icon?: "arrow-up-right" | "arrow-right";
  className?: string;
};

/** Centered title + body + action row (team footer CTA, etc.). */
export function CtaBand({
  title,
  body,
  actions,
  className,
}: {
  title: string;
  body?: string;
  actions: CtaAction[];
  className?: string;
}) {
  return (
    <Section className={className ?? "border-t border-border pt-10 sm:pt-12"}>
      <Container className="flex flex-col items-center text-center">
        <h2 className="max-w-2xl text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {body ? (
          <p className="mt-3 max-w-xl text-pretty text-base text-muted-foreground">
            {body}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          {actions.map((action) => (
            <Button
              key={action.href + action.label}
              asChild
              variant={action.variant ?? "brand"}
              className={action.className}
            >
              {/* ponytail: string href — next-intl Pathnames are wider than our CTA set */}
              <Link href={action.href as "/"}>
                {action.icon === "arrow-up-right" ? (
                  <ArrowUpRight aria-hidden strokeWidth={2} className="size-4" />
                ) : null}
                {action.label}
                {action.icon === "arrow-right" ? (
                  <ArrowRight aria-hidden strokeWidth={2} className="size-4" />
                ) : null}
              </Link>
            </Button>
          ))}
        </div>
      </Container>
    </Section>
  );
}
