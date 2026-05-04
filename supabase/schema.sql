create extension if not exists pgcrypto;

create table if not exists public.stories (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  genre text not null default '',
  theme text not null default '',
  logline text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.story_points (
  id uuid primary key default gen_random_uuid(),
  story_id text not null references public.stories(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  point_id text not null,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (story_id, point_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists stories_set_updated_at on public.stories;
create trigger stories_set_updated_at
before update on public.stories
for each row
execute function public.set_updated_at();

drop trigger if exists story_points_set_updated_at on public.story_points;
create trigger story_points_set_updated_at
before update on public.story_points
for each row
execute function public.set_updated_at();

alter table public.stories enable row level security;
alter table public.story_points enable row level security;

create policy "Users manage only their stories"
on public.stories
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage only their story points"
on public.story_points
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
