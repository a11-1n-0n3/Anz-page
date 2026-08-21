-- Chuyển khoá chính của posts và jobs từ slug sang id tự tăng.
-- Chạy một lần trong Studio → SQL Editor. Chạy lại vô hại.
-- DB trống thì không cần file này — schema.sql đã có định nghĩa mới.
--
-- Gộp luôn 2 thay đổi trước đó nếu chưa chạy: industry → domain, và mở rộng level.

-- ── 1. posts: industry → domain (nếu chưa đổi) ───────────────────────────────
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'posts' and column_name = 'industry') then
    alter table public.posts rename column industry to domain;
  end if;
end $$;

alter table public.posts drop constraint if exists posts_industry_check;
alter table public.posts drop constraint if exists posts_domain_check;

update public.posts set domain = case domain
  when 'computer-vision' then 'vision'
  when 'education'       then 'education'
  when 'manufacturing'   then null
  when 'finance'         then null
  when 'retail'          then null
  when 'real-estate'     then null
  else domain
end;

alter table public.posts add constraint posts_domain_check
  check (domain in ('vision', 'education', 'conversational', 'generative', 'document', 'predictive'));

-- ── 2. jobs: mở rộng cấp bậc ────────────────────────────────────────────────
alter table public.jobs drop constraint if exists jobs_level_check;
alter table public.jobs add constraint jobs_level_check
  check (level in ('intern', 'fresher', 'junior', 'middle', 'senior'));

-- ── 3. posts: slug → id ─────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'posts' and column_name = 'id') then
    -- Giữ slug cũ lại để 301 link đã chia sẻ sang URL mới.
    alter table public.posts rename column slug to legacy_slug;
    alter table public.posts drop constraint posts_pkey;
    alter table public.posts add column id bigint generated always as identity;
    alter table public.posts add primary key (id);
    alter table public.posts alter column legacy_slug drop not null;
    alter table public.posts add constraint posts_legacy_slug_key unique (legacy_slug);
  end if;
end $$;

-- ── 4. jobs: slug → id, kéo theo applications.job_slug ──────────────────────
do $$
begin
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'jobs' and column_name = 'id') then
    alter table public.jobs add column id bigint generated always as identity;

    -- Nối hồ sơ ứng viên sang khoá mới TRƯỚC khi bỏ cột slug.
    alter table public.applications add column if not exists job_id bigint;
    update public.applications a
       set job_id = j.id
      from public.jobs j
     where a.job_slug = j.slug;

    alter table public.applications drop constraint if exists applications_job_slug_fkey;
    alter table public.applications drop column if exists job_slug;

    alter table public.jobs drop constraint jobs_pkey;
    alter table public.jobs add primary key (id);
    alter table public.jobs drop column slug;

    alter table public.applications
      add constraint applications_job_id_fkey
      foreign key (job_id) references public.jobs(id) on delete set null;
  end if;
end $$;

-- ── 5. Bỏ trigger sinh slug, không còn dùng ─────────────────────────────────
drop trigger if exists posts_slug on public.posts;
drop trigger if exists jobs_slug on public.jobs;
drop function if exists public.posts_set_slug();
drop function if exists public.jobs_set_slug();
drop function if exists public.unique_slug(text, regclass, text);
drop function if exists public.slugify(text);
