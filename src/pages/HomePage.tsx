import { useEffect, useState } from 'react'
import Label from '../components/Label'
import ThemeToggle from '../components/ThemeToggle'
import Toolbar from '../components/Toolbar'
import { listShowcases } from '../lib/data'
import { COURSE } from '../site'
import { formatDue, type Showcase } from '../types'
import type { ThemeMode } from '../themes'

interface Props {
  navigate: (path: string) => void
  themeMode: ThemeMode
  onToggleTheme: () => void
}

/** Front page: course title and the list of showcases, newest due date first. */
export default function HomePage({ navigate, themeMode, onToggleTheme }: Props) {
  const [showcases, setShowcases] = useState<Showcase[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listShowcases().then(setShowcases).catch((e: Error) => setError(e.message))
  }, [])

  return (
    <>
      <Toolbar>
        <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
      </Toolbar>
      <main className="home">
        <header className="home__title">
          <Label className="label--muted label--keep">{COURSE.code}</Label>
          <h1 className="home__h1">{COURSE.title}</h1>
        </header>
        <ul className="home__list">
          {error && <Label className="label--muted">{error}</Label>}
          {showcases?.map((s) => (
            <li key={s.id}>
              <a
                className="home__item"
                href={`/${s.slug}`}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(`/${s.slug}`)
                }}
              >
                <span className="home__item-title">{s.title}</span>
                <Label className="label--muted label--keep">{formatDue(s)}</Label>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
