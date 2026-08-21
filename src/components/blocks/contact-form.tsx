"use client";

import { useTranslations } from "next-intl";

import { Form } from "@/components/primitives/form";
import { createContactAction } from "@/lib/contact-action";
import { contactSchema } from "@/lib/contact";

/** Contact page wiring — schema/action/copy. UI shell is `primitives/Form`. */
export function ContactForm() {
  const t = useTranslations("form");

  return (
    <Form
      schema={contactSchema}
      defaultValues={{
        name: "",
        email: "",
        company: "",
        phone: "",
        message: "",
        website: "",
      }}
      fields={[
        {
          name: "name",
          label: t("name"),
          required: true,
          autoComplete: "name",
          half: true,
        },
        {
          name: "email",
          label: t("email"),
          type: "email",
          required: true,
          autoComplete: "email",
          half: true,
        },
        {
          name: "company",
          label: t("company"),
          autoComplete: "organization",
          half: true,
        },
        {
          name: "phone",
          label: t("phone"),
          type: "tel",
          autoComplete: "tel",
          half: true,
        },
        {
          name: "message",
          label: t("message"),
          type: "textarea",
          required: true,
          rows: 5,
        },
      ]}
      onSubmit={createContactAction}
      translateError={(key) =>
        key === "serverError" ? t("serverError") : t(`errors.${key}`)
      }
      submitLabel={t("submit")}
      submittingLabel={t("submitting")}
      success={{ title: t("successTitle"), body: t("successBody") }}
      idPrefix="contact"
    />
  );
}
