import StudentGroup from './StudentGroup'
import type { Slide } from '../types'

interface Props {
  slides: Slide[]
  onSelect: (slide: Slide) => void
}

export default function Gallery({ slides, onSelect }: Props) {
  // Group slides by student, preserving order.
  const groups = new Map<string, Slide[]>()
  for (const s of slides) {
    groups.set(s.student, [...(groups.get(s.student) ?? []), s])
  }

  return (
    <main className="gallery">
      {[...groups].map(([name, pair]) => (
        <StudentGroup key={name} name={name} slides={pair} onSelect={onSelect} />
      ))}
    </main>
  )
}
