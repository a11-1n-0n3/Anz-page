import { Container } from "@/components/primitives/section";
import { cn } from "@/lib/utils";

/** Centered page title band used on team, blog, etc. */
export function PageHero({
  title,
  description,
  className,
  titleClassName,
}: {
  title: string;
  description?: string;
  className?: string;
  /** Blog uses slightly smaller mobile title than team */
  titleClassName?: string;
}) {
  return (
    <section
      className={cn(
        "surface-dark border-b border-border bg-background",
        className,
      )}
    >
      <Container className="flex flex-col items-center py-8 text-center sm:py-12">
        <h1
          className={cn(
            "max-w-3xl text-balance font-semibold tracking-tight",
            titleClassName ?? "text-4xl sm:text-5xl",
          )}
        >
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
            {description}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
