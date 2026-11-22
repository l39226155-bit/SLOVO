-- SLOVO — optional cloud sync schema (Postgres / Supabase).
-- The shipped app is local-first and does not require this. Apply it only when
-- accounts and multi-device sync are added; the client store shape maps 1:1.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  native_language text not null default 'Deutsch',
  goal text not null default 'travel',
  level text not null default 'A0',
  daily_minutes int not null default 10 check (daily_minutes between 1 and 240),
  placement_score int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null,
  best_score int not null default 0 check (best_score between 0 and 100),
  attempts int not null default 0,
  xp int not null default 0,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.srs_cards (
  user_id uuid not null references auth.users (id) on delete cascade,
  vocab_id text not null,
  ease numeric(4, 2) not null default 2.5,
  interval_days int not null default 0,
  due_at timestamptz not null default now(),
  reps int not null default 0,
  lapses int not null default 0,
  last_grade text not null default 'good',
  last_reviewed_at timestamptz not null default now(),
  primary key (user_id, vocab_id)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id text not null,
  kind text not null check (kind in ('lesson', 'review', 'alphabet', 'grammar', 'listening', 'speaking', 'tutor')),
  label text not null default '',
  minutes numeric(6, 1) not null default 0,
  xp int not null default 0,
  correct int not null default 0,
  total int not null default 0,
  ref_id text,
  at timestamptz not null default now(),
  unique (user_id, client_id)
);

create index if not exists activities_user_at_idx on public.activities (user_id, at desc);
create index if not exists srs_due_idx on public.srs_cards (user_id, due_at);

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.srs_cards enable row level security;
alter table public.activities enable row level security;

-- Each user only ever reads and writes their own rows.
create policy "profiles own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "lesson_progress own" on public.lesson_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "srs_cards own" on public.srs_cards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "activities own" on public.activities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Keep updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
