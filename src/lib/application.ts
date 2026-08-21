import { z } from "zod";

export const MAX_CV_BYTES = 3 * 1024 * 1024;
export const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Error messages are translation keys — UI maps them through t()
export const applicationSchema = z.object({
  name: z.string().trim().min(2, "nameRequired").max(100, "nameTooLong"),
  email: z.email("emailInvalid").trim().toLowerCase().max(200),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+()\s.-]{8,20}$/, "phoneInvalid")
    .optional()
    .or(z.literal("")),
  jobId: z.coerce.number().int().positive().optional(),
  roleName: z.string().trim().min(1).max(200),
  website: z.string().max(500).optional(), // honeypot
});

export type ApplicationFields = z.infer<typeof applicationSchema>;

// What the on-page form collects — jobId/roleName are derived, not typed in.
export const applicationFormSchema = applicationSchema.omit({
  jobId: true,
  roleName: true,
});

export type ApplicationFormFields = z.infer<typeof applicationFormSchema>;

export type ApplicationErrorKey =
  | "nameRequired"
  | "nameTooLong"
  | "emailInvalid"
  | "phoneInvalid"
  | "fileRequired"
  | "fileTooLarge"
  | "fileTypeInvalid";

export type ApplicationResult =
  | { ok: true }
  | {
      ok: false;
      errorKey: string;
      fieldErrors?: Partial<Record<keyof ApplicationFields, ApplicationErrorKey[]>>;
    };
