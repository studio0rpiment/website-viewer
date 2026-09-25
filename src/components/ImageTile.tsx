import { useEffect } from 'react'
import Icon from './Icon'
import Label from './Label'
import { useImageRatio } from '../hooks/useImageRatio'
import type { Rect } from '../lib/skyline'
import type { Rotation, Slide } from '../types'

interface Props {
  slide: Slide
  /** Where the flow put this tile; undefined until the container is measured. */
  rect?: Rect
  measured: boolean
  onMeasure: (id: string, ratio: number) => void
  onSelect: (slide: Slide) => void
  onRotate: (slide: Slide, rot: Rotation) => void
}

/**
 * One image in the flow. Reports its natural ratio up to the flow (which does
 * the packing) and renders at the rect it's given. The <img> is rotated inside
 * with a transform; for 90/270 its box is the tile's box with the axes swapped
 * (container-query units), so the rotated picture fills the rotated footprint.
 */
export default function ImageTile({ slide, rect, measured, onMeasure, onSelect, onRotate }: Props) {
  const { ref, ratio, onLoad } = useImageRatio(slide.url)
  useEffect(() => {
    if (ratio) onMeasure(slide.id, ratio)
  }, [ratio, slide.id, onMeasure])

  const turned = slide.rot === 90 || slide.rot === 270
  const style: React.CSSProperties = rect
    ? { left: rect.x, top: rect.y, width: rect.w, height: rect.h }
    : {}

  return (
    <figure
      className={`tile ${measured && rect ? '' : 'is-unmeasured'}`.trim()}
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
