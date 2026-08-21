"use server";

import { flattenError } from "zod";

import { siteConfig } from "@/lib/site";
import { sendEmail } from "@/lib/email";
import { supabaseAdmin } from "@/lib/supabase";
import {
  ALLOWED_CV_TYPES,
  MAX_CV_BYTES,
  applicationSchema,
  type ApplicationFields,
  type ApplicationResult,
} from "@/lib/application";

export async function submitApplicationAction(
  fields: ApplicationFields,
  file: File,
): Promise<ApplicationResult> {
  if (fields.website) {
    return { ok: true };
  }

  const parsed = applicationSchema.safeParse(fields);
  if (!parsed.success) {
    return {
      ok: false,
      errorKey: "serverError",
      fieldErrors: flattenError(parsed.error).fieldErrors as Partial<
        Record<keyof ApplicationFields, never>
      >,
    };
  }

  if (!file || file.size === 0) {
    return { ok: false, errorKey: "fileRequired" };
  }
  if (file.size > MAX_CV_BYTES) {
    return { ok: false, errorKey: "fileTooLarge" };
  }
  if (!ALLOWED_CV_TYPES.includes(file.type)) {
    return { ok: false, errorKey: "fileTypeInvalid" };
  }

  const { name, email, phone, jobId, roleName } = parsed.data;

  try {
    const admin = supabaseAdmin();
    const cvPath = `${jobId ?? "general"}/${crypto.randomUUID()}/${file.name}`;

    const { error: uploadError } = await admin.storage
      .from("career-cvs")
      .upload(cvPath, file, { contentType: file.type });
    if (uploadError) throw uploadError;

    const { error: dbError } = await admin.from("applications").insert({
      job_id: jobId ?? null,
      role_name: roleName,
      candidate_name: name,
      candidate_email: email,
      candidate_phone: phone || null,
      cv_path: cvPath,
    });
    if (dbError) throw dbError;

    const to = process.env.CONTACT_NOTIFY_EMAIL ?? siteConfig.contact.email;
    await sendEmail({
      to,
      replyTo: email,
      subject: `[CV] ${roleName} - ${name}`,
      text: [
        `Position: ${roleName}`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "-"}`,
      ].join("\n"),
      attachments: [
        {
          filename: file.name,
          content: Buffer.from(await file.arrayBuffer()),
          contentType: file.type,
        },
      ],
    });

    return { ok: true };
  } catch (err) {
    console.error("[application] failed to submit:", err);
    return { ok: false, errorKey: "serverError" };
  }
}
