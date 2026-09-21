import Overlay from './Overlay'
import SiteFrame from './SiteFrame'
import SlideCaption from './SlideCaption'
import type { Slide } from '../types'

interface Props {
  slide: Slide
  onClose: () => void
}

/** Near-fullscreen, interactive view of one site. Click outside to return. */
export default function Viewer({ slide, onClose }: Props) {
  return (
    <Overlay onClose={onClose}>
      <div className="viewer">
        <div className="viewer__frame" data-keep>
          <SiteFrame url={slide.url} title={slide.id} interactive />
        </div>
        <SlideCaption slide={slide} />
      </div>
    </Overlay>
  )
}
