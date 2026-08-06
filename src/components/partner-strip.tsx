import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@/components/section";
import { partners } from "@/lib/site";

/**
 * Thin trust strip directly under the hero.
 *
 * Placed before the domains section on purpose: in B2B the first unspoken
 * question is "has anyone actually bought this?", and answering it costs about
 * 120px of height.
 *
 * Renders nothing when `partners` is empty — one or two lonely logos read as
 * weaker than no strip at all, so an incomplete list should simply not ship.
 */
export function PartnerStrip() {
  const t = useTranslations("partners");

  if (partners.length === 0) return null;

  return (
    <section
      aria-labelledby="partners-label"
      className="border-y border-border bg-card py-10"
    >
      <Container>
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
                <span className="text-sm font-semibold tracking-[0.12em] text-muted-foreground/70">
                  {partner.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
