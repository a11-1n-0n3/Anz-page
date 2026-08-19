"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/button";
import { mainNav } from "@/lib/site";
import { Link } from "@/i18n/navigation";

export function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const close = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={t("mainLabel")}
        className="flex size-11 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {open ? (
          <X aria-hidden strokeWidth={1.75} className="size-4.5" />
        ) : (
          <Menu aria-hidden strokeWidth={1.75} className="size-4.5" />
        )}
      </button>

      {open ? (
        <div
          id="mobile-nav-panel"
          className="absolute top-full right-0 z-40 mt-3 w-[50vw] rounded-lg border border-border bg-card px-4 py-2 shadow-[0_16px_44px_-16px_rgba(29,29,31,0.35)]"
        >
          <nav aria-label={t("mainLabel")}>
            <ul className="divide-y divide-border">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-base font-medium transition-colors hover:text-brand-ink"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Button asChild size="lg" variant="brand" className="mt-3 mb-2 w-full">
            <Link href="/#contact" onClick={() => setOpen(false)}>
              {t("contact")}
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
