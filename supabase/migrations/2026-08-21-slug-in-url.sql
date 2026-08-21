-- ABANDONED — không chạy.
-- App + schema dùng /blog/<id>; cột slug không còn cần.
-- Giữ file chỉ để ghi lại quyết định đã hủy (đưa slug về URL).
-- Nếu vẫn muốn /blog/<slug>, phải sửa lại posts.ts + route [slug] trước.

-- ── 1. legacy_slug → slug ───────────────────────────────────────────────────
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'posts' and column_name = 'legacy_slug') then
    alter table public.posts rename column legacy_slug to slug;
  end if;
end $$;

alter table public.posts add column if not exists slug text;

-- ── 2. Hàm sinh slug ────────────────────────────────────────────────────────
create or replace function public.slugify(txt text) returns text as $$
  select btrim(
    regexp_replace(
      translate(lower(coalesce(txt, '')), 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ', 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'),
      '[^a-z0-9]+', '-', 'g'),
    '-');
$$ language sql immutable;

create or replace function public.posts_set_slug() returns trigger as $$
declare
  base text;
  candidate text;
  n int := 1;
begin
  if new.slug is not null and btrim(new.slug) <> '' then
    return new;
  end if;
  base := public.slugify(
    coalesce(nullif(btrim(new.title_vi), ''), nullif(btrim(new.title_en), ''))
  );
  if length(base) > 80 then
    base := regexp_replace(left(base, 80), '-[^-]*$', '');
  end if;
  base := btrim(coalesce(base, ''), '-');
  if base = '' then
    base := 'bai-viet';
  end if;
  candidate := base;
  while exists (select 1 from public.posts where slug = candidate) loop
    n := n + 1;
    candidate := base || '-' || n;
  end loop;
  new.slug := candidate;
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_slug on public.posts;
create trigger posts_slug before insert on public.posts
  for each row execute function public.posts_set_slug();

-- ── 3. Lấp slug cho bài chưa có, rồi siết ràng buộc ─────────────────────────
-- Lấp slug cho bài chưa có. Phải né 2 kiểu đụng nhau: với slug đã tồn tại,
-- và với nhau (hai bài chưa có slug mà trùng tiêu đề).
with base as (
  select id,
         nullif(btrim(left(public.slugify(
           coalesce(nullif(btrim(title_vi), ''), title_en)), 80), '-'), '') as s
    from public.posts
   where slug is null or btrim(slug) = ''
),
final as (
  select id,
         case
           when s is null then 'bai-viet-' || id
           when count(*) over (partition by s) > 1 then s || '-' || id
           when exists (select 1 from public.posts o where o.slug = base.s) then s || '-' || id
           else s
         end as new_slug
    from base
)
update public.posts p
   set slug = final.new_slug
  from final
 where p.id = final.id;

alter table public.posts alter column slug set not null;

-- Đổi tên cột không đổi tên ràng buộc — đổi tay, đừng tạo thêm cái thứ hai.
do $$
begin
  if exists (select 1 from pg_constraint
             where conrelid = 'public.posts'::regclass and conname = 'posts_legacy_slug_key') then
    alter table public.posts rename constraint posts_legacy_slug_key to posts_slug_key;
  end if;
  if not exists (select 1 from pg_constraint
                 where conrelid = 'public.posts'::regclass and conname = 'posts_slug_key') then
    alter table public.posts add constraint posts_slug_key unique (slug);
  end if;
end $$;
