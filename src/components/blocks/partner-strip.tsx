import { partners } from "@/lib/site";

/** Logo row under the hero. */
export function PartnerStrip() {
  if (partners.length === 0) return null;

  return (
    <section
      aria-label="Partners"
      className="relative isolate mt-8 pt-2 sm:mt-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 -bottom-16 -z-10 bg-gradient-to-b from-transparent via-background via-45% to-background"
      />

      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-14 sm:gap-y-6">
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
                className="h-5 w-auto brightness-0 opacity-70 invert transition duration-300 hover:opacity-100 sm:h-7"
              />
            ) : (
              <span className="text-sm font-semibold tracking-[0.12em] text-muted-foreground">
                {partner.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
