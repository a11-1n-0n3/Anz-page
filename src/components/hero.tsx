import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/button";
import { Container, Frame, Section } from "@/components/section";
import { NeonWaves } from "@/components/neon-waves";
import { PartnerStrip } from "@/components/partner-strip";
import { siteConfig } from "@/lib/site";
import { Link } from "@/i18n/navigation";

/**
 * First viewport: brand thesis on a lit canvas, then a concrete “instrument”
 * (the vision console) to show what the sentence actually buys.
 *
 * The hero is a FRAMED object rather than a full-bleed band — it sits inside
 * the page margin on its own rounded canvas, which is what separates it from
 * the light sections below without needing a divider.
 *
 * The trust strip lives inside that frame. It answers “has anyone actually
 * bought this?” while the visitor is still reading the headline, and it costs
 * nothing extra because the canvas is already there.
 */
export function Hero() {
  const t = useTranslations("hero");
  const tSite = useTranslations("site");

  return (
    <Section className="pt-4 pb-0 sm:pt-6">
      <Container>
        <Frame className="surface-dark px-5 pt-20 pb-10 sm:px-8 sm:pt-28 sm:pb-12">
          {/*
            Two backdrop layers, and they are separate on purpose.

            The wash fills the whole frame and has no intrinsic proportions, so
            it works at any hero height. The wave scene does have proportions —
            it is a drawn landscape — so it gets a bottom-anchored band sized
            as a fraction of the frame rather than being stretched over all of
            it. Stretching it was the first attempt: at the hero's real
            1088×1384 the `slice` fit scaled the scene 2.7x and all that
            survived was the middle of one ribbon, magnified into a flat smear.

            The band is sized by ASPECT, not by a fraction of the frame. Height
            derives from width, so the scene is never zoomed and the crests
            keep their drawn proportions — which is also what keeps the trust
            strip readable at 375px. Forcing a tall box on a narrow frame made
            `slice` crop to the brightest crest and magnify it, and no amount
            of scrim under the strip fixed that without flattening the band.

            `max-h` is the guard for very tall heroes, where the aspect alone
            would push the band up past the CTA.

            `Frame` is `isolate`, so these negative z-indices cannot escape and
            slide under the page itself.
          */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(90%_60%_at_76%_52%,rgba(34,211,238,0.15),transparent_66%),radial-gradient(80%_55%_at_14%_74%,rgba(29,78,216,0.22),transparent_70%),radial-gradient(120%_70%_at_50%_-12%,rgba(11,99,201,0.16),transparent_66%)]"
          />
          <NeonWaves className="absolute inset-x-0 bottom-0 -z-10 aspect-[16/10] max-h-[64%] w-full" />

          {/*
            Soft close on the very bottom edge only. The scrim that makes the
            trust strip readable is attached to the strip itself, not to the
            frame — a frame-sized one had to cover 38% of the hero to reach the
            strip at 375px, and it flattened the wave band on the way down.
          */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-background to-transparent"
          />

          <div className="mx-auto max-w-3xl text-center">
            {/*
              Type scales down below `sm` so the tagline stays on ONE line at
              375px. Wrapped, the leading dot floats beside a two-line block
              and stops reading as a bullet — the pill turns into a paragraph
              with a stray dot in it.
            */}
            <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/[0.08] px-3 py-1.5 text-[10px] font-medium tracking-[0.12em] text-neon-ink uppercase sm:px-3.5 sm:text-[12px] sm:tracking-[0.14em]">
              {/* Static dot. It marks the label — it never meant anything moving. */}
              <span aria-hidden className="size-1.5 rounded-full bg-neon" />
              {tSite("tagline")}
            </p>

            {/*
              Two-tone headline: the middle clause is set in ITALIC and carries
              the accent colour. Done with `t.rich` and an `<hl>` tag inside the
              message rather than by splitting strings in code — the highlighted
              span lands on a different clause in each language, and only the
              translator knows where it belongs.
            */}
            <h1 className="animate-rise mx-auto mt-7 max-w-3xl text-balance text-[2.5rem] leading-[1.06] font-semibold sm:text-6xl lg:text-[4.25rem] [animation-delay:80ms]">
              {t.rich("title", {
                name: siteConfig.name,
                hl: (chunks) => (
                  <span className="italic text-neon-ink">{chunks}</span>
                ),
              })}
            </h1>

            <p className="animate-rise mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg [animation-delay:140ms]">
              {tSite("description")}
            </p>

            <div className="animate-rise mt-9 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4 [animation-delay:200ms]">
              <Button asChild size="lg" variant="neon">
                <Link href="/#contact">
                  <ArrowUpRight aria-hidden strokeWidth={2} className="size-4" />
                  {t("primaryCta")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="link">
                <Link href="/#features">{t("secondaryCta")}</Link>
              </Button>
            </div>
          </div>

          {/*
            Product stage — CSS mock of a vision console (the company’s craft).
            Replace with a real screenshot later; keep priority when swapping to
            next/image.

            Tilted very slightly and lifted on a deep shadow, so the console
            reads as a real object sitting on the canvas rather than a flat
            panel pasted onto it. 1.4deg is enough to register without looking
            skewed.
          */}
          <div className="animate-rise relative mx-auto mt-16 w-full max-w-5xl [perspective:1600px] [animation-delay:280ms]">
            {/*
              Glass, not a solid slab.
              An opaque console dropped straight onto the wave band and hid it
              completely — 1024px of the frame's 1088px. Letting the waves read
              through is also the truer image: this is a detection overlay, so
              what sits behind the boxes should look like a scene.
            */}
            <div className="overflow-hidden rounded-2xl border border-neon/25 shadow-[0_40px_90px_-30px_rgba(2,18,34,0.9)] [transform:rotateX(1.4deg)]">
              <div className="flex items-center gap-2 border-b border-border bg-card/70 px-4 py-3 backdrop-blur-md">
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="ml-3 text-[11px] tracking-wide text-muted-foreground">
                  anz · vision console
                </span>
                <span className="ml-auto flex items-center gap-1.5 text-[11px] text-neon-ink">
                  {/*
                    "Live" reads from a static halo instead of a blink: a solid
                    dot inside a translucent ring. Same signal, drawn once.
                  */}
                  <span className="size-1.5 rounded-full bg-neon ring-4 ring-neon/25" />
                  live
                </span>
              </div>

              <div className="relative aspect-[16/9] bg-[linear-gradient(160deg,rgba(11,26,38,0.62)_0%,rgba(16,36,54,0.42)_45%,rgba(8,19,28,0.68)_100%)] backdrop-blur-[6px]">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(103,232,249,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.45)_1px,transparent_1px)] [background-size:48px_48px]"
                />

                {/* Detection frames */}
                <div
                  aria-hidden
                  className="absolute top-[18%] left-[12%] h-[42%] w-[22%] rounded-sm border border-neon/70"
                >
                  {/*
                    Detection labels are hidden below `sm`. At phone widths the
                    console is ~320px wide and 10px labels overlap the frames
                    into noise — the boxes alone still read as "object detection".
                  */}
                  <span className="absolute -top-5 left-0 hidden text-[10px] tracking-wider text-neon-ink uppercase sm:inline">
                    person · 0.94
                  </span>
                </div>
                <div
                  aria-hidden
                  className="absolute top-[28%] right-[16%] h-[36%] w-[28%] rounded-sm border border-white/35"
                >
                  <span className="absolute -top-5 left-0 hidden text-[10px] tracking-wider text-white/60 uppercase sm:inline">
                    vehicle · 0.88
                  </span>
                </div>
                <div
                  aria-hidden
                  className="absolute bottom-[14%] left-[38%] h-[24%] w-[18%] rounded-sm border border-neon/40"
                >
                  {/* Full strength, not /80: this label lands on a wave crest
                      and the dimmed version measured 3.8:1 against it. */}
                  <span className="absolute -bottom-5 left-0 hidden text-[10px] tracking-wider text-neon-ink uppercase sm:inline">
                    anomaly · watch
                  </span>
                </div>

                {/*
                  The scrim is heavier than a solid console would need. With
                  the viewport now translucent, the wave crests pass behind
                  this caption — measured against the rendered pixels, the old
                  `from-black/70` + `text-white/50` came out at 3.5:1 on a
                  375px frame, where the brightest part of the scene lands.
                */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5 sm:p-6">
                  <div>
                    <p className="text-[11px] tracking-[0.16em] text-white/70 uppercase">
                      Camera AI · feed 03
                    </p>
                    <p className="mt-1 text-sm text-white/90">
                      Detection overlay on live stream
                    </p>
                  </div>
                  <div className="hidden text-right text-[11px] text-white/70 sm:block">
                    <p>fps 28</p>
                    <p>latency 42ms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PartnerStrip inFrame />
        </Frame>
      </Container>
    </Section>
  );
}
