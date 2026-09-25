import ImageFrame from './ImageFrame'
import SiteFrame from './SiteFrame'
import type { Slide } from '../types'

interface Props {
  slide: Slide
  interactive?: boolean
  layoutWidth?: number
}

/** Picks the renderer for a slide: live site in an iframe, or a still image. */
export default function Media({ slide, interactive, layoutWidth }: Props) {
  return slide.kind === 'image' ? (
    <ImageFrame url={slide.url} alt={`${slide.student} — ${slide.label}`} interactive={interactive} rot={slide.rot} />
  ) : (
    <SiteFrame url={slide.url} title={slide.id} interactive={interactive} layoutWidth={layoutWidth} />
  )
}
