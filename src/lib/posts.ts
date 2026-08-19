import "server-only";

import fs from "node:fs";
import path from "node:path";

import {
  projectIndustries,
  type Project,
  type ProjectIndustry,
} from "@/lib/site";

const BLOG_DIR = path.join(process.cwd(), "public/blog");

const INDUSTRY = new Set<string>(projectIndustries);
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

function inferCover(slug: string, body: string) {
  const dir = path.join(BLOG_DIR, slug);
  for (const name of ["thumnail.png", "thumbnail.png"]) {
    if (fs.existsSync(path.join(dir, name))) return `/blog/${slug}/${name}`;
  }
  return firstMarkdownImage(body);
}

function heading(md: string) {
  const m = md.match(/^#\s+(.+)$/m);
  return m?.[1]?.trim();
}

function metaDescription(md: string) {
  const m = md.match(/\*\*Meta description:\*\*\s*([\s\S]*?)(?:\n\n|$)/);
  return m?.[1]?.replace(/\s+/g, " ").trim();
}

function stripTitleMeta(md: string) {
  return md
    .replace(/^#\s+.+$/m, "")
    .replace(/\*\*Meta description:\*\*\s*[\s\S]*?(?:\n\n|$)/, "")
    // ponytail: keep ## TL;DR in the .md for later; hide from article UI
    .replace(/^## TL;DR\s*\n(?:[-*].+\n|\n)*/im, "")
    .trim();
}

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

/** Parse one blog markdown file. `<!-- en -->` splits vi / en bodies. */
export function parsePost(slug: string, raw: string, fallbackDate: string): Project {
  const { data, markdown } = splitFrontmatter(raw);
  const [viSrc, enSrc] = markdown.split(/^\s*<!--\s*en\s*-->\s*$/m);
  const vi = viSrc.trim();
  const en = (enSrc ?? viSrc).trim();

  const viBody = canonicalizeMarkdown(slug, stripTitleMeta(vi));
  const enBody = canonicalizeMarkdown(slug, stripTitleMeta(en));

  return {
    id: slug,
    slug,
    industry: INDUSTRY.has(data.industry)
      ? (data.industry as ProjectIndustry)
      : undefined,
    title: {
      vi: data.titleVi || heading(vi) || slug,
      en: data.titleEn || heading(en) || slug,
    },
    excerpt: {
      vi: data.descriptionVi || metaDescription(vi) || "",
      en: data.descriptionEn || metaDescription(en) || "",
    },
    date: data.date || fallbackDate,
    cover: inferCover(slug, viBody || enBody),
    body: {
      vi: viBody,
      en: enBody,
    },
  };
}

function filePosts(): Project[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const slug = name.slice(0, -3);
      const file = path.join(BLOG_DIR, name);
      const raw = fs.readFileSync(file, "utf8");
      const mtime = fs.statSync(file).mtime.toISOString().slice(0, 10);
      return parsePost(slug, raw, mtime);
    });
}

export function listPosts(): Project[] {
  return filePosts();
}

export function getPost(slug: string) {
  return listPosts().find((p) => p.slug === slug);
}

{
  const sample = parsePost(
    "nova-learn",
    [
      "---",
      "date: 2026-08-01",
      "industry: education",
      "titleVi: Tiêu đề VI",
      "titleEn: Title EN",
      "descriptionVi: mô tả vi",
      "descriptionEn: excerpt en",
      "---",
      "",
      "Đoạn tiếng Việt.",
      "",
      "## Mục",
      "",
      "<!-- en -->",
      "",
      "English paragraph.",
    ].join("\n"),
    "1970-01-01",
  );
  if (
    sample.title.vi !== "Tiêu đề VI" ||
    sample.body.en !== "English paragraph." ||
    sample.industry !== "education" ||
    sample.date !== "2026-08-01"
  ) {
    throw new Error("parsePost self-check failed");
  }

  const tldrGone = parsePost(
    "x",
    ["## TL;DR", "", "- hidden bullet", "", "Visible."].join("\n"),
    "1970-01-01",
  );
  if (tldrGone.body.en !== "Visible.") {
    throw new Error("TL;DR should stay in the file but not in rendered body");
  }

  const imgs = canonicalizeMarkdown(
    "nova-learn",
    ["quiz.png", "![alt](grading.png)", "![x](https://cdn.example/a.png)"].join("\n"),
  );
  if (
    imgs !==
    [
      "![](/blog/nova-learn/quiz.png)",
      "![alt](/blog/nova-learn/grading.png)",
      "![x](https://cdn.example/a.png)",
    ].join("\n")
  ) {
    throw new Error("canonicalizeMarkdown self-check failed");
  }
}
