"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/button";
import { mainNav } from "@/lib/site";
import { Link } from "@/i18n/navigation";

/**
 * Navigation for phones.
 *
 * Before this existed the header hid `nav` below `md` and hid the CTA below
 * `sm`, so a phone visitor had no way to reach any section or the contact
 * form except by scrolling the whole page.
 *
 * Client Component because the panel has to close on navigation — with the
 * links being same-page anchors, a JS-free `<details>` would stay open over
 * the content the visitor just jumped to.
 */
export function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  // Escape closes, and the page must not scroll behind the open panel.
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

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={t("mainLabel")}
        className="flex size-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
          className="fixed inset-x-4 top-[4.75rem] z-40 rounded-2xl border border-border bg-card px-5 pb-6 pt-2 shadow-[0_16px_44px_-16px_rgba(29,29,31,0.35)]"
        >
          <nav aria-label={t("mainLabel")}>
            <ul className="divide-y divide-border">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-4 text-base font-medium transition-colors hover:text-gold-ink"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Button asChild size="lg" className="mt-6 w-full">
            <Link href="/#contact" onClick={() => setOpen(false)}>
              {t("contact")}
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
