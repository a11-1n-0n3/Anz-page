"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/button";
import { Input, Textarea } from "@/components/input";
import { createContactAction } from "@/lib/contact-action";
import {
  contactSchema,
  type ContactInput,
} from "@/lib/contact";

export function ContactForm() {
  const t = useTranslations("form");
  const [serverErrorKey, setServerErrorKey] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", company: "", phone: "", message: "" },
  });

  function errorText(key?: string) {
    return key ? t(`errors.${key}`) : undefined;
  }

  async function onSubmit(values: ContactInput) {
    setServerErrorKey(null);
    const result = await createContactAction(values);

    if (result.ok) {
      setSubmitted(true);
      return;
    }

    setServerErrorKey(result.errorKey);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-lg border border-border bg-card p-8 text-center"
      >
        <p className="font-semibold">{t("successTitle")}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4 rounded-lg border border-border bg-card p-4 sm:space-y-5 sm:p-8"
    >
      {/* honeypot */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t("name")}
          error={errorText(errors.name?.message)}
          htmlFor="name"
          required
        >
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </Field>

        <Field
          label={t("email")}
          error={errorText(errors.email?.message)}
          htmlFor="email"
          required
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </Field>

        <Field
          label={t("company")}
          error={errorText(errors.company?.message)}
          htmlFor="company"
        >
          <Input
            id="company"
            autoComplete="organization"
            aria-invalid={!!errors.company}
            {...register("company")}
          />
        </Field>

        <Field
          label={t("phone")}
          error={errorText(errors.phone?.message)}
          htmlFor="phone"
        >
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </Field>
      </div>

      <Field
        label={t("message")}
        error={errorText(errors.message?.message)}
        htmlFor="message"
        required
      >
        <Textarea
          id="message"
          rows={5}
          aria-invalid={!!errors.message}
          {...register("message")}
        />
      </Field>

      {serverErrorKey ? (
        <p role="alert" className="text-sm text-destructive">
          {t(serverErrorKey)}
        </p>
      ) : null}

      <Button type="submit" size="lg" variant="brand" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
