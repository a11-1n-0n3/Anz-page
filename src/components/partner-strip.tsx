import { cn } from "@/lib/utils";
import { Container } from "@/components/section";
import { partners } from "@/lib/site";

export function PartnerStrip({ inFrame = false }: { inFrame?: boolean }) {
  if (partners.length === 0) return null;

  const Wrapper = inFrame ? "div" : Container;

  return (
    <section
      aria-label="Partners"
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
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {partners.map((partner) => (
            <li key={partner.id}>
              {partner.logo ? (
                // SVG marks: use <img> — next/image SVG policy is awkward, and
                // on the dark hero we invert to white so black fills stay visible.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={32}
                  className={cn(
                    "h-7 w-auto opacity-70 transition duration-300 hover:opacity-100",
                    inFrame
                      ? "brightness-0 invert"
                      : "grayscale hover:grayscale-0",
                  )}
                />
              ) : (
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
