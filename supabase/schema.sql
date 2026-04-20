-- Roop platform schema
-- Run this once in Supabase SQL Editor (Database → SQL Editor → New Query)

-- ============================================================
-- 1. TABLES
-- ============================================================

create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  name       text not null,
  phone      text,
  role       text not null default 'customer' check (role in ('customer', 'artist')),
  created_at timestamptz not null default now()
);

create table if not exists public.artists (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null unique references public.profiles(id) on delete cascade,
  display_name text not null,
  tagline      text not null default '',
  bio          text not null default '',
  city         text not null default '',
  area         text not null default '',
  avatar_url   text not null default '',
  cover_url    text not null default '',
  specialties  text not null default '',
  years_exp    int  not null default 0,
  instagram    text,
  featured     boolean not null default false,
  verified     boolean not null default false,
  created_at   timestamptz not null default now()
);

create table if not exists public.portfolio_items (
  id         uuid primary key default gen_random_uuid(),
  artist_id  uuid not null references public.artists(id) on delete cascade,
  image_url  text not null,
  caption    text,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  artist_id   uuid not null references public.artists(id) on delete cascade,
  name        text not null,
  description text not null default '',
  duration    int  not null default 60,
  price       int  not null default 0,
  category    text not null default 'Bridal',
  created_at  timestamptz not null default now()
);

create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  artist_id   uuid not null references public.artists(id) on delete cascade,
  service_id  uuid not null references public.services(id) on delete restrict,
  date        timestamptz not null,
  time_slot   text not null,
  status      text not null default 'confirmed' check (status in ('confirmed','cancelled','completed')),
  total_price int  not null,
  notes       text,
  address     text,
  created_at  timestamptz not null default now()
);

create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  artist_id  uuid not null references public.artists(id) on delete cascade,
  rating     int  not null check (rating between 1 and 5),
  comment    text not null default '',
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2. INDEXES
-- ============================================================
create index if not exists idx_artists_featured on public.artists(featured);
create index if not exists idx_artists_city on public.artists(city);
create index if not exists idx_portfolio_artist on public.portfolio_items(artist_id, sort_order);
create index if not exists idx_services_artist on public.services(artist_id);
create index if not exists idx_bookings_user on public.bookings(user_id, date desc);
create index if not exists idx_bookings_artist on public.bookings(artist_id, date desc);
create index if not exists idx_reviews_artist on public.reviews(artist_id, created_at desc);

-- ============================================================
-- 3. TRIGGER: auto-create profile on auth signup
--    Reads name/role/phone from auth.users.raw_user_meta_data
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );

  if coalesce(new.raw_user_meta_data->>'role', 'customer') = 'artist' then
    insert into public.artists (user_id, display_name, tagline, bio, city, avatar_url, cover_url, specialties)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'name', 'New artist'),
      'New artist on Roop',
      'Tell us about your style and experience.',
      'Bengaluru',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80',
      'Bridal,Party,Editorial'
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles        enable row level security;
alter table public.artists         enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.services        enable row level security;
alter table public.bookings        enable row level security;
alter table public.reviews         enable row level security;

-- profiles: anyone can read, user can update own
drop policy if exists "profiles_read_all" on public.profiles;
drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_read_all" on public.profiles
  for select using (true);
create policy "profiles_update_self" on public.profiles
  for update using (auth.uid() = id);

-- artists: public read, owner can write
drop policy if exists "artists_read_all" on public.artists;
drop policy if exists "artists_update_own" on public.artists;
drop policy if exists "artists_insert_own" on public.artists;
drop policy if exists "artists_delete_own" on public.artists;
create policy "artists_read_all" on public.artists
  for select using (true);
create policy "artists_insert_own" on public.artists
  for insert with check (auth.uid() = user_id);
create policy "artists_update_own" on public.artists
  for update using (auth.uid() = user_id);
create policy "artists_delete_own" on public.artists
  for delete using (auth.uid() = user_id);

-- portfolio_items: public read, artist owner can write
drop policy if exists "portfolio_read_all" on public.portfolio_items;
drop policy if exists "portfolio_write_own" on public.portfolio_items;
create policy "portfolio_read_all" on public.portfolio_items
  for select using (true);
create policy "portfolio_write_own" on public.portfolio_items
  for all using (
    exists (
      select 1 from public.artists a
      where a.id = portfolio_items.artist_id and a.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.artists a
      where a.id = portfolio_items.artist_id and a.user_id = auth.uid()
    )
  );

-- services: public read, artist owner can write
drop policy if exists "services_read_all" on public.services;
drop policy if exists "services_write_own" on public.services;
create policy "services_read_all" on public.services
  for select using (true);
create policy "services_write_own" on public.services
  for all using (
    exists (
      select 1 from public.artists a
      where a.id = services.artist_id and a.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.artists a
      where a.id = services.artist_id and a.user_id = auth.uid()
    )
  );

-- bookings: user sees own, artist sees assigned to them
drop policy if exists "bookings_read_own" on public.bookings;
drop policy if exists "bookings_insert_auth" on public.bookings;
drop policy if exists "bookings_update_parties" on public.bookings;
create policy "bookings_read_own" on public.bookings
  for select using (
    auth.uid() = user_id
    or exists (
      select 1 from public.artists a
      where a.id = bookings.artist_id and a.user_id = auth.uid()
    )
  );
create policy "bookings_insert_auth" on public.bookings
  for insert with check (auth.uid() = user_id);
create policy "bookings_update_parties" on public.bookings
  for update using (
    auth.uid() = user_id
    or exists (
      select 1 from public.artists a
      where a.id = bookings.artist_id and a.user_id = auth.uid()
    )
  );

-- reviews: public read, only booking customer can write for that artist
drop policy if exists "reviews_read_all" on public.reviews;
drop policy if exists "reviews_insert_auth" on public.reviews;
drop policy if exists "reviews_delete_own" on public.reviews;
create policy "reviews_read_all" on public.reviews
  for select using (true);
create policy "reviews_insert_auth" on public.reviews
  for insert with check (auth.uid() = user_id);
create policy "reviews_delete_own" on public.reviews
  for delete using (auth.uid() = user_id);
