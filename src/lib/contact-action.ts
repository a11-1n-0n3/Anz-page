"use server";

import { flattenError } from "zod";

import { siteConfig } from "@/lib/site";
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
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_EMAIL ?? siteConfig.contact.email;

  if (!apiKey) {
    console.info("[contact] no RESEND_API_KEY, logging instead of sending:", {
      to,
      ...input,
    });
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${siteConfig.name} <onboarding@resend.dev>`,
      to: [to],
      reply_to: input.email,
      subject: `[Contact] ${input.name}${input.company ? ` — ${input.company}` : ""}`,
      text: [
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Company: ${input.company || "—"}`,
        `Phone: ${input.phone || "—"}`,
        "",
        input.message,
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    console.error("[contact] failed to send email:", res.status, await res.text());
    throw new Error("EMAIL_SEND_FAILED");
  }
}
