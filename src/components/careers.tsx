"use client";

import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/button";
import { Container, Section } from "@/components/section";
import {
  jobs,
  siteConfig,
  type Job,
  type JobDepartment,
  type JobLocation,
  type JobType,
} from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

const TYPES: JobType[] = ["fulltime", "intern", "contract"];
const DEPARTMENTS: JobDepartment[] = [
  "engineering",
  "ai",
  "product",
  "design",
  "operations",
];
const LOCATIONS: JobLocation[] = ["hanoi", "hcm", "remote"];

function toggleValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
  labelOf,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  labelOf: (value: string) => string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <ul className="mt-3 space-y-2">
        {options.map((opt) => {
          const checked = selected.includes(opt);
          return (
            <li key={opt}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(opt)}
                  className="size-4 rounded border-border accent-[var(--brand)]"
                />
                {labelOf(opt)}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const t = useTranslations("careers");
  const locale = useLocale() as Locale;
  const mailto = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
    `Apply: ${job.title.en}`,
  )}`;

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
      <div className="min-w-0">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <MapPin aria-hidden strokeWidth={1.75} className="size-3.5 shrink-0" />
          {t(`locations.${job.location}`)}
        </p>
        <h2 className="mt-2 text-balance text-base font-semibold tracking-tight sm:text-lg">
          {job.title[locale]}
        </h2>
      </div>
      <Button asChild size="sm" variant="brand" className="shrink-0 self-start sm:self-center">
        <a href={mailto}>{t("apply")}</a>
      </Button>
    </article>
  );
}

function TalentCommunity() {
  const t = useTranslations("careers");
  const [fileName, setFileName] = useState<string | null>(null);

  const mailto = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
    "CV — Talent community",
  )}&body=${encodeURIComponent(
    fileName
      ? `Attached / file name: ${fileName}`
      : "Please attach your CV (.pdf / .docx).",
  )}`;

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-sm font-semibold tracking-tight">{t("talentTitle")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {t("talentBody")}
      </p>

      <label className="mt-4 flex cursor-pointer flex-col gap-2">
        <span className="sr-only">{t("chooseFile")}</span>
        <span className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-secondary px-4 text-sm font-medium transition-colors hover:bg-accent">
          {t("chooseFile")}
        </span>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="sr-only"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
        <span className="truncate text-xs text-muted-foreground">
          {fileName ?? t("noFile")}
        </span>
      </label>

      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        {t("fileHint")}
      </p>

      {/* ponytail: no upload API — open mail client with CV filename hint */}
      <Button asChild size="sm" variant="brand" className="mt-4 w-full">
        <a href={mailto}>{t("submitCv")}</a>
      </Button>
    </div>
  );
}

// Layout inspired by career.vng.com.vn job search — ANZ filters + roles only.
export function Careers() {
  const t = useTranslations("careers");
  const [types, setTypes] = useState<JobType[]>([]);
  const [departments, setDepartments] = useState<JobDepartment[]>([]);
  const [locations, setLocations] = useState<JobLocation[]>([]);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      if (types.length && !types.includes(job.type)) return false;
      if (departments.length && !departments.includes(job.department))
        return false;
      if (locations.length && !locations.includes(job.location)) return false;
      return true;
    });
  }, [types, departments, locations]);

  const hasFilters =
    types.length > 0 || departments.length > 0 || locations.length > 0;

  return (
    <Section className="pt-10 sm:pt-14">
      <Container>
        <h1 className="text-balance text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("searchTitle")}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t("description")}
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <FilterGroup
              title={t("filters.type")}
              options={TYPES}
              selected={types}
              onToggle={(v) => setTypes((s) => toggleValue(s, v as JobType))}
              labelOf={(v) => t(`types.${v}`)}
            />
            <FilterGroup
              title={t("filters.department")}
              options={DEPARTMENTS}
              selected={departments}
              onToggle={(v) =>
                setDepartments((s) => toggleValue(s, v as JobDepartment))
              }
              labelOf={(v) => t(`departments.${v}`)}
            />
            <FilterGroup
              title={t("filters.location")}
              options={LOCATIONS}
              selected={locations}
              onToggle={(v) =>
                setLocations((s) => toggleValue(s, v as JobLocation))
              }
              labelOf={(v) => t(`locations.${v}`)}
            />

            {hasFilters ? (
              <button
                type="button"
                onClick={() => {
                  setTypes([]);
                  setDepartments([]);
                  setLocations([]);
                }}
                className="text-sm font-medium text-brand-ink underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
              >
                {t("clearFilters")}
              </button>
            ) : null}

            <div className="hidden lg:block">
              <TalentCommunity />
            </div>
          </aside>

          <div>
            <p
              className={cn(
                "mb-4 text-sm text-muted-foreground",
                filtered.length === 0 && "sr-only",
              )}
            >
              {t("resultCount", { count: filtered.length })}
            </p>

            {filtered.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
                <p className="text-sm text-muted-foreground">{t("empty")}</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {filtered.map((job) => (
                  <li key={job.id}>
                    <JobCard job={job} />
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-10 lg:hidden">
              <TalentCommunity />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
