import Image from "next/image";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Container } from "@/components/section";
import { partners } from "@/lib/site";

export function PartnerStrip({ inFrame = false }: { inFrame?: boolean }) {
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
                  className="h-7 w-auto opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              ) : (
                // TODO(anz): swap for a real logo file
                <span
                  className={cn(
                    "text-sm font-semibold tracking-[0.12em]",
                    inFrame
                      ? "text-muted-foreground"
                      : "text-muted-foreground/70",
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
