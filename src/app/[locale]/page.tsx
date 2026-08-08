import { setRequestLocale } from "next-intl/server";

import { Contact } from "@/components/contact";
import { FeatureGrid } from "@/components/feature-grid";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Industries } from "@/components/industries";
import { Insights } from "@/components/insights";
import { StatBand } from "@/components/stat-band";
import { Statement } from "@/components/statement";

// StatBand renders null until its records in lib/site.ts are filled.
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  // Must also call in the page — layout alone is not enough for static rendering
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Statement />
      <StatBand />
      <FeatureGrid />
      <HowItWorks />
      <Industries />
      <Insights showBlogLink />
      <Contact />
    </>
  );
}
