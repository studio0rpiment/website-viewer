import { useCallback, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import Gallery, { isFlow } from '../components/Gallery'
import ScaleControl from '../components/ScaleControl'
import Carousel from '../components/Carousel'
import ThemeToggle from '../components/ThemeToggle'
import Toolbar from '../components/Toolbar'
import Label from '../components/Label'
import { useShowcase } from '../hooks/useShowcase'
import { useSession } from '../hooks/useSession'
import { saveEntry, saveShowcase } from '../lib/data'
import { APP_NAME } from '../site'
import { TILE, formatDue, toSlides, type Rotation, type Slide } from '../types'
import type { ThemeMode } from '../themes'

interface Props {
  slug: string
  navigate: (path: string) => void
  themeMode: ThemeMode
  onToggleTheme: () => void
}

export default function GalleryPage({ slug, navigate, themeMode, onToggleTheme }: Props) {
  const { state, patch } = useShowcase(slug)
  const { session } = useSession()
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

  /**
   * Rotate an image 90°. The change is applied inside a View Transition so the
   * tile's new footprint — and every neighbour shuffling to make room — animates.
   * Anyone can rotate for the session; a signed-in admin's rotation is saved.
   */
  const rotate = useCallback(
    (slide: Slide, rot: Rotation) => {
      const key = slide.variant === 'a' ? 'rot_a' : 'rot_b'
      const apply = () =>
        flushSync(() =>
          patch((d) => ({
            ...d,
            entries: d.entries.map((e) => (e.id === slide.entryId ? { ...e, [key]: rot } : e)),
          })),
        )
      if (document.startViewTransition) document.startViewTransition(apply)
      else apply()
      if (session) saveEntry({ id: slide.entryId, [key]: rot }).catch(() => {})
    },
    [patch, session],
  )

  /** Resize every tile. Same rules as rotate: animated, anyone can, admin's choice is saved. */
  const resize = useCallback(
    (tile: number) => {
      const apply = () => flushSync(() => patch((d) => ({ ...d, showcase: { ...d.showcase, tile } })))
      if (document.startViewTransition) document.startViewTransition(apply)
      else apply()
      if (session && state.status === 'ready') saveShowcase({ id: state.data.showcase.id, tile }).catch(() => {})
    },
    [patch, session, state],
  )

  useEffect(() => {
    if (state.status === 'ready') document.title = `${state.data.showcase.title} — ${APP_NAME}`
  }, [state])

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
          {isFlow(showcase.slots, slides) && (
            <ScaleControl value={showcase.tile ?? TILE.default} min={TILE.min} max={TILE.max} step={TILE.step} onChange={resize} />
          )}
        </Toolbar>
      )}
      <Gallery slides={slides} slots={showcase.slots} tile={showcase.tile ?? TILE.default} onSelect={select} onRotate={rotate} />
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
