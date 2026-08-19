import "server-only";

import { supabase } from "@/lib/supabase";
import type { Project, ProjectIndustry } from "@/lib/site";

const EXT = "png|jpe?g|gif|webp|svg|avif";

/** Filename → /blog/{slug}/file; http(s) and /path stay. */
export function resolveAsset(slug: string, src: string) {
  const s = src.trim().replace(/^\.\//, "");
  if (!s) return s;
  if (/^https?:\/\//i.test(s) || s.startsWith("/")) return s;
  return `/blog/${slug}/${s}`;
}

/**
 * Rewrite image refs when the post is read (drop-in "upload"):
 *   quiz.png              → ![](/blog/{slug}/quiz.png)
 *   ![alt](quiz.png)      → ![alt](/blog/{slug}/quiz.png)
 *   ![alt](https://...)   → keep URL
 *   ![1]                  → gallery[1] if listed
 */
export function canonicalizeMarkdown(
  slug: string,
  md: string,
  gallery: string[] = [],
) {
  let out = md.replace(
    new RegExp(String.raw`^(?:\.\/)?([^\s/]+\.(?:${EXT}))\s*$`, "gim"),
    (_, file: string) => `![](${file})`,
  );
  out = out.replace(/^(https?:\/\/\S+)\s*$/gim, (_, url: string) => `![](${url})`);
  out = out.replace(/^!\[(\d+)\]\s*$/gm, (m, n: string) => {
    const src = gallery[Number(n)];
    return src ? `![](${src})` : m;
  });
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt: string, src: string) => {
    return `![${alt}](${resolveAsset(slug, src)})`;
  });
  return out;
}

function firstMarkdownImage(md: string) {
  return md.match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1];
}

type PostRow = {
  slug: string;
  industry: ProjectIndustry | null;
  title_vi: string;
  title_en: string;
  excerpt_vi: string;
  excerpt_en: string;
  cover: string | null;
  date: string;
  body_vi: string;
  body_en: string;
};

function toProject(row: PostRow): Project {
  const viBody = canonicalizeMarkdown(row.slug, row.body_vi);
  const enBody = canonicalizeMarkdown(row.slug, row.body_en);

  return {
    id: row.slug,
    slug: row.slug,
    industry: row.industry ?? undefined,
    title: { vi: row.title_vi, en: row.title_en },
    excerpt: { vi: row.excerpt_vi, en: row.excerpt_en },
    date: row.date,
    cover: row.cover ?? firstMarkdownImage(viBody || enBody),
    body: { vi: viBody, en: enBody },
  };
}

const SELECT = "slug, industry, title_vi, title_en, excerpt_vi, excerpt_en, cover, date, body_vi, body_en";

export async function listPosts(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(SELECT)
    .order("date", { ascending: false });

  if (error) {
    console.error("[posts] failed to list:", error.message);
    return [];
  }

  return (data as PostRow[]).map(toProject);
}

export async function getPost(slug: string): Promise<Project | undefined> {
  const { data, error } = await supabase
    .from("posts")
    .select(SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[posts] failed to get:", error.message);
    return undefined;
  }

  return toProject(data as PostRow);
}
