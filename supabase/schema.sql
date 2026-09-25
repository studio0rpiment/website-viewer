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
  due_date    date,                             -- assignment due date (optional)
  term        text not null default '',         -- e.g. F26
  slots       integer not null default 2 check (slots in (1, 2)), -- sites per student
  tile        integer not null default 22,    -- flow-gallery tile size (rem)
  created_at  timestamptz not null default now()
);
-- Additive migrations for databases created before these columns existed.
alter table showcases add column if not exists due_date date;
alter table showcases add column if not exists term text not null default '';
alter table showcases add column if not exists slots integer not null default 2 check (slots in (1, 2));
alter table showcases add column if not exists tile integer not null default 22;

create table if not exists entries (
  id           uuid primary key default gen_random_uuid(),
  showcase_id  uuid not null references showcases(id) on delete cascade,
  name         text not null,                 -- student / group label
  url_a        text not null default '',
  url_b        text not null default '',
  rot_a        integer not null default 0,   -- display rotation (0/90/180/270) for images
  rot_b        integer not null default 0,
  sort         integer not null default 0,
  created_at   timestamptz not null default now()
);

alter table entries add column if not exists rot_a integer not null default 0;
alter table entries add column if not exists rot_b integer not null default 0;

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

-- Looks the signed-in user up by id and matches their account email against
-- admins, so it doesn't depend on an email claim being present in the JWT.
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from auth.users u
    join admins a on a.email = lower(u.email)
    where u.id = auth.uid()
  );
$$;
grant execute on function is_admin() to anon, authenticated;

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

insert into admins (email) values ('el.kevo@gmail.com'), ('kevin@orpiment.studio')
  on conflict do nothing;

insert into showcases (slug, title, label_a, label_b, is_default, due_date, term)
  values ('slop-vs-mcp', 'Slop vs. MCP + Skill', 'slop', 'mcp+skill', true, '2026-09-22', 'F26')
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

-- ---------- storage: public image bucket ----------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('uploads', 'uploads', true, 10485760, array['image/*'])
  on conflict (id) do update set public = true;

drop policy if exists "public read uploads" on storage.objects;
create policy "public read uploads" on storage.objects for select
  using (bucket_id = 'uploads');

drop policy if exists "admins write uploads" on storage.objects;
create policy "admins write uploads" on storage.objects for all
  using (bucket_id = 'uploads' and is_admin())
  with check (bucket_id = 'uploads' and is_admin());
