"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/primitives/button";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

const EXIT_MS = 320;

export function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const mounted = open || leaving;

  const close = () => {
    if (!open && !leaving) return;
    setOpen(false);
    setLeaving(true);
    window.setTimeout(() => setLeaving(false), EXIT_MS);
  };

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // ponytail: close identity not in deps — only need lock while open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) close();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
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

      {mounted ? (
        <div
          id="mobile-nav-panel"
          className={cn(
            "absolute top-full right-0 z-40 mt-3 w-[50vw] origin-top-right rounded-lg border border-border bg-card px-4 py-2 shadow-[0_16px_44px_-16px_rgba(29,29,31,0.35)]",
            open && !leaving
              ? "animate-dropdown"
              : "translate-y-[-12px] opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          )}
        >
          <nav aria-label={t("mainLabel")}>
            <ul className="divide-y divide-border">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="block py-3 text-base font-medium transition-colors hover:text-brand-ink"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Button asChild variant="brand" className="mt-3 mb-2 w-full">
            <Link href="/#contact" onClick={close}>
              {t("contact")}
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
