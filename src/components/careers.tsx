"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { MarkdownBody } from "@/components/markdown-body";
import { Container, Section } from "@/components/section";
import { submitApplicationAction } from "@/lib/application-action";
import {
  applicationFormSchema,
  type ApplicationFormFields,
} from "@/lib/application";
import type { Job, JobDepartment, JobLocation, JobType } from "@/lib/site";
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

function locationLabel(t: ReturnType<typeof useTranslations<"careers">>, loc: JobLocation) {
  return loc === "hanoi" ? t("locations.hanoiOnsite") : t(`locations.${loc}`);
}

function JobCard({ job, onApply }: { job: Job; onApply: (job: Job) => void }) {
  const t = useTranslations("careers");
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);

  return (
    <article className="rounded-lg border border-border bg-card">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="min-w-0 flex-1 text-left"
        >
          <p className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            <MapPin aria-hidden strokeWidth={1.75} className="size-3.5 shrink-0" />
            {job.locations.map((loc) => locationLabel(t, loc)).join(" · ")}
          </p>
          <h2 className="mt-2 flex items-center gap-2 text-balance text-base font-semibold tracking-tight sm:text-lg">
            {job.title}
            <ChevronDown
              aria-hidden
              strokeWidth={1.75}
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
            />
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {t(`levels.${job.level}`)}
            {" · "}
            {t("slots", { count: job.slots })}
          </p>
        </button>
        <Button
          type="button"
          size="sm"
          variant="brand"
          className="shrink-0 self-start sm:self-center"
          onClick={(e) => {
            e.stopPropagation();
            onApply(job);
          }}
        >
          {t("apply")}
        </Button>
      </div>
      {open ? (
        <div className="border-t border-border px-5 pb-5 sm:px-6 sm:pb-6 [&_h2]:mt-6 [&_h2]:text-base">
          <MarkdownBody markdown={job.jd[locale]} />
        </div>
      ) : null}
    </article>
  );
}

