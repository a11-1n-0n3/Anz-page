import { setRequestLocale } from "next-intl/server";

import { Contact } from "@/components/contact";
import { FeatureGrid } from "@/components/feature-grid";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Insights } from "@/components/insights";
import { StatBand } from "@/components/stat-band";
import { Statement } from "@/components/statement";
import { TeamGrid } from "@/components/team-grid";
import { Testimonials } from "@/components/testimonials";

// StatBand, Testimonials and Insights render null until their records in
// lib/site.ts are filled, so the shipped page is currently 7 sections, not 10.
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
      <Testimonials />
      <TeamGrid />
      <Insights />
      <Contact />
    </>
  );
}
