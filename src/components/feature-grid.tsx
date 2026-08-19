import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container, Section, SectionHeading } from "@/components/section";

// Education uses a shipped case-study frame; vision/assistant/document are generated stills.
const features = [
  {
    id: "vision",
    image: "/assets/solutions/solution-vision.png",
  },
  {
    id: "education",
    image: "/blog/nova-learn/thumnail.png",
  },
  {
    id: "conversational",
    image: "/assets/solutions/solution-assistant.png",
  },
  {
    id: "generative",
    image:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "document",
    image: "/assets/solutions/solution-document.png",
  },
  {
    id: "predictive",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  },
] as const;

export function FeatureGrid() {
  const t = useTranslations("features");

  return (
    <Section id="features">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-14 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
          {features.map((feature) => (
            <li
              key={feature.id}
              className="w-[min(78vw,19rem)] shrink-0 snap-start md:w-auto md:min-w-0"
            >
              <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card [transition-property:transform,border-color,box-shadow,background-color] [transition-duration:3s,1.5s,1.5s,1.5s] ease-out hover:-translate-y-1.5 hover:border-brand/40 hover:bg-brand-soft/40 hover:shadow-[0_22px_44px_-20px_rgba(0,7,205,0.35)]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 -right-16 size-44 rounded-full bg-brand/20 opacity-0 blur-2xl transition-opacity duration-[1500ms] group-hover:opacity-100"
                />

                <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                  <Image
                    src={feature.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 78vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top transition-transform duration-[1500ms] ease-out group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-7">
                  <h3 className="text-sm font-semibold tracking-tight transition-colors duration-[1500ms] group-hover:text-brand-ink sm:text-lg">
                    {t(`items.${feature.id}.title`)}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground transition-colors duration-[1500ms] group-hover:text-foreground/80 sm:mt-2.5 sm:text-[15px]">
                    {t(`items.${feature.id}.description`)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
