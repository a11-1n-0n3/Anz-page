import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/button";
import { Scanlines } from "@/components/scanlines";
import { Section } from "@/components/section";
import { PartnerStrip } from "@/components/partner-strip";
import { Link } from "@/i18n/navigation";

// py-0 sm:py-0 — twMerge leaves sm:py-28 if only p-0 is passed
export function Hero() {
  const t = useTranslations("hero");
  const tSite = useTranslations("site");

  return (
    <Section className="py-0 sm:py-0">
      <div className="surface-dark relative isolate flex min-h-[min(88vh,52rem)] flex-col overflow-hidden bg-background px-5 pt-20 pb-10 sm:px-8 sm:pt-24 sm:pb-12">
        {/* Desktop only — no room for it beside the headline at 375px */}
        <Scanlines className="pointer-events-none absolute inset-0 -z-20 max-sm:hidden" />

        <div className="relative z-0 mx-auto flex w-full max-w-3xl flex-1 -translate-y-6 flex-col items-center justify-center text-center sm:-translate-y-10">
          <p className="animate-rise inline-flex items-center gap-2 rounded-sm border border-border bg-card/70 px-3 py-1.5 text-[10px] font-medium tracking-[0.12em] text-foreground uppercase backdrop-blur-sm sm:px-3.5 sm:text-[12px] sm:tracking-[0.14em]">
            <span aria-hidden className="size-1.5 bg-brand-ink" />
            {tSite("tagline")}
          </p>

          <h1 className="animate-rise mx-auto mt-4 max-w-3xl text-balance text-[2.5rem] leading-[1.06] font-semibold text-foreground sm:text-6xl lg:text-[4.25rem] [animation-delay:80ms]">
            {t.rich("title", {
              hl: (chunks) => (
                <span className="italic text-brand-ink">{chunks}</span>
              ),
            })}
          </h1>

          <p className="animate-rise mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-foreground/80 sm:text-lg [animation-delay:140ms]">
            {tSite("description")}
          </p>

          <div className="animate-rise mt-9 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4 [animation-delay:200ms]">
            <Button asChild size="lg" variant="brand">
              <Link href="/#contact">
                <ArrowUpRight aria-hidden strokeWidth={2} className="size-4" />
                {t("primaryCta")}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-foreground/50 bg-background/60 text-foreground backdrop-blur-md hover:bg-background/80 hover:text-foreground"
            >
              <Link href="/#features">{t("secondaryCta")}</Link>
            </Button>
          </div>
        </div>

        <PartnerStrip inFrame />
      </div>
    </Section>
  );
}
