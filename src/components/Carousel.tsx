import { useCallback, useRef, useState } from 'react'
import Overlay from './Overlay'
import Media from './Media'
import SlideCaption from './SlideCaption'
import Label from './Label'
import { useSwipe } from '../hooks/useSwipe'
import type { Slide } from '../types'

interface Props {
  slides: Slide[]
  startIndex: number
  onClose: () => void
}

/**
 * Fullscreen carousel of live, fully interactive sites. Wraps at both ends.
 * Move by clicking the outer 10% of the viewport on either side, with ←/→,
 * or a two-finger swipe over the margins. (A swipe over the site itself
 * belongs to the site — it scrolls the page.)
 * Slides are mounted lazily (current ± 1) to keep iframe count low.
 */
export default function Carousel({ slides, startIndex, onClose }: Props) {
  const n = slides.length
  const [index, setIndex] = useState(startIndex)
  // A wrap (last→first or first→last) would animate across every slide; skip the transition for that one step.
  const [animate, setAnimate] = useState(true)
  const root = useRef<HTMLDivElement>(null)

  const step = useCallback(
    (dir: 1 | -1) =>
      setIndex((i) => {
        const j = (i + dir + n) % n
        setAnimate(Math.abs(j - i) === 1)
        return j
      }),
    [n],
  )
  const next = useCallback(() => step(1), [step])
  const prev = useCallback(() => step(-1), [step])

  useSwipe(root, { onNext: next, onPrev: prev })

  const near = (i: number) => {
    const d = Math.abs(i - index)
    return d <= 1 || d === n - 1
  }

  return (
    <Overlay onClose={onClose}>
      <div className="carousel" ref={root}>
        <div
          className="carousel__track"
          style={{
            transform: `translateX(${-index * 100}%)`,
            transition: animate ? undefined : 'none',
          }}
        >
          {slides.map((slide, i) => (
            <div className="carousel__slide" key={slide.id}>
              {near(i) && (
                <div className="carousel__frame" data-keep>
                  <Media slide={slide} interactive />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Click zones: outer 10% of the viewport on each side */}
        <div className="carousel__zone carousel__zone--prev" onClick={prev} data-keep aria-hidden />
        <div className="carousel__zone carousel__zone--next" onClick={next} data-keep aria-hidden />

        <div className="carousel__bar" data-keep>
          <SlideCaption slide={slides[index]} />
          <Label className="label--muted">
            {index + 1} / {n}
          </Label>
        </div>
      </div>
    </Overlay>
  )
}
