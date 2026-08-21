import "server-only";

import { mediaUrl } from "@/lib/media";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Project, ProjectDomain } from "@/lib/site";

const EXT = "png|jpe?g|gif|webp|svg|avif";

/** Filename → storage URL; http(s) stays; legacy `/blog/<…>/x.png` keeps only the filename. */
export function resolveAsset(id: number, src: string) {
  const s = src.trim().replace(/^\.\//, "");
  if (!s) return s;
  if (/^https?:\/\//i.test(s)) return s;
  const legacy = /^\/blog\/[^/]+\/(.+)$/.exec(s);
  if (legacy) return mediaUrl(`${id}/${legacy[1]}`);
  if (s.startsWith("/")) return s;
  return mediaUrl(`${id}/${s}`);
}

/**
 * Rewrite image refs when the post is read:
 *   quiz.png              → ![](<storage>/blog-media/{id}/quiz.png)
 *   ![alt](quiz.png)      → ![alt](<storage>/blog-media/{id}/quiz.png)
 *   ![alt](https://...)   → keep URL
 *   ![1]                  → gallery[1] if listed
 */
export function canonicalizeMarkdown(
  id: number,
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
    return `![${alt}](${resolveAsset(id, src)})`;
  });
  return out;
}

function firstMarkdownImage(md: string) {
  return md.match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1];
}

// `posts` is keyed by `id` in Supabase; `slug` is the stable URL slug and
// `domain` replaced the old `industry` column.
type PostRow = {
  id: number;
  slug: string;
  domain: ProjectDomain | null;
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
  const viBody = canonicalizeMarkdown(row.id, row.body_vi);
  const enBody = canonicalizeMarkdown(row.id, row.body_en);
  const cover = row.cover?.trim() ? resolveAsset(row.id, row.cover) : undefined;

  return {
    id: row.id,
    slug: row.slug,
    domain: row.domain ?? undefined,
    title: { vi: row.title_vi, en: row.title_en },
    excerpt: { vi: row.excerpt_vi, en: row.excerpt_en },
    date: row.date,
    cover: cover || firstMarkdownImage(viBody || enBody),
    body: { vi: viBody, en: enBody },
  };
}

const SELECT =
  "id, slug, domain, title_vi, title_en, excerpt_vi, excerpt_en, cover, date, body_vi, body_en";

export async function listPosts(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase()
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
  if (!isSupabaseConfigured()) return undefined;

  const { data, error } = await supabase()
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

/** Stray `/blog/<id>` links resolve here so they can 308 to the slug URL. */
export async function getPostSlugById(id: number): Promise<string | undefined> {
  if (!isSupabaseConfigured()) return undefined;

  const { data, error } = await supabase()
    .from("posts")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return undefined;
  return (data as { slug: string }).slug;
}