function TalentCommunity({
  applyingFor,
  onClearApplyingFor,
}: {
  applyingFor: Job | null;
  onClearApplyingFor: () => void;
}) {
  const t = useTranslations("careers");
  const tForm = useTranslations("form");
  const [file, setFile] = useState<File | null>(null);
  const [fileErrorKey, setFileErrorKey] = useState<string | null>(null);
  const [serverErrorKey, setServerErrorKey] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormFields>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  function errorText(key?: string) {
    return key ? tForm(`errors.${key}`) : undefined;
  }

  async function onSubmit(values: ApplicationFormFields) {
    setServerErrorKey(null);
    setFileErrorKey(null);

    if (!file) {
      setFileErrorKey("fileRequired");
      return;
    }

    const roleName = applyingFor ? `Apply: ${applyingFor.title}` : t("generalApplication");
    const result = await submitApplicationAction(
      { ...values, jobId: applyingFor?.id, roleName },
      file,
    );

    if (result.ok) {
      setSubmitted(true);
      return;
    }

    if (result.errorKey === "fileRequired" || result.errorKey === "fileTooLarge" || result.errorKey === "fileTypeInvalid") {
      setFileErrorKey(result.errorKey);
      return;
    }
    setServerErrorKey(result.errorKey);
  }

  if (submitted) {
    return (
      <div
        data-talent-form
        role="status"
        className="rounded-lg border border-border bg-card p-5 text-center"
      >
        <p className="font-semibold">{t("cvSuccessTitle")}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t("cvSuccessBody")}</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-4"
          onClick={() => {
            setSubmitted(false);
            setFile(null);
            reset();
            onClearApplyingFor();
          }}
        >
          {t("clearSelection")}
        </Button>
      </div>
    );
  }

  return (
    <form
      data-talent-form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-lg border border-border bg-card p-5"
    >
      {/* honeypot */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label htmlFor="app-website">Website</label>
        <input id="app-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <h2 className="text-sm font-semibold tracking-tight">{t("talentTitle")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {t("talentBody")}
      </p>

      {applyingFor ? (
        <div className="mt-3 space-y-1 rounded-sm bg-accent px-3 py-2 text-xs">
          <p className="font-medium">{t("applyingFor", { title: applyingFor.title })}</p>
          <button
            type="button"
            onClick={onClearApplyingFor}
            className="font-medium text-brand-ink underline decoration-transparent underline-offset-2 hover:decoration-current"
          >
            {t("clearSelection")}
          </button>
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        <div>
          <label htmlFor="app-name" className="sr-only">
            {tForm("name")}
          </label>
          <Input
            id="app-name"
            placeholder={tForm("name")}
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-destructive">{errorText(errors.name.message)}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="app-email" className="sr-only">
            {tForm("email")}
          </label>
          <Input
            id="app-email"
            type="email"
            placeholder={tForm("email")}
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-destructive">{errorText(errors.email.message)}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="app-phone" className="sr-only">
            {tForm("phone")}
          </label>
          <Input
            id="app-phone"
            type="tel"
            placeholder={tForm("phone")}
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          {errors.phone ? (
            <p className="mt-1 text-xs text-destructive">{errorText(errors.phone.message)}</p>
          ) : null}
        </div>
      </div>

      <label className="mt-4 flex cursor-pointer flex-col gap-2">
        <span className="sr-only">{t("chooseFile")}</span>
        <span className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-secondary px-4 text-sm font-medium transition-colors hover:bg-accent">
          {t("chooseFile")}
        </span>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="sr-only"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setFileErrorKey(null);
          }}
        />
        <span className="truncate text-xs text-muted-foreground">
          {file?.name ?? t("noFile")}
        </span>
      </label>

      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        {t("fileHint")}
      </p>
      {fileErrorKey ? (
        <p className="mt-1 text-xs text-destructive">{t(fileErrorKey)}</p>
      ) : null}

      {serverErrorKey ? (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {tForm(serverErrorKey)}
        </p>
      ) : null}

      <Button
        type="submit"
        size="sm"
        variant="brand"
        disabled={isSubmitting}
        className="mt-4 w-full"
      >
        {isSubmitting ? tForm("submitting") : t("submitCv")}
      </Button>
    </form>
  );
}

// Layout inspired by career.vng.com.vn job search — ANZ filters + roles only.
export function Careers({ jobs }: { jobs: Job[] }) {
  const t = useTranslations("careers");
  const [types, setTypes] = useState<JobType[]>([]);
  const [departments, setDepartments] = useState<JobDepartment[]>([]);
  const [locations, setLocations] = useState<JobLocation[]>([]);
  const [applyingFor, setApplyingFor] = useState<Job | null>(null);
  const formsRef = useRef<HTMLDivElement[]>([]);

  function scrollToForm(job: Job) {
    setApplyingFor(job);
    const visible = formsRef.current.find((el) => el.offsetParent !== null);
    visible?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function registerFormEl(el: HTMLDivElement | null) {
    if (el && !formsRef.current.includes(el)) formsRef.current.push(el);
  }

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      if (types.length && !types.includes(job.type)) return false;
      if (departments.length && !departments.includes(job.department))
        return false;
      if (locations.length && !job.locations.some((l) => locations.includes(l)))
        return false;
      return true;
    });
  }, [jobs, types, departments, locations]);

  const hasFilters =
    types.length > 0 || departments.length > 0 || locations.length > 0;

  return (
    <Section className="pt-6 sm:pt-8">
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

            <div ref={registerFormEl} className="hidden lg:block">
              <TalentCommunity
                applyingFor={applyingFor}
                onClearApplyingFor={() => setApplyingFor(null)}
              />
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
                    <JobCard job={job} onApply={scrollToForm} />
                  </li>
                ))}
              </ul>
            )}

            <div ref={registerFormEl} className="mt-10 lg:hidden">
              <TalentCommunity
                applyingFor={applyingFor}
                onClearApplyingFor={() => setApplyingFor(null)}
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
