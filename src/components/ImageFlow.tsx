import ImageTile from './ImageTile'
import type { Rotation, Slide } from '../types'

interface Props {
  slides: Slide[]
  onSelect: (slide: Slide) => void
  onRotate: (slide: Slide, rot: Rotation) => void
}

/** Image-only gallery: tiles flow like words in a paragraph, 5px apart. */
export default function ImageFlow({ slides, onSelect, onRotate }: Props) {
  return (
    <main className="flow">
      {slides.map((s) => (
        <ImageTile key={s.id} slide={s} onSelect={onSelect} onRotate={onRotate} />
      ))}
    </main>
  )
}
