-- Happy Hunt initial schema
-- Places: bars, restaurants, venues that run deals
-- Deals: happy hour / food / drink specials with weekly schedules

create extension if not exists "pgcrypto";

create table if not exists places (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  category      text not null default 'bar'
                check (category in ('bar', 'restaurant', 'pub', 'brewery', 'wine_bar', 'other')),
  address       text,
  neighborhood  text,
  city          text,
  state         text,
  lat           double precision not null,
  lng           double precision not null,
  phone         text,
  website       text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists deals (
  id            uuid primary key default gen_random_uuid(),
  place_id      uuid not null references places(id) on delete cascade,
  title         text not null,
  description   text,
  category      text not null
                check (category in ('happy_hour', 'food_special', 'drink_special')),
  -- JS convention: 0 = Sunday ... 6 = Saturday
  days_of_week  smallint[] not null default '{1,2,3,4,5}',
  start_time    time not null,
  end_time      time not null,
  price_hint    text,             -- e.g. '$5 drafts', 'half price'
  is_verified   boolean not null default false,
  is_active     boolean not null default true,
  valid_from    date,
  valid_until   date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (end_time <> start_time)
);

create index if not exists deals_place_id_idx on deals(place_id);
create index if not exists deals_category_idx on deals(category);
create index if not exists places_geo_idx on places(lat, lng);

-- updated_at maintenance
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists places_updated_at on places;
create trigger places_updated_at
  before update on places
  for each row execute function set_updated_at();

drop trigger if exists deals_updated_at on deals;
create trigger deals_updated_at
  before update on deals
  for each row execute function set_updated_at();

-- Row Level Security: public read, writes only via service role / admin
alter table places enable row level security;
alter table deals  enable row level security;

drop policy if exists places_public_read on places;
create policy places_public_read on places
  for select using (is_active = true);

drop policy if exists deals_public_read on deals;
create policy deals_public_read on deals
  for select using (is_active = true);
