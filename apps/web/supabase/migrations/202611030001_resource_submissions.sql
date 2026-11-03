create table if not exists public.resource_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  resource_url text not null check (resource_url ~ '^https://'),
  note text check (note is null or char_length(note) <= 400),
  rights_confirmed boolean not null default false check (rights_confirmed),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submission_ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists resource_submissions_ip_created_idx
  on public.resource_submissions (submission_ip_hash, created_at desc);

create index if not exists resource_submissions_status_created_idx
  on public.resource_submissions (status, created_at desc);

alter table public.resource_submissions enable row level security;
revoke all on table public.resource_submissions from anon, authenticated;
grant all on table public.resource_submissions to service_role;
