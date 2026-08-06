import { useTranslations } from "next-intl";

import { Button } from "@/components/button";
import { Container, Section } from "@/components/section";
import { siteConfig } from "@/lib/site";
import { Link } from "@/i18n/navigation";

/** First viewport: brand thesis + a concrete “instrument” stage (vision console). */
export function Hero() {
  const t = useTranslations("hero");
  const tSite = useTranslations("site");

  return (
    <Section className="relative overflow-hidden pb-8 pt-24 sm:pb-12 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--gold-soft),transparent_55%)]"
      />

      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="animate-rise inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.14em] text-gold-ink uppercase">
            {/* Static bullet. It marks the label — it never meant anything moving. */}
            <span aria-hidden className="size-1.5 rounded-full bg-gold" />
            {tSite("tagline")}
          </p>

          {/*
            The wordmark that used to sit inside this h1 is gone. It repeated
            the header logo and the name already inside the sentence — three
            "ANZ"s above the fold — and screen readers read the h1 as
            "ANZ Put AI to work in production with ANZ".
          */}
          {/*
            Two-tone headline: the middle clause carries the accent colour.
            Done with `t.rich` and an `<hl>` tag inside the message rather than
            by splitting strings in code — the highlighted span lands on a
            different clause in each language, and only the translator knows
            where it belongs.
          */}
          <h1 className="animate-rise mx-auto mt-6 max-w-3xl text-balance text-[2.6rem] leading-[1.08] font-semibold sm:text-6xl [animation-delay:80ms]">
            {t.rich("title", {
              name: siteConfig.name,
              hl: (chunks) => <span className="text-gold-ink">{chunks}</span>,
            })}
          </h1>

          <p className="animate-rise mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg [animation-delay:140ms]">
            {tSite("description")}
          </p>

          <div className="animate-rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row [animation-delay:200ms]">
            <Button asChild size="lg">
              <Link href="/#contact">{t("primaryCta")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/#features">{t("secondaryCta")}</Link>
            </Button>
          </div>
        </div>

        {/*
          Product stage — CSS mock of a vision console (the company’s craft).
          Replace with a real screenshot later; keep priority when swapping to next/image.
        */}
        {/*
          Tilted very slightly and lifted on a deeper shadow, so the console
          reads as a real object sitting on the page rather than a flat panel
          pasted into it. 1.4deg is enough to register without looking skewed.
        */}
        <div className="animate-rise relative mx-auto mt-14 w-full max-w-5xl [perspective:1600px] [animation-delay:280ms]">
          <div className="overflow-hidden rounded-2xl border border-border bg-[#0f1115] shadow-[0_40px_90px_-30px_rgba(29,29,31,0.5)] [transform:rotateX(1.4deg)]">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="ml-3 text-[11px] tracking-wide text-white/40">
                anz · vision console
              </span>
              <span className="ml-auto flex items-center gap-1.5 text-[11px] text-gold">
                {/*
                  "Live" reads from a static halo instead of a blink: a solid
                  dot inside a translucent ring. Same signal, drawn once.
                */}
                <span className="size-1.5 rounded-full bg-gold ring-4 ring-gold/25" />
                live
              </span>
            </div>

            <div className="relative aspect-[16/9] bg-[linear-gradient(160deg,#151820_0%,#1a1f2a_45%,#12151c_100%)]">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:48px_48px]"
              />

              {/* Detection frames */}
              <div
                aria-hidden
                className="absolute top-[18%] left-[12%] h-[42%] w-[22%] rounded-sm border border-gold/70"
              >
                {/*
                  Detection labels are hidden below `sm`. At phone widths the
                  console is ~320px wide and 10px labels overlap the frames
                  into noise — the boxes alone still read as "object detection".
                */}
                <span className="absolute -top-5 left-0 hidden text-[10px] tracking-wider text-gold uppercase sm:inline">
                  person · 0.94
                </span>
              </div>
              <div
                aria-hidden
                className="absolute top-[28%] right-[16%] h-[36%] w-[28%] rounded-sm border border-white/35"
              >
                <span className="absolute -top-5 left-0 hidden text-[10px] tracking-wider text-white/55 uppercase sm:inline">
                  vehicle · 0.88
                </span>
              </div>
              <div
                aria-hidden
                className="absolute bottom-[14%] left-[38%] h-[24%] w-[18%] rounded-sm border border-gold/40"
              >
                <span className="absolute -bottom-5 left-0 hidden text-[10px] tracking-wider text-gold/80 uppercase sm:inline">
                  anomaly · watch
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/70 to-transparent p-5 sm:p-6">
                <div>
                  <p className="text-[11px] tracking-[0.16em] text-white/45 uppercase">
                    Camera AI · feed 03
                  </p>
                  <p className="mt-1 text-sm text-white/85">
                    Detection overlay on live stream
                  </p>
                </div>
                <div className="hidden text-right text-[11px] text-white/40 sm:block">
                  <p>fps 28</p>
                  <p>latency 42ms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
