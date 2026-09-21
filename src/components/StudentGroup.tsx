import Card from './Card'
import Label from './Label'
import type { Slide } from '../types'

interface Props {
  name: string
  slides: Slide[]
  onSelect: (slide: Slide) => void
}

/** A student's name plus their pair of cards. */
export default function StudentGroup({ name, slides, onSelect }: Props) {
  return (
    <section className="group">
      <Label className="label--student">{name}</Label>
      <div className="group__pair">
        {slides.map((s) => (
          <Card key={s.id} slide={s} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}
