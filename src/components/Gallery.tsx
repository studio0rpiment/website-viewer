import StudentGroup from './StudentGroup'
import ImageFlow from './ImageFlow'
import type { Rotation, Slide } from '../types'

interface Props {
  slides: Slide[]
  slots: 1 | 2
  tile: number
  onSelect: (slide: Slide) => void
  onRotate: (slide: Slide, rot: Rotation) => void
}

/** True when a showcase renders as the tight image flow (one image per student). */
export function isFlow(slots: 1 | 2, slides: Slide[]): boolean {
  return slots === 1 && slides.length > 0 && slides.every((s) => s.kind === 'image')
}

export default function Gallery({ slides, slots, tile, onSelect, onRotate }: Props) {
  if (isFlow(slots, slides)) {
    return <ImageFlow slides={slides} tile={tile} onSelect={onSelect} onRotate={onRotate} />
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
