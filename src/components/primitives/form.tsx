"use client";

import { useState } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { Button } from "@/components/primitives/button";
import { Field } from "@/components/primitives/field";
import { Input, Textarea } from "@/components/primitives/input";
import { cn } from "@/lib/utils";

export type FormResult = { ok: true } | { ok: false; errorKey: string };

export type FormFieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  required?: boolean;
  autoComplete?: string;
  rows?: number;
  /** Sit in the 2-column grid (ignored for full-width fields like textarea). */
  half?: boolean;
  placeholder?: string;
  srOnlyLabel?: boolean;
};

type FormProps<TSchema extends z.ZodType<FieldValues>> = {
  schema: TSchema;
  defaultValues: DefaultValues<z.infer<TSchema>>;
  fields: FormFieldConfig<z.infer<TSchema>>[];
  onSubmit: (values: z.infer<TSchema>) => Promise<FormResult>;
  translateError: (key: string) => string;
  submitLabel: string;
  submittingLabel: string;
  success: {
    title: string;
    body: string;
    /** Optional dismiss control (resets form to editable). */
    dismissLabel?: string;
  };
  onDismiss?: () => void;
  /** Intro / banners above fields. */
  header?: React.ReactNode;
  /** Slot between fields and submit (file picker, etc.). */
  beforeSubmit?: React.ReactNode;
  /** Extra error line (e.g. file validation) shown with server errors. */
  extraError?: string | null;
  className?: string;
  honeypotName?: Path<z.infer<TSchema>>;
  idPrefix?: string;
  formProps?: React.ComponentProps<"form"> & Record<string, string>;
};

export function Form<TSchema extends z.ZodType<FieldValues>>({
  schema,
  defaultValues,
  fields,
  onSubmit,
  translateError,
  submitLabel,
  submittingLabel,
  success,
  onDismiss,
  header,
  beforeSubmit,
  extraError,
  className,
  honeypotName = "website" as Path<z.infer<TSchema>>,
  idPrefix = "field",
  formProps,
}: FormProps<TSchema>) {
  type Values = z.infer<TSchema>;
  const [serverErrorKey, setServerErrorKey] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    // ponytail: zod v4 + RHF resolver typings are looser than Values
    resolver: zodResolver(schema as never),
    defaultValues,
  });

  async function submit(values: Values) {
    setServerErrorKey(null);
    const result = await onSubmit(values);
    if (result.ok) {
      setSubmitted(true);
      return;
    }
    setServerErrorKey(result.errorKey);
  }

  function dismiss() {
    setSubmitted(false);
    setServerErrorKey(null);
    reset(defaultValues);
    onDismiss?.();
  }

  if (submitted) {
    return (
      <div
        role="status"
        className={cn(
          "rounded-lg border border-border bg-card p-8 text-center",
          className,
        )}
      >
        <p className="font-semibold">{success.title}</p>
        <p className="mt-2 text-sm text-muted-foreground">{success.body}</p>
        {success.dismissLabel ? (
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={dismiss}
          >
            {success.dismissLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  const halfFields = fields.filter((f) => f.half && f.type !== "textarea");
  const fullFields = fields.filter((f) => !f.half || f.type === "textarea");

  return (
    <form
      {...formProps}
      onSubmit={handleSubmit(submit)}
      noValidate
      className={cn(
        "space-y-4 rounded-lg border border-border bg-card p-4 sm:space-y-5 sm:p-8",
        className,
        formProps?.className,
      )}
    >
      <div aria-hidden className="absolute left-[-9999px]">
        <label htmlFor={`${idPrefix}-honeypot`}>Website</label>
        <input
          id={`${idPrefix}-honeypot`}
          tabIndex={-1}
          autoComplete="off"
          {...register(honeypotName)}
        />
      </div>

      {header}

      {halfFields.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {halfFields.map((field) => (
            <FormControl
              key={String(field.name)}
              field={field}
              idPrefix={idPrefix}
              error={
                errors[field.name]?.message
                  ? translateError(String(errors[field.name]?.message))
                  : undefined
              }
              register={register}
            />
          ))}
        </div>
      ) : null}

      {fullFields.map((field) => (
        <FormControl
          key={String(field.name)}
          field={field}
          idPrefix={idPrefix}
          error={
            errors[field.name]?.message
              ? translateError(String(errors[field.name]?.message))
              : undefined
          }
          register={register}
        />
      ))}

      {beforeSubmit}

      {extraError || serverErrorKey ? (
        <p role="alert" className="text-sm text-destructive">
          {extraError ??
            (serverErrorKey ? translateError(serverErrorKey) : null)}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="brand"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </form>
  );
}

function FormControl<T extends FieldValues>({
  field,
  idPrefix,
  error,
  register,
}: {
  field: FormFieldConfig<T>;
  idPrefix: string;
  error?: string;
  register: ReturnType<typeof useForm<T>>["register"];
}) {
  const id = `${idPrefix}-${String(field.name)}`;
  const invalid = !!error;

  return (
    <Field
      label={field.label}
      htmlFor={id}
      error={error}
      required={field.required}
      srOnlyLabel={field.srOnlyLabel}
    >
      {field.type === "textarea" ? (
        <Textarea
          id={id}
          rows={field.rows ?? 5}
          placeholder={field.placeholder}
          aria-invalid={invalid}
          {...register(field.name)}
        />
      ) : (
        <Input
          id={id}
          type={field.type ?? "text"}
          autoComplete={field.autoComplete}
          placeholder={field.placeholder}
          aria-invalid={invalid}
          {...register(field.name)}
        />
      )}
    </Field>
  );
}
