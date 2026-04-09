create extension if not exists pgcrypto;

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  source_document text not null default '',
  fact_sheet jsonb,
  outputs jsonb not null default '{"blog":"","social":[],"email":""}'::jsonb,
  review_status jsonb not null default '{"blog":"pending","social":"pending","email":"pending"}'::jsonb,
  review_notes jsonb not null default '[]'::jsonb,
  agent_status jsonb not null default '{"research":"idle","copywriter":"idle","editor":"idle"}'::jsonb,
  activity_feed jsonb not null default '[]'::jsonb,
  stage text not null default 'draft' check (stage in ('draft', 'processing', 'complete')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.campaigns
  add column if not exists agent_status jsonb not null default '{"research":"idle","copywriter":"idle","editor":"idle"}'::jsonb;

alter table public.campaigns
  add column if not exists activity_feed jsonb not null default '[]'::jsonb;

alter table public.campaigns enable row level security;

drop policy if exists "Users can read their own campaigns" on public.campaigns;
drop policy if exists "Users can insert their own campaigns" on public.campaigns;
drop policy if exists "Users can update their own campaigns" on public.campaigns;
drop policy if exists "Users can delete their own campaigns" on public.campaigns;

create policy "Users can read their own campaigns"
  on public.campaigns
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own campaigns"
  on public.campaigns
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own campaigns"
  on public.campaigns
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own campaigns"
  on public.campaigns
  for delete
  using (auth.uid() = user_id);
