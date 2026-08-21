import "server-only";

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Job } from "@/lib/site";

// `jobs` is keyed by `id` in Supabase — there is no slug column.
type JobRow = {
  id: number;
  title: string;
  type: Job["type"];
  department: Job["department"];
  locations: Job["locations"];
  level: Job["level"];
  slots: number;
  jd_vi: string;
  jd_en: string;
};

function toJob(row: JobRow): Job {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    department: row.department,
    locations: row.locations,
    level: row.level,
    slots: row.slots,
    jd: { vi: row.jd_vi, en: row.jd_en },
  };
}

export async function listJobs(): Promise<Job[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase()
    .from("jobs")
    .select("id, title, type, department, locations, level, slots, jd_vi, jd_en")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[jobs] failed to list:", error.message);
    return [];
  }

  return (data as JobRow[]).map(toJob);
}
