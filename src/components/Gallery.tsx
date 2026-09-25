import StudentGroup from './StudentGroup'
import type { Slide } from '../types'

interface Props {
  slides: Slide[]
  slots: 1 | 2
  onSelect: (slide: Slide) => void
}

export default function Gallery({ slides, slots, onSelect }: Props) {
  // Group slides by entry, preserving order.
  const groups = new Map<string, Slide[]>()
  for (const s of slides) {
    groups.set(s.entryId, [...(groups.get(s.entryId) ?? []), s])
  }

  return (
    <main className={`gallery gallery--${slots}`}>
      {[...groups].map(([id, pair]) => (
        <StudentGroup key={id} name={pair[0].student} slides={pair} onSelect={onSelect} />
      ))}
    </main>
  )
}
