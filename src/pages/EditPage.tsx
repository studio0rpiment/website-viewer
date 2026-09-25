import { useEffect, useState } from 'react'
import Field from '../components/Field'
import EntryRow from '../components/EntryRow'
import Label from '../components/Label'
import SignIn from '../components/SignIn'
import SlotsPicker from '../components/SlotsPicker'
import BulkImport from '../components/BulkImport'
import { useSession } from '../hooks/useSession'
import { useShowcase } from '../hooks/useShowcase'
import { addEntry, listShowcases, removeEntry, reorderEntries, saveEntry, saveShowcase } from '../lib/data'
import { supabase } from '../lib/supabase'
import type { Entry, Showcase } from '../types'

interface Props {
  slug: string
  navigate: (path: string) => void
}

/**
 * Editor for one showcase. Reachable only by URL (/edit/:slug) — nothing on
 * the gallery links here. Requires a signed-in admin; RLS enforces it too.
 * Every field commits on blur/Enter; the row list updates from the write's
 * result rather than a refetch.
 */
export default function EditPage({ slug, navigate }: Props) {
  const { session, ready, signOut } = useSession()
  const { state, patch } = useShowcase(slug)
  const [others, setOthers] = useState<Showcase[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (!session || !supabase) return
    listShowcases().then(setOthers).catch(() => {})
    // Ask the database whether this session may write — the same check RLS uses.
    supabase.rpc('is_admin').then(({ data }) => setIsAdmin(data === true))
  }, [session])

  if (!supabase) return <Notice>no database configured — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY</Notice>
  if (!ready || state.status === 'loading') return null
  if (!session) return <SignIn />
  if (state.status === 'missing') return <Notice>no showcase at /{slug}</Notice>
  if (state.status === 'error') return <Notice>{state.message}</Notice>

  const { showcase, entries } = state.data

  const run = (fn: () => Promise<void>) =>
    fn().catch((e: Error) => setError(e.message))

  const changeShowcase = (p: Partial<Showcase>) =>
    run(async () => {
      await saveShowcase({ id: showcase.id, ...p })
      patch((d) => ({ ...d, showcase: { ...d.showcase, ...p } }))
      if (p.slug) navigate(`/edit/${p.slug}`)
    })

  const changeEntry = (id: string, p: Partial<Entry>) =>
    run(async () => {
      await saveEntry({ id, ...p })
      patch((d) => ({ ...d, entries: d.entries.map((e) => (e.id === id ? { ...e, ...p } : e)) }))
    })

  const add = () =>
    run(async () => {
      const row = await addEntry(showcase.id, entries.length)
      patch((d) => ({ ...d, entries: [...d.entries, row] }))
    })

  const remove = (id: string) =>
    run(async () => {
      await removeEntry(id)
      patch((d) => ({ ...d, entries: d.entries.filter((e) => e.id !== id) }))
    })

  const move = (index: number, dir: -1 | 1) =>
    run(async () => {
      const next = [...entries]
      const [row] = next.splice(index, 1)
      next.splice(index + dir, 0, row)
      await reorderEntries(next)
      patch((d) => ({ ...d, entries: next.map((e, i) => ({ ...e, sort: i })) }))
    })

  return (
    <main className="editor">
      <header className="editor__head">
        <Label className="label--student">{showcase.title || slug}</Label>
        <nav className="editor__nav">
          <a className="label label--link" href="/edit" onClick={(e) => { e.preventDefault(); navigate('/edit') }}>all showcases</a>
          <a className="label label--link" href={`/${showcase.slug}`}>view ↗</a>
          {others
            .filter((s) => s.id !== showcase.id)
            .map((s) => (
              <a key={s.id} className="label label--link" href={`/edit/${s.slug}`} onClick={(e) => { e.preventDefault(); navigate(`/edit/${s.slug}`) }}>
                {s.slug}
              </a>
            ))}
          <a className="label label--link" href="/edit/new" onClick={(e) => { e.preventDefault(); navigate('/edit/new') }}>+ new showcase</a>
          <Label className="label--muted">
            {session.user.email}{isAdmin === false && ' — not an admin'}
          </Label>
          <button type="button" className="label label--link text-button" onClick={signOut}>sign out</button>
        </nav>
      </header>

      <section className="editor__meta">
        <Field label="title" value={showcase.title} onCommit={(title) => changeShowcase({ title })} />
        <Field label="slug" value={showcase.slug} onCommit={(slug) => changeShowcase({ slug: slugify(slug) })} />
        <Field label={showcase.slots === 2 ? "caption a" : "caption"} value={showcase.label_a} onCommit={(label_a) => changeShowcase({ label_a })} />
        {showcase.slots === 2 && (
          <Field label="caption b" value={showcase.label_b} onCommit={(label_b) => changeShowcase({ label_b })} />
        )}
        <label className="field">
          <span className="label label--muted">due date</span>
          <input
            type="date"
            value={showcase.due_date ?? ''}
            onChange={(e) => changeShowcase({ due_date: e.target.value || null })}
          />
        </label>
        <Field label="term" value={showcase.term} onCommit={(term) => changeShowcase({ term })} />
        <label className="field">
          <span className="label label--muted">sites per student</span>
          <SlotsPicker value={showcase.slots} onChange={(slots) => changeShowcase({ slots })} />
        </label>
      </section>

      <section className="editor__entries">
        {entries.map((entry, i) => (
          <EntryRow
            key={entry.id}
            entry={entry}
            showcase={showcase}
            index={i}
            count={entries.length}
            onChange={(p) => changeEntry(entry.id, p)}
            onMove={(dir) => move(i, dir)}
            onRemove={() => remove(entry.id)}
            onError={setError}
          />
        ))}
        <div className="editor__actions">
          <button type="button" className="text-button" onClick={add}>+ add</button>
          <BulkImport
            showcase={showcase}
            count={entries.length}
            onAdded={(rows) => patch((d) => ({ ...d, entries: [...d.entries, ...rows] }))}
            onError={setError}
          />
        </div>
      </section>

      {error && (
        <footer className="editor__error">
          <Label className="label--muted">{error}</Label>
          <button type="button" className="text-button" onClick={() => setError(null)}>dismiss</button>
        </footer>
      )}
    </main>
  )
}

export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <main className="notice">
      <Label className="label--muted">{children}</Label>
    </main>
  )
}
