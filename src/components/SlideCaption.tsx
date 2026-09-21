import Label from './Label'
import type { Slide } from '../types'

interface Props {
  slide: Slide
  showStudent?: boolean
}

/** Caption row under a carousel slide. */
export default function SlideCaption({ slide, showStudent = true }: Props) {
  return (
    <div className="slide-caption">
      {showStudent && <Label className="label--student">{slide.student}</Label>}
      <Label className="label--variant">{slide.label}</Label>
      <a
        className="label label--link"
        href={slide.url}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        open ↗
      </a>
    </div>
  )
}
