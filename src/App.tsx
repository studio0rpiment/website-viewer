import { useCallback, useMemo, useState } from 'react'
import Gallery from './components/Gallery'
import Carousel from './components/Carousel'
import ThemeToggle from './components/ThemeToggle'
import Toolbar from './components/Toolbar'
import { useTheme } from './hooks/useTheme'
import students from './data/students.json'
import { toSlides, type Slide, type Student } from './types'

export default function App() {
  const slides = useMemo(() => toSlides(students as Student[]), [])
  /** Index of the open slide, or null while in the gallery. */
  const [open, setOpen] = useState<number | null>(null)
  const { theme, toggle: toggleTheme } = useTheme()

  const select = useCallback(
    (slide: Slide) => setOpen(slides.findIndex((s) => s.id === slide.id)),
    [slides],
  )
  const back = useCallback(() => setOpen(null), [])

  return (
    <>
      {open === null && (
        <Toolbar>
          <ThemeToggle mode={theme.mode} onToggle={toggleTheme} />
        </Toolbar>
      )}
      <Gallery slides={slides} onSelect={select} />
      {open !== null && <Carousel slides={slides} startIndex={open} onClose={back} />}
    </>
  )
}
