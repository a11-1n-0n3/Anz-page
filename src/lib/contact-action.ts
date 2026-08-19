"use server";

import { flattenError } from "zod";

import { siteConfig } from "@/lib/site";
import { sendEmail } from "@/lib/email";
import {
  contactSchema,
  type ContactErrorKey,
  type ContactInput,
  type ContactResult,
} from "@/lib/contact";

export async function createContactAction(
  input: ContactInput,
): Promise<ContactResult> {
  if (input?.website) {
    return { ok: true };
  }

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errorKey: "serverError",
      fieldErrors: flattenError(parsed.error).fieldErrors as Partial<
        Record<keyof ContactInput, ContactErrorKey[]>
      >,
    };
  }

  try {
    await sendContactEmail(parsed.data);
    return { ok: true };
  } catch {
    return { ok: false, errorKey: "serverError" };
  }
}

async function sendContactEmail(input: ContactInput): Promise<void> {
  const to = process.env.CONTACT_NOTIFY_EMAIL ?? siteConfig.contact.email;

  await sendEmail({
    to,
    replyTo: input.email,
    subject: `[Contact] ${input.name}${input.company ? ` — ${input.company}` : ""}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Company: ${input.company || "—"}`,
      `Phone: ${input.phone || "—"}`,
      "",
      input.message,
    ].join("\n"),
  });
}
