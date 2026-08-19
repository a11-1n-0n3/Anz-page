import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

import { siteConfig } from "@/lib/site";

let transporter: Transporter | undefined;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: Number(process.env.SMTP_PORT ?? 465) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
}): Promise<void> {
  const user = process.env.SMTP_USER;

  if (!user || !process.env.SMTP_PASS) {
    console.info("[email] no SMTP_USER/SMTP_PASS, logging instead of sending:", {
      to: input.to,
      subject: input.subject,
      attachments: input.attachments?.map((a) => a.filename),
    });
    return;
  }

  await getTransporter().sendMail({
    from: `${siteConfig.name} <${user}>`,
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.text,
    attachments: input.attachments,
  });
}
