import "server-only";

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY!;

/** Read-only client for public data (jobs, posts). RLS only exposes published rows. */
export const supabase = createClient(url, publishableKey, {
  auth: { persistSession: false },
});

/** Privileged client for the CV application flow. Bypasses RLS — server-only, never expose to the client. */
export function supabaseAdmin() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) throw new Error("SUPABASE_SECRET_KEY is not set");
  return createClient(url, secretKey, { auth: { persistSession: false } });
}
