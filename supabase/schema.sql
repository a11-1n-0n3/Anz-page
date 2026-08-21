-- ANZ site: jobs, posts (blog), and CV applications.
-- Run once in Supabase Studio → SQL Editor. Safe to re-run (idempotent).
--
-- 2026-08-21: reconciled with the live table shape after it drifted from an
-- earlier version of this file (someone edited columns directly in Supabase
-- Studio without updating this file or the app code, which broke /blog and
-- /careers in production). `jobs`/`posts` are now id-keyed instead of
-- slug-keyed; `posts.domain` replaced `industry`. Exact constraints (e.g. a
-- check on `domain`) weren't re-verified against the live DB - introspected
-- via `select *` only. This table was observed being edited live in
-- Supabase Studio while this fix was in flight (a column was renamed
-- mid-session) - reconcile with whoever owns that migration before trusting
-- this file blindly.

create table if not exists public.jobs (
  id bigint primary key generated always as identity,
  title text not null,
  type text not null check (type in ('fulltime', 'intern', 'contract')),
  department text not null check (department in ('engineering', 'ai', 'product', 'design', 'operations')),
  locations text[] not null default '{hanoi}',
  level text not null default 'fresher' check (level in ('intern', 'fresher', 'junior', 'middle', 'senior')),
  slots int not null default 1 check (slots > 0),
  jd_vi text not null,
  jd_en text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id bigint primary key generated always as identity,
  -- URL is /blog/<id>. Images live under blog-media/<id>/.
  domain text check (domain in ('vision', 'education', 'conversational', 'generative', 'document', 'predictive')),
  title_vi text not null,
  title_en text not null,
  excerpt_vi text not null default '',
  excerpt_en text not null default '',
  cover text,
  date date not null default current_date,
  body_vi text not null,
  body_en text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id bigint references public.jobs(id) on delete set null,
  role_name text not null,
  candidate_name text not null,
  candidate_email text not null,
  candidate_phone text,
  cv_path text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- CVs are private (server reads them with the secret key); post images are
-- public so next/image can fetch them straight from the CDN.
insert into storage.buckets (id, name, public)
values ('career-cvs', 'career-cvs', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-media', 'blog-media', true, 10485760,
  array['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

alter table public.jobs enable row level security;
alter table public.posts enable row level security;
alter table public.applications enable row level security;

-- Public (anon) may only read published rows. Everything else - including
-- all of `applications` and all writes - goes through the server using the
-- service_role key, which bypasses RLS. No anon policy is defined for
-- applications or for storage.objects on career-cvs, so that bucket and
-- table are unreachable from the browser even if a key ever leaked client-side.
drop policy if exists "public read published jobs" on public.jobs;
create policy "public read published jobs" on public.jobs
  for select using (published = true);

drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts" on public.posts
  for select using (published = true);

-- blog-media is a public bucket, so reads need no policy. Uploads stay
-- server-side (`npm run media:push`, secret key) — no anon insert policy.
