-- ANZ site: jobs, posts (blog), and CV applications.
-- Run once in Supabase Studio → SQL Editor. Safe to re-run (idempotent).

create table if not exists public.jobs (
  slug text primary key,
  title text not null,
  type text not null check (type in ('fulltime', 'intern', 'contract')),
  department text not null check (department in ('engineering', 'ai', 'product', 'design', 'operations')),
  locations text[] not null default '{hanoi}',
  level text not null default 'fresher' check (level in ('fresher')),
  slots int not null default 1 check (slots > 0),
  jd_vi text not null,
  jd_en text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  slug text primary key,
  industry text check (industry in ('manufacturing', 'finance', 'retail', 'education', 'real-estate', 'computer-vision')),
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
  job_slug text references public.jobs(slug) on delete set null,
  role_name text not null,
  candidate_name text not null,
  candidate_email text not null,
  candidate_phone text,
  cv_path text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public)
values ('career-cvs', 'career-cvs', false)
on conflict (id) do nothing;

alter table public.jobs enable row level security;
alter table public.posts enable row level security;
alter table public.applications enable row level security;

-- Public (anon) may only read published rows. Everything else — including
-- all of `applications` and all writes — goes through the server using the
-- service_role key, which bypasses RLS. No anon policy is defined for
-- applications or for storage.objects on career-cvs, so that bucket and
-- table are unreachable from the browser even if a key ever leaked client-side.
drop policy if exists "public read published jobs" on public.jobs;
create policy "public read published jobs" on public.jobs
  for select using (published = true);

drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts" on public.posts
  for select using (published = true);
