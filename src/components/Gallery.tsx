import StudentGroup from './StudentGroup'
import ImageFlow from './ImageFlow'
import type { Rotation, Slide } from '../types'

interface Props {
  slides: Slide[]
  slots: 1 | 2
  onSelect: (slide: Slide) => void
  onRotate: (slide: Slide, rot: Rotation) => void
}

export default function Gallery({ slides, slots, onSelect, onRotate }: Props) {
  // One image per student → the tight flow layout with rotation.
  if (slots === 1 && slides.length > 0 && slides.every((s) => s.kind === 'image')) {
    return <ImageFlow slides={slides} onSelect={onSelect} onRotate={onRotate} />
  }

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
