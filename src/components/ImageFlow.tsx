import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import ImageTile from './ImageTile'
import { packSkyline, type Rect } from '../lib/skyline'
import type { Rotation, Slide } from '../types'

interface Props {
  slides: Slide[]
  /** Longest side of a tile, in rem. */
  tile: number
  onSelect: (slide: Slide) => void
  onRotate: (slide: Slide, rot: Rotation) => void
}

const GAP_REM = 0.3125 // 5px

/**
 * Image-only gallery packed with a skyline: each tile drops to the lowest spot
 * it fits, left to right, so there's no vertical slack beyond the 5px gap
 * unless the shapes don't line up. Sizes come from each image's natural ratio
 * (reported by the tile once it loads) turned by its rotation, longest side =
 * `tile`. Re-packs on measure, rotate, resize and container width — all events.
 */
export default function ImageFlow({ slides, tile, onSelect, onRotate }: Props) {
  const host = useRef<HTMLElement>(null)
  const [width, setWidth] = useState(0)
  const [ratios, setRatios] = useState<Record<string, number>>({})

  useLayoutEffect(() => {
    const el = host.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const onMeasure = useCallback((id: string, ratio: number) => {
    setRatios((r) => (r[id] === ratio ? r : { ...r, [id]: ratio }))
  }, [])

  const { rects, height } = useMemo(() => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const long = tile * rem
    const gap = GAP_REM * rem
    const sizes = slides.map((s) => {
      const r = ratios[s.id]
      if (!r) return { w: long, h: long } // unmeasured: reserve a square, hidden
      const turned = s.rot === 90 || s.rot === 270
      const shown = turned ? 1 / r : r
      return shown >= 1 ? { w: long, h: long / shown } : { w: long * shown, h: long }
    })
    return width > 0 ? packSkyline(sizes, width, gap) : { rects: [] as Rect[], height: 0 }
  }, [slides, ratios, tile, width])

  return (
    <main ref={host} className="flow" style={{ height }}>
      {slides.map((s, i) => (
        <ImageTile
          key={s.id}
          slide={s}
          rect={rects[i]}
          measured={s.id in ratios}
          onMeasure={onMeasure}
          onSelect={onSelect}
          onRotate={onRotate}
        />
      ))}
    </main>
  )
}
