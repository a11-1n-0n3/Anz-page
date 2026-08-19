import { setRequestLocale } from "next-intl/server";

import { Contact } from "@/components/contact";
import { FeatureGrid } from "@/components/feature-grid";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { ProjectsTeaser } from "@/components/projects-teaser";
import { StatBand } from "@/components/stat-band";
import { Statement } from "@/components/statement";
import { listPosts } from "@/lib/posts";

// The posts teaser reads Supabase, which only exists at container runtime,
// not at `next build` time — render on every request rather than at build.
export const dynamic = "force-dynamic";

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
      <ProjectsTeaser posts={await listPosts()} showAllLink />
      <Contact />
    </>
  );
}
