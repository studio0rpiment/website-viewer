import { useCallback, useMemo, useState } from 'react'
import Gallery from '../components/Gallery'
import Carousel from '../components/Carousel'
import ThemeToggle from '../components/ThemeToggle'
import Toolbar from '../components/Toolbar'
import Label from '../components/Label'
import { useShowcase } from '../hooks/useShowcase'
import { formatDue, toSlides, type Slide } from '../types'
import type { ThemeMode } from '../themes'

interface Props {
  slug: string
  navigate: (path: string) => void
  themeMode: ThemeMode
  onToggleTheme: () => void
}

export default function GalleryPage({ slug, navigate, themeMode, onToggleTheme }: Props) {
  const { state } = useShowcase(slug)
  const slides = useMemo(
    () => (state.status === 'ready' ? toSlides(state.data.showcase, state.data.entries) : []),
    [state],
  )
  /** Index of the open slide, or null while in the gallery. */
  const [open, setOpen] = useState<number | null>(null)

  const select = useCallback(
    (slide: Slide) => setOpen(slides.findIndex((s) => s.id === slide.id)),
    [slides],
  )
  const back = useCallback(() => setOpen(null), [])

  if (state.status === 'loading') return null
  if (state.status === 'missing') return <Notice>no showcase at /{slug}</Notice>
  if (state.status === 'error') return <Notice>{state.message}</Notice>

  const { showcase } = state.data
  const due = formatDue(showcase)

  return (
    <>
      {open === null && (
        <div className="corner-note">
          <a className="label label--link" href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>
            {showcase.title}
          </a>
          {due && <Label className="label--muted label--keep">{due}</Label>}
        </div>
      )}
      {open === null && (
        <Toolbar>
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </Toolbar>
      )}
      <Gallery slides={slides} slots={showcase.slots} onSelect={select} />
      {open !== null && <Carousel slides={slides} startIndex={open} onClose={back} />}
    </>
  )
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <main className="notice">
      <Label className="label--muted">{children}</Label>
    </main>
  )
}
