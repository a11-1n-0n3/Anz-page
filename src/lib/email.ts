import "server-only";

import { siteConfig } from "@/lib/site";

export async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info("[email] no RESEND_API_KEY, logging instead of sending:", input);
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
      to: [input.to],
      reply_to: input.replyTo,
      subject: input.subject,
      text: input.text,
    }),
  });

  if (!res.ok) {
    console.error("[email] failed to send:", res.status, await res.text());
    throw new Error("EMAIL_SEND_FAILED");
  }
}
