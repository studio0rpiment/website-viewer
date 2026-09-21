import { useCallback, useMemo, useState } from 'react'
import Gallery from '../components/Gallery'
import Carousel from '../components/Carousel'
import ThemeToggle from '../components/ThemeToggle'
import Toolbar from '../components/Toolbar'
import Label from '../components/Label'
import { useShowcase } from '../hooks/useShowcase'
import { toSlides, type Slide } from '../types'
import type { ThemeMode } from '../themes'

interface Props {
  slug?: string
  themeMode: ThemeMode
  onToggleTheme: () => void
}

export default function GalleryPage({ slug, themeMode, onToggleTheme }: Props) {
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

  return (
    <>
      {open === null && (
        <Toolbar>
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </Toolbar>
      )}
      <Gallery slides={slides} onSelect={select} />
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
