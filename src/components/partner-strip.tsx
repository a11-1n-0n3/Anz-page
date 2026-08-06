import Image from "next/image";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Container } from "@/components/section";
import { partners } from "@/lib/site";

/**
 * Thin trust strip. Rendered inside the hero canvas.
 *
 * Placed before the domains section on purpose: in B2B the first unspoken
 * question is "has anyone actually bought this?", and answering it costs about
 * 120px of height.
 *
 * Renders nothing when `partners` is empty — one or two lonely logos read as
 * weaker than no strip at all, so an incomplete list should simply not ship.
 */
export function PartnerStrip({
  /**
   * Set when the strip sits inside the hero frame rather than standing on its
   * own. This is a STRUCTURAL switch, not a colour one — colour is already
   * handled by the surface tokens. Inside the frame the strip must drop its
   * own background and rules, because the canvas already provides the edge and
   * a second one directly under the console reads as a stray line.
   */
  inFrame = false,
}: {
  inFrame?: boolean;
}) {
  const t = useTranslations("partners");

  if (partners.length === 0) return null;

  const Wrapper = inFrame ? "div" : Container;

  return (
    <section
      aria-labelledby="partners-label"
      className={cn(
        inFrame
          ? "relative isolate mt-16 pt-2"
          : "border-y border-border bg-card py-10",
      )}
    >
      {/*
        Inside the frame the strip stands on the wave band, and at 375px the
        frame is narrower than the scene — the SVG crops to its brightest
        crest, which put these wordmarks at 1.6:1 against it. This scrim is
        sized to the strip rather than to the hero, so it buys readability
        without dimming the whole wave band on its way down.
      */}
      {inFrame ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-32 -bottom-16 -z-10 bg-gradient-to-b from-transparent via-background via-45% to-background"
        />
      ) : null}

      <Wrapper>
        <p
          id="partners-label"
          className="text-center text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase"
        >
          {t("label")}
        </p>

        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {partners.map((partner) => (
            <li key={partner.id}>
              {partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={32}
                  /*
                   * Grayscale at rest so a wall of competing brand colours
                   * doesn't pull attention off the hero CTA; colour on hover.
                   */
                  className="h-7 w-auto opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              ) : (
                /* TODO(anz): placeholder wordmark — swap for a real logo file. */
                <span
                  className={cn(
                    "text-sm font-semibold tracking-[0.12em]",
                    /*
                     * Full-strength muted inside the frame: it sits over the
                     * wave scrim, which is darker and busier than the flat card
                     * the standalone strip stands on, and 70% opacity there
                     * drops it below the AA floor.
                     */
                    inFrame ? "text-muted-foreground" : "text-muted-foreground/70",
                  )}
                >
                  {partner.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </Wrapper>
    </section>
  );
}
