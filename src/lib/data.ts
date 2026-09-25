import { supabase } from './supabase'
import students from '../data/students.json'
import type { Entry, Showcase } from '../types'

export interface Loaded {
  showcase: Showcase
  entries: Entry[]
  /** true when served from students.json (no database configured). */
  fallback: boolean
}

/** The bundled JSON, shaped like a showcase so the UI has one code path. */
function fromJson(): Loaded {
  const showcase: Showcase = {
    id: 'local',
    slug: 'local',
    title: 'Slop vs. MCP + Skill',
    label_a: 'slop',
    label_b: 'mcp+skill',
    is_default: true,
    due_date: '2026-09-22',
    term: 'F26',
    slots: 2,
    tile: 22,
  }
  const entries: Entry[] = (students as { name: string; slop: string; mcp: string }[]).map((s, i) => ({
    id: `local-${i}`,
    showcase_id: 'local',
    name: s.name,
    url_a: s.slop,
    url_b: s.mcp,
    rot_a: 0,
    rot_b: 0,
    sort: i,
  }))
  return { showcase, entries, fallback: true }
}

/** Load a showcase by slug, or the default one when slug is undefined. */
export async function loadShowcase(slug?: string): Promise<Loaded | null> {
  if (!supabase) return fromJson()

  let q = supabase.from('showcases').select('*').limit(1)
  q = slug ? q.eq('slug', slug) : q.eq('is_default', true)
  const { data, error } = await q.maybeSingle()
  if (error) throw error
  if (!data) return null
  const showcase = data as Showcase

  const { data: entries, error: e2 } = await supabase
    .from('entries')
    .select('*')
    .eq('showcase_id', showcase.id)
    .order('sort')
  if (e2) throw e2
  return { showcase, entries: (entries ?? []) as Entry[], fallback: false }
}

export async function listShowcases(): Promise<Showcase[]> {
  if (!supabase) return [fromJson().showcase]
  const { data, error } = await supabase
    .from('showcases')
    .select('*')
    .order('due_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Showcase[]
}

// ---- writes (require a signed-in admin; RLS enforces it server-side) ----

function db() {
  if (!supabase) throw new Error('No database configured')
  return supabase
}

export async function saveShowcase(patch: Partial<Showcase> & { id: string }) {
  const { id, ...rest } = patch
  const { error } = await db().from('showcases').update(rest).eq('id', id)
  if (error) throw error
}

export async function createShowcase(input: Pick<Showcase, 'slug' | 'title' | 'label_a' | 'label_b' | 'due_date' | 'term' | 'slots'>) {
  const { data, error } = await db().from('showcases').insert(input).select().single()
  if (error) throw error
  return data as Showcase
}

/** Removes the showcase and, via the FK cascade, all of its entries. Uploaded files stay in the bucket. */
export async function deleteShowcase(id: string) {
  const { error } = await db().from('showcases').delete().eq('id', id)
  if (error) throw error
}

export async function saveEntry(patch: Partial<Entry> & { id: string }) {
  const { id, ...rest } = patch
  const { error } = await db().from('entries').update(rest).eq('id', id)
  if (error) throw error
}

export async function addEntry(showcase_id: string, sort: number) {
  const { data, error } = await db()
    .from('entries')
    .insert({ showcase_id, name: '', sort })
    .select()
    .single()
  if (error) throw error
  return data as Entry
}

export async function removeEntry(id: string) {
  const { error } = await db().from('entries').delete().eq('id', id)
  if (error) throw error
}

/** Persist a new order: sort = index. */
export async function reorderEntries(entries: Entry[]) {
  await Promise.all(entries.map((e, i) => (e.sort === i ? null : saveEntry({ id: e.id, sort: i }))))
}
