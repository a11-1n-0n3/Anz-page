import { setRequestLocale } from "next-intl/server";

import { Contact } from "@/components/contact";
import { FeatureGrid } from "@/components/feature-grid";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { TeamGrid } from "@/components/team-grid";

/**
 * Landing page.
 *
 * A Server Component: both locales are rendered to HTML at build time, so
 * crawlers and the Facebook / LinkedIn / Zalo bots read the content without
 * running any JavaScript.
 *
 * Section order follows the questions a B2B buyer asks, in order:
 *   Hero          what is this
 *                 ↳ the trust strip ("has anyone bought it?") is rendered
 *                   INSIDE the hero canvas, so it is not listed separately
 *   FeatureGrid   what do you work on
 *   HowItWorks    how would this go
 *   TeamGrid      who would I be working with          ← closing argument
 *   Contact       let's talk
 *
 * Only `ContactForm`, the language switcher and the mobile menu are Client
 * Components.
 */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  // Must be called in the page too, not just the layout — dropping it pushes
  // the route into dynamic rendering and loses the static benefit.
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <FeatureGrid />
      <HowItWorks />
      <TeamGrid />
      <Contact />
    </>
  );
}
