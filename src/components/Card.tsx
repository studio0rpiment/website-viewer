import Label from './Label'
import SiteFrame from './SiteFrame'
import { VARIANT_LABEL, type Slide } from '../types'

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
      aria-label={`${slide.student} — ${VARIANT_LABEL[slide.variant]}`}
    >
      <div className="card__frame">
        <SiteFrame url={slide.url} title={slide.id} />
      </div>
      <Label className="label--variant">{VARIANT_LABEL[slide.variant]}</Label>
    </button>
  )
}
