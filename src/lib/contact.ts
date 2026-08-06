import { z } from "zod";

/**
 * Shared client + server schema. Messages are translation KEYS — the UI maps
 * them through `t()` so one schema works for both locales.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "nameRequired").max(100, "nameTooLong"),
  email: z.email("emailInvalid").trim().toLowerCase().max(200),
  company: z
    .string()
    .trim()
    .max(150, "companyTooLong")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+()\s.-]{8,20}$/, "phoneInvalid")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "messageTooShort")
    .max(2000, "messageTooLong"),
  /** Honeypot — bots fill it; the action returns fake success. */
  website: z.string().max(500).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactErrorKey =
  | "nameRequired"
  | "nameTooLong"
  | "emailInvalid"
  | "companyTooLong"
  | "phoneInvalid"
  | "messageTooShort"
  | "messageTooLong";

export type ContactResult =
  | { ok: true }
  | {
      ok: false;
      errorKey: string;
      fieldErrors?: Partial<Record<keyof ContactInput, ContactErrorKey[]>>;
    };
