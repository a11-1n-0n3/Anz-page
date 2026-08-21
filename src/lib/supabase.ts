import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

/** True when public Supabase env is present (empty .env is fine for local UI). */
export function isSupabaseConfigured() {
  return Boolean(
    process.env.SUPABASE_URL?.trim() &&
      process.env.SUPABASE_PUBLISHABLE_KEY?.trim(),
  );
}

/**
 * Read-only client for public data (jobs, posts). RLS only exposes published
 * rows. Lazy — these env vars only exist at container runtime, not at
 * `next build` time, and this must not throw while Next collects page data.
 */
export function supabase(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are not set — copy .env.example to .env",
    );
  }
  if (!client) {
    client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false } },
    );
  }
  return client;
}

/** Privileged client for the CV application flow. Bypasses RLS — server-only, never expose to the client. */
export function supabaseAdmin(): SupabaseClient {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) throw new Error("SUPABASE_SECRET_KEY is not set");
  return createClient(process.env.SUPABASE_URL!, secretKey, {
    auth: { persistSession: false },
  });
}
