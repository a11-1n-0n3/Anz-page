import "server-only";

import fs from "node:fs";
import path from "node:path";

import type {
  Job,
  JobDepartment,
  JobLevel,
  JobLocation,
  JobType,
} from "@/lib/site";

const JOBS_DIR = path.join(process.cwd(), "public/careers");

const TYPES = new Set<JobType>(["fulltime", "intern", "contract"]);
const DEPARTMENTS = new Set<JobDepartment>([
  "engineering",
  "ai",
  "product",
  "design",
  "operations",
]);
const LOCATIONS = new Set<JobLocation>(["hanoi", "hcm", "remote"]);
const LEVELS = new Set<JobLevel>(["fresher"]);

function splitFrontmatter(raw: string) {
  if (!raw.startsWith("---")) return { data: {} as Record<string, string>, markdown: raw };
  const end = raw.indexOf("\n---", 3);
  if (end < 0) return { data: {} as Record<string, string>, markdown: raw };
  const block = raw.slice(4, end);
  const markdown = raw.slice(end + 4).replace(/^\s*\n/, "");
  const data: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const i = line.indexOf(":");
    if (i < 0) continue;
    data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, markdown };
}

function heading(md: string) {
  return md.match(/^#\s+(.+)$/m)?.[1]?.trim();
}

function stripTitle(md: string) {
  return md.replace(/^#\s+.+$/m, "").trim();
}

function parseLocations(raw: string | undefined): JobLocation[] {
  const list = (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is JobLocation => LOCATIONS.has(s as JobLocation));
  return list.length ? list : ["hanoi"];
}

export function parseJob(slug: string, raw: string): Job {
  const { data, markdown } = splitFrontmatter(raw);
  const [viSrc, enSrc] = markdown.split(/^\s*<!--\s*en\s*-->\s*$/m);
  const vi = viSrc.trim();
  const en = (enSrc ?? viSrc).trim();
  const slots = Number.parseInt(data.slots ?? "1", 10);

  const type = TYPES.has(data.type as JobType) ? (data.type as JobType) : "fulltime";
  const department = DEPARTMENTS.has(data.department as JobDepartment)
    ? (data.department as JobDepartment)
    : "engineering";
  const level = LEVELS.has(data.level as JobLevel) ? (data.level as JobLevel) : "fresher";

  return {
    id: slug,
    type,
    department,
    locations: parseLocations(data.locations),
    level,
    slots: Number.isFinite(slots) && slots > 0 ? slots : 1,
    title: data.title || heading(vi) || heading(en) || slug,
    jd: {
      vi: stripTitle(vi),
      en: stripTitle(en),
    },
  };
}

export function listJobs(): Job[] {
  if (!fs.existsSync(JOBS_DIR)) return [];
  return fs
    .readdirSync(JOBS_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const slug = name.slice(0, -3);
      const raw = fs.readFileSync(path.join(JOBS_DIR, name), "utf8");
      return parseJob(slug, raw);
    });
}

{
  const sample = parseJob(
    "ai-engineer",
    [
      "---",
      "type: fulltime",
      "department: ai",
      "locations: hanoi, remote",
      "level: fresher",
      "slots: 2",
      "title: AI Engineer",
      "---",
      "",
      "Việc VI",
      "",
      "<!-- en -->",
      "",
      "Work EN",
    ].join("\n"),
  );
  if (
    sample.slots !== 2 ||
    sample.locations.join(",") !== "hanoi,remote" ||
    sample.jd.en !== "Work EN" ||
    sample.title !== "AI Engineer" ||
    sample.department !== "ai"
  ) {
    throw new Error("parseJob self-check failed");
  }
}
