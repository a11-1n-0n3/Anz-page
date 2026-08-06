import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/button";
import { Section } from "@/components/section";
import { PartnerStrip } from "@/components/partner-strip";
import { siteConfig } from "@/lib/site";
import { Link } from "@/i18n/navigation";

// py-0 sm:py-0 — twMerge leaves sm:py-28 if only p-0 is passed
export function Hero() {
  const t = useTranslations("hero");
  const tSite = useTranslations("site");

  return (
    <Section className="py-0 sm:py-0">
      <div className="surface-dark relative isolate flex min-h-[min(88vh,52rem)] flex-col overflow-hidden bg-[#05080c] px-5 pt-20 pb-10 sm:px-8 sm:pt-24 sm:pb-12">
        {/* Cyan grid on near-black */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-30 opacity-[0.35] [background-image:repeating-linear-gradient(-45deg,transparent_0_18px,rgba(34,211,238,0.09)_18px_19px),repeating-linear-gradient(45deg,transparent_0_18px,rgba(34,211,238,0.09)_18px_19px)]"
        />
        {/* Cyber neon washes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_55%_at_18%_40%,rgba(34,211,238,0.22),transparent_65%),radial-gradient(55%_50%_at_82%_45%,rgba(59,130,246,0.35),transparent_68%),radial-gradient(45%_40%_at_50%_70%,rgba(14,165,233,0.18),transparent_70%),radial-gradient(70%_50%_at_50%_-10%,rgba(11,99,201,0.25),transparent_60%),radial-gradient(90%_60%_at_50%_110%,rgba(5,8,12,0.95),transparent_50%)]"
        />

        <div className="relative z-0 mx-auto flex w-full max-w-3xl flex-1 -translate-y-6 flex-col items-center justify-center text-center sm:-translate-y-10">
          <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-neon/35 bg-neon/[0.1] px-3 py-1.5 text-[10px] font-medium tracking-[0.12em] text-neon-ink uppercase sm:px-3.5 sm:text-[12px] sm:tracking-[0.14em]">
            <span aria-hidden className="size-1.5 rounded-full bg-neon shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
            {tSite("tagline")}
          </p>

          <h1 className="animate-rise mx-auto mt-4 max-w-3xl text-balance text-[2.5rem] leading-[1.06] font-semibold text-foreground sm:text-6xl lg:text-[4.25rem] [animation-delay:80ms]">
            {t.rich("title", {
              name: siteConfig.name,
              hl: (chunks) => (
                <span className="italic text-neon-ink drop-shadow-[0_0_24px_rgba(34,211,238,0.45)]">
                  {chunks}
                </span>
              ),
            })}
          </h1>

          <p className="animate-rise mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-foreground/80 sm:text-lg [animation-delay:140ms]">
            {tSite("description")}
          </p>

          <div className="animate-rise mt-9 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4 [animation-delay:200ms]">
            <Button asChild size="lg" variant="neon">
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
