import Icon from './Icon'
import Label from './Label'
import { useImageRatio } from '../hooks/useImageRatio'
import type { Rotation, Slide } from '../types'

interface Props {
  slide: Slide
  onSelect: (slide: Slide) => void
  onRotate: (slide: Slide, rot: Rotation) => void
}

/**
 * One image in a flow gallery. The tile's footprint is the image's *displayed*
 * shape — natural ratio, turned by its rotation — with the longest side fixed
 * at --tile. So a portrait tile is tall and narrow, a landscape one wide and
 * short, and rotating one swaps its footprint, which is what makes the
 * neighbours reflow. The <img> is rotated inside with a transform; for 90/270
 * its box is the tile's box with the axes swapped (container-query units).
 */
export default function ImageTile({ slide, onSelect, onRotate }: Props) {
  const { ref, ratio, onLoad } = useImageRatio(slide.url)
  const turned = slide.rot === 90 || slide.rot === 270
  const shown = ratio === null ? 1 : turned ? 1 / ratio : ratio // displayed w/h
  const landscape = shown >= 1

  const style: React.CSSProperties = landscape
    ? { width: 'var(--tile)', aspectRatio: String(shown) }
    : { height: 'var(--tile)', aspectRatio: String(shown) }

  return (
    <figure
      className={`tile ${ratio === null ? 'is-unmeasured' : ''}`.trim()}
      style={{ ...style, viewTransitionName: `tile-${slide.entryId}-${slide.variant}` } as React.CSSProperties}
    >
      <button type="button" className="tile__pick" onClick={() => onSelect(slide)} aria-label={slide.student}>
        <img
          ref={ref}
          src={slide.url}
          alt={slide.student}
          loading="lazy"
          onLoad={onLoad}
          className={`tile__img ${turned ? 'is-turned' : ''}`.trim()}
          style={{ transform: `rotate(${slide.rot}deg)` }}
        />
      </button>
      <figcaption className="tile__name">
        <Label className="label--student">{slide.student}</Label>
      </figcaption>
      <button
        type="button"
        className="icon-button tile__rotate"
        aria-label="rotate"
        title="rotate 90°"
        onClick={() => onRotate(slide, ((slide.rot + 90) % 360) as Rotation)}
      >
        <Icon name="rotate" size="1rem" />
      </button>
    </figure>
  )
}
