"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Section, SectionHeading } from "@/components/section";
import { industries } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

const GAP_PX = 24; // gap-6
const STEP_MS = 2000;
const SLIDE_MS = 500;

/**
 * One card step left every 2s. Hover pauses.
 * Track is doubled; when we finish the first set we snap back without a flash.
 */
export function Industries() {
  const t = useTranslations("industries");
  const locale = useLocale() as Locale;
  const n = industries.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [instant, setInstant] = useState(false);
  const [cardPx, setCardPx] = useState(288);

  useEffect(() => {
    const sync = () =>
      setCardPx(window.matchMedia("(min-width: 640px)").matches ? 320 : 288);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    if (n === 0 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setIndex((i) => i + 1);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [paused, n]);

  // After sliding onto the duplicate set, snap to the matching card in set 1.
  useEffect(() => {
    if (index < n) return;
    const t = window.setTimeout(() => {
      setInstant(true);
      setIndex(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setInstant(false));
      });
    }, SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [index, n]);

  if (n === 0) return null;

  const step = cardPx + GAP_PX;
  const loop = [...industries, ...industries];

  return (
    <Section className="overflow-hidden">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          className="mx-auto"
          title={t("title")}
          description={t("description")}
        />
      </div>

      <div
        className="relative mt-14"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24"
        />

        <ul
          className={cn(
            "flex gap-6 pl-5 sm:pl-8 ease-out motion-reduce:transition-none",
            instant ? "transition-none" : "transition-transform duration-500",
          )}
          style={{ transform: `translateX(-${index * step}px)` }}
        >
          {loop.map((item, i) => (
            <li key={`${item.id}-${i}`} className="w-72 shrink-0 sm:w-80">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt=""
                  width={640}
                  height={800}
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
              <p className="mt-3 text-center text-[12px] font-semibold tracking-[0.14em] text-brand-ink uppercase">
                {item.name[locale]}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
