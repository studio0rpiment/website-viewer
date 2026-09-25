export interface Size { w: number; h: number }
export interface Rect extends Size { x: number; y: number }

/**
 * Skyline packing (bottom-left heuristic). Places each box, in order, at the
 * lowest position where it fits across the current "skyline", preferring the
 * leftmost on ties. Result: no vertical gaps beyond `gap` except where shapes
 * simply don't line up. Boxes keep their given sizes; only x/y are chosen.
 */
export function packSkyline(boxes: Size[], width: number, gap: number): { rects: Rect[]; height: number } {
  type Seg = { x: number; w: number; y: number }
  let sky: Seg[] = [{ x: 0, w: width, y: 0 }]
  const rects: Rect[] = []
  let height = 0

  for (const box of boxes) {
    const w = Math.min(box.w, width)
    // Candidate x positions: the start of every skyline segment.
    let best: { x: number; y: number } | null = null
    for (let i = 0; i < sky.length; i++) {
      const x = sky[i].x
      if (x + w > width + 0.5) continue
      // Highest point of the skyline under [x, x+w].
      let y = 0
      for (let j = i; j < sky.length && sky[j].x < x + w; j++) y = Math.max(y, sky[j].y)
      if (!best || y < best.y - 0.5 || (Math.abs(y - best.y) <= 0.5 && x < best.x)) best = { x, y }
    }
    const x = best?.x ?? 0
    const y = best?.y ?? 0
    rects.push({ x, y, w, h: box.h })
    height = Math.max(height, y + box.h)

    // Raise the skyline under the box to its bottom edge (+gap), splitting edge segments.
    const top = y + box.h + gap
    const next: Seg[] = []
    for (const s of sky) {
      const sEnd = s.x + s.w
      const bEnd = x + w + gap
      if (sEnd <= x || s.x >= bEnd) { next.push(s); continue }
      if (s.x < x) next.push({ x: s.x, w: x - s.x, y: s.y })
      if (sEnd > bEnd) next.push({ x: bEnd, w: sEnd - bEnd, y: s.y })
    }
    next.push({ x, w: w + gap, y: top })
    next.sort((a, b) => a.x - b.x)
    // Merge neighbours at the same height.
    sky = next.reduce<Seg[]>((acc, s) => {
      const last = acc[acc.length - 1]
      if (last && Math.abs(last.y - s.y) < 0.5 && Math.abs(last.x + last.w - s.x) < 0.5) last.w += s.w
      else acc.push({ ...s })
      return acc
    }, [])
  }
  return { rects, height }
}
