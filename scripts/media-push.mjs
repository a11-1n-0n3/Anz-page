#!/usr/bin/env node
/**
 * Upload post images to the public `blog-media` bucket, one folder per post id.
 *
 *   npm run media:push -- --post "<tiêu đề>" <file...>   look the id up by title
 *   npm run media:push -- <id> <file...>      push files into blog-media/<id>/
 *   npm run media:push -- --all               push everything under supabase/media/<id>/
 *
 * Needs SUPABASE_URL + SUPABASE_SECRET_KEY in .env. Uses fetch, not supabase-js,
 * whose realtime client needs a global WebSocket that Node 20 lacks.
 */
import { readFile, readdir, stat } from "node:fs/promises";
import { basename, extname, join, resolve } from "node:path";

const BUCKET = "blog-media";
const MEDIA_DIR = resolve("supabase/media");
const TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

async function loadEnv() {
  let raw = "";
  try {
    raw = await readFile(resolve(".env"), "utf8");
  } catch {
    /* env may come from the shell instead */
  }
  for (const line of raw.split("\n")) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

function die(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

/** Ids are assigned by the DB, so let the author name the post instead. */
async function idByTitle(base, key, title) {
  const q = encodeURIComponent(`%${title}%`);
  const res = await fetch(
    `${base}/rest/v1/posts?select=id,title_vi,title_en&or=(title_vi.ilike.${q},title_en.ilike.${q})`,
    { headers: { authorization: `Bearer ${key}`, apikey: key } },
  );
  if (!res.ok) die(`không tra được bài: ${res.status} ${(await res.text()).slice(0, 200)}`);
  const rows = await res.json();
  if (!rows.length) die(`không có bài nào khớp "${title}" — kiểm tra lại tiêu đề, hoặc tạo row trong posts trước`);
  if (rows.length > 1) {
    console.error(`✗ "${title}" khớp ${rows.length} bài, nói rõ hơn hoặc dùng thẳng id:`);
    for (const r of rows) console.error(`    id ${String(r.id).padEnd(4)} ${r.title_vi}`);
    process.exit(1);
  }
  console.log(`→ ${rows[0].title_vi}\n  id: ${rows[0].id}\n`);
  return String(rows[0].id);
}

/** [folder, absolute file path] pairs for every image under supabase/media/<folder>/. */
async function collectAll() {
  const out = [];
  for (const folder of await readdir(MEDIA_DIR)) {
    const dir = join(MEDIA_DIR, folder);
    if (!(await stat(dir)).isDirectory()) continue;
    for (const file of await readdir(dir)) {
      if (TYPES[extname(file).toLowerCase()]) out.push([folder, join(dir, file)]);
    }
  }
  return out;
}

async function main() {
  await loadEnv();
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) die("SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env");

  const base = url.replace(/\/+$/, "");
  const args = process.argv.slice(2);
  let jobs;
  if (args[0] === "--all") {
    jobs = await collectAll();
    if (!jobs.length) die(`không có ảnh nào trong ${MEDIA_DIR}`);
  } else if (args[0] === "--post") {
    const [, title, ...files] = args;
    if (!title || !files.length) die('cách dùng: media:push -- --post "<tiêu đề bài>" <file...>');
    const id = await idByTitle(base, key, title);
    jobs = files.map((f) => [id, resolve(f)]);
  } else {
    const [id, ...files] = args;
    if (!id || !files.length) {
      die(
        'cách dùng:\n' +
          '  media:push -- --post "<tiêu đề bài>" <file...>   (tự tra id)\n' +
          "  media:push -- <id> <file...>\n" +
          "  media:push -- --all",
      );
    }
    jobs = files.map((f) => [id, resolve(f)]);
  }

  let failed = 0;

  for (const [folder, file] of jobs) {
    const name = basename(file);
    const contentType = TYPES[extname(name).toLowerCase()];
    if (!contentType) {
      console.error(`✗ ${name} — unsupported type`);
      failed++;
      continue;
    }
    const path = `${folder}/${name}`;
    const res = await fetch(`${base}/storage/v1/object/${BUCKET}/${path}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        apikey: key,
        "content-type": contentType,
        "cache-control": "max-age=31536000",
        "x-upsert": "true",
      },
      body: await readFile(file),
    });
    if (!res.ok) {
      console.error(`✗ ${path} — ${res.status} ${(await res.text()).slice(0, 200)}`);
      failed++;
      continue;
    }
    console.log(`✓ ${path}`);
  }

  const folders = [...new Set(jobs.map(([folder]) => folder))];
  console.log(
    `\nTrong posts.body_* chỉ cần viết tên file trên một dòng riêng, ví dụ:\n  ${basename(jobs[0][1])}`,
  );
  console.log(`URL công khai: ${base}/storage/v1/object/public/${BUCKET}/${folders[0]}/<file>`);
  if (failed) process.exit(1);
}

main().catch((err) => die(err.message));
