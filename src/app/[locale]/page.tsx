import { getTranslations, setRequestLocale } from "next-intl/server";

import { Contact } from "@/components/blocks/contact";
import { Hero } from "@/components/blocks/hero";
import { HowItWorks } from "@/components/blocks/how-it-works";
import { ProjectsTeaser } from "@/components/blocks/projects-teaser";
import { StatBand } from "@/components/blocks/stat-band";
import { Statement } from "@/components/blocks/statement";
import { Card } from "@/components/primitives/card";
import { CardGrid } from "@/components/primitives/card-grid";
import {
  Container,
  Section,
  SectionHeading,
} from "@/components/primitives/section";
import { listPosts } from "@/lib/posts";
import { features } from "@/lib/site";

// The posts teaser reads Supabase, which only exists at container runtime,
// not at `next build` time — render on every request rather than at build.
export const dynamic = "force-dynamic";

// StatBand renders null until its records in lib/site.ts are filled.
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  // Must also call in the page — layout alone is not enough for static rendering
  setRequestLocale(locale);
  const tFeatures = await getTranslations("features");

  return (
    <>
      <Hero />
      <Statement />
      <StatBand />

      <Section id="features">
        <Container>
          <SectionHeading
            eyebrow={tFeatures("eyebrow")}
            title={tFeatures("title")}
            description={tFeatures("description")}
          />
          <CardGrid cols={3} snap className="mt-8 md:mt-14">
            {features.map((feature) => (
              <li
                key={feature.id}
                className="w-[min(78vw,19rem)] shrink-0 snap-start md:w-auto md:min-w-0"
              >
                <Card
                  variant="media"
                  image={feature.image}
                  title={tFeatures(`items.${feature.id}.title`)}
                  description={tFeatures(`items.${feature.id}.description`)}
                />
              </li>
            ))}
          </CardGrid>
        </Container>
      </Section>

      <HowItWorks />
      <ProjectsTeaser posts={await listPosts()} showAllLink />
      <Contact />
    </>
  );
}
