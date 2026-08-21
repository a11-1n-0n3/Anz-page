#!/usr/bin/env node
/**
 * Một lần sau khi chạy migration slug → id: đổi tên thư mục ảnh trong
 * `blog-media` từ legacy_slug sang post id.
 *
 *   node scripts/media-move-to-ids.mjs --dry-run   xem trước, không đụng gì
 *   node scripts/media-move-to-ids.mjs             chuyển thật
 *
 * Chạy lại vô hại: thư mục nào đã chuyển thì bỏ qua.
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const BUCKET = "blog-media";

async function loadEnv() {
  let raw = "";
  try {
    raw = await readFile(resolve(".env"), "utf8");
  } catch {
    /* env có thể đến từ shell */
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

async function main() {
  await loadEnv();
  const base = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!base || !key) die("SUPABASE_URL và SUPABASE_SECRET_KEY phải có trong .env");

  const dryRun = process.argv.includes("--dry-run");
  const auth = { authorization: `Bearer ${key}`, apikey: key, "content-type": "application/json" };

  const res = await fetch(`${base}/rest/v1/posts?select=id,legacy_slug&legacy_slug=not.is.null`, {
    headers: auth,
  });
  if (!res.ok) die(`không đọc được posts: ${res.status} ${(await res.text()).slice(0, 200)}`);
  const posts = await res.json();
  if (!posts.length) die("không có bài nào còn legacy_slug — có thể đã chuyển xong");

  let moved = 0;
  let skipped = 0;

  for (const { id, legacy_slug: slug } of posts) {
    const listed = await fetch(`${base}/storage/v1/object/list/${BUCKET}`, {
      method: "POST",
      headers: auth,
      body: JSON.stringify({ prefix: `${slug}/`, limit: 100 }),
    });
    if (!listed.ok) die(`không liệt kê được ${slug}/: ${listed.status}`);
    const files = (await listed.json()).filter((f) => f.id);

    if (!files.length) {
      console.log(`· ${slug}/ — không có ảnh, bỏ qua`);
      skipped++;
      continue;
    }

    for (const file of files) {
      const from = `${slug}/${file.name}`;
      const to = `${id}/${file.name}`;
      if (dryRun) {
        console.log(`  ${from}  →  ${to}`);
        moved++;
        continue;
      }
      const mv = await fetch(`${base}/storage/v1/object/move`, {
        method: "POST",
        headers: auth,
        body: JSON.stringify({ bucketId: BUCKET, sourceKey: from, destinationKey: to }),
      });
      if (!mv.ok) {
        console.error(`✗ ${from} → ${to}: ${mv.status} ${(await mv.text()).slice(0, 160)}`);
        continue;
      }
      console.log(`✓ ${from}  →  ${to}`);
      moved++;
    }
  }

  console.log(
    dryRun
      ? `\n${moved} file sẽ được chuyển. Bỏ --dry-run để chạy thật.`
      : `\n${moved} file đã chuyển, ${skipped} thư mục bỏ qua.`,
  );
}

main().catch((err) => die(err.message));
