import { useEffect, useState } from 'react'
import Label from '../components/Label'
import SignIn from '../components/SignIn'
import { useSession } from '../hooks/useSession'
import { listShowcases } from '../lib/data'
import { supabase } from '../lib/supabase'
import { formatDue, type Showcase } from '../types'

interface Props {
  navigate: (path: string) => void
}

/**
 * /edit — the admin front door. Reachable only by URL. Lists every showcase
 * with a link to its editor, plus "+ new showcase".
 */
export default function AdminPage({ navigate }: Props) {
  const { session, ready, signOut } = useSession()
  const [showcases, setShowcases] = useState<Showcase[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) listShowcases().then(setShowcases).catch((e: Error) => setError(e.message))
  }, [session])

  if (!supabase) return <Notice>no database configured — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY</Notice>
  if (!ready) return null
  if (!session) return <SignIn />

  const go = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    navigate(path)
  }

  return (
    <main className="editor">
      <header className="editor__head">
        <Label className="label--student">showcases</Label>
        <nav className="editor__nav">
          <a className="label label--link" href="/" onClick={go('/')}>front page ↗</a>
          <a className="label label--link" href="/edit/new" onClick={go('/edit/new')}>+ new showcase</a>
          <Label className="label--muted">{session.user.email}</Label>
          <button type="button" className="label label--link text-button" onClick={signOut}>sign out</button>
        </nav>
      </header>

      <ul className="home__list">
        {error && <Label className="label--muted">{error}</Label>}
        {showcases?.map((s) => (
          <li key={s.id}>
            <a className="home__item" href={`/edit/${s.slug}`} onClick={go(`/edit/${s.slug}`)}>
              <span className="home__item-title">{s.title}</span>
              <Label className="label--muted label--keep">{formatDue(s)}</Label>
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <main className="notice">
      <Label className="label--muted">{children}</Label>
    </main>
  )
}
