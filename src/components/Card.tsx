import Label from './Label'
import SiteFrame from './SiteFrame'
import type { Slide } from '../types'

interface Props {
  slide: Slide
  onSelect: (slide: Slide) => void
}

/** Outline card with a live thumbnail of one site. */
export default function Card({ slide, onSelect }: Props) {
  return (
    <button
      type="button"
      className="card"
      onClick={() => onSelect(slide)}
      aria-label={`${slide.student} — ${slide.label}`}
    >
      <div className="card__frame">
        <SiteFrame url={slide.url} title={slide.id} layoutWidth={1024} />
      </div>
      <Label className="label--variant">{slide.label}</Label>
    </button>
  )
}
