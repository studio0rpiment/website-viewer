-- Pair Gallery schema. Paste into Supabase → SQL Editor → Run.
-- Safe to re-run: everything is "if not exists" / "or replace".

-- ---------- tables ----------

create table if not exists showcases (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,           -- URL: /<slug>
  title       text not null,
  label_a     text not null default 'a',      -- caption under the first site of each pair
  label_b     text not null default 'b',      -- caption under the second
  is_default  boolean not null default false, -- shown at /
  created_at  timestamptz not null default now()
);

create table if not exists entries (
  id           uuid primary key default gen_random_uuid(),
  showcase_id  uuid not null references showcases(id) on delete cascade,
  name         text not null,                 -- student / group label
  url_a        text not null default '',
  url_b        text not null default '',
  sort         integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists entries_showcase_sort on entries (showcase_id, sort);

-- Who may edit. Anyone can read; only emails listed here can write.
create table if not exists admins (
  email text primary key
);

-- Only one default showcase at a time.
create unique index if not exists showcases_one_default
  on showcases (is_default) where is_default;

-- ---------- row level security ----------

alter table showcases enable row level security;
alter table entries   enable row level security;
alter table admins    enable row level security;

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from admins where email = lower(auth.jwt() ->> 'email')
  );
$$;

drop policy if exists "public read showcases" on showcases;
create policy "public read showcases" on showcases for select using (true);
drop policy if exists "admins write showcases" on showcases;
create policy "admins write showcases" on showcases for all
  using (is_admin()) with check (is_admin());

drop policy if exists "public read entries" on entries;
create policy "public read entries" on entries for select using (true);
drop policy if exists "admins write entries" on entries;
create policy "admins write entries" on entries for all
  using (is_admin()) with check (is_admin());

drop policy if exists "admins read admins" on admins;
create policy "admins read admins" on admins for select using (is_admin());

-- ---------- seed ----------

insert into admins (email) values ('el.kevo@gmail.com')
  on conflict do nothing;

insert into showcases (slug, title, label_a, label_b, is_default)
  values ('slop-vs-mcp', 'Slop vs. MCP + Skill', 'slop', 'mcp+skill', true)
  on conflict (slug) do nothing;

insert into entries (showcase_id, name, url_a, url_b, sort)
select s.id, v.name, v.url_a, v.url_b, v.sort
from showcases s,
  (values
    ('Daon',     '/sites/daon-slop.html',                                        'https://mcpnps.vercel.app/',                                          0),
    ('Sonia',    'https://soniahougw.github.io/roosevelt-island/#memorial',      'https://soniahougw.github.io/Theodore-Roosevelt-Island-2nd-web/',    1),
    ('Yingying', 'https://yingyingsun-crypto.github.io/rock-creek-AI-Slop/',      'https://yingyingsun-crypto.github.io/rock-creek-mcp-skill/',          2)
  ) as v(name, url_a, url_b, sort)
where s.slug = 'slop-vs-mcp'
  and not exists (select 1 from entries e where e.showcase_id = s.id);
