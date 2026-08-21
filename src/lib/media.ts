// Post images live in a public Supabase bucket, one folder per post id: blog-media/{id}/{file}

export const MEDIA_BUCKET = "blog-media";

const PUBLIC_OBJECT_PATH = "/storage/v1/object/public/";

/** Public URL for `{id}/{file}` in the media bucket. "" when Supabase is unset. */
export function mediaUrl(path: string) {
  const base = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");
  if (!base) return "";
  return `${base}${PUBLIC_OBJECT_PATH}${MEDIA_BUCKET}/${path.replace(/^\/+/, "")}`;
}

/** Storage public URLs are allowlisted in next.config, so next/image may optimize them. */
export function isStorageUrl(src: string) {
  return src.includes(PUBLIC_OBJECT_PATH);
}
