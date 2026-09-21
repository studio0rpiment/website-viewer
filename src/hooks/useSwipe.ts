import { useEffect, useRef } from 'react'

interface Options {
  onNext: () => void
  onPrev: () => void
  /** Accumulated horizontal wheel delta (px) that counts as one swipe. */
  threshold?: number
}

/**
 * Turns trackpad two-finger horizontal swipes (which arrive as `wheel` events
 * with deltaX) into discrete next/prev steps, and mirrors them on ←/→ keys.
 *
 * A trackpad gesture is a continuous stream of wheel events, so after one step
 * fires we hold further steps until the stream goes quiet. That quiet-detection
 * is the one place a timer is needed: the browser gives no "gesture ended"
 * event, so a short idle timeout (~150ms without a wheel event) stands in for it.
 */
export function useSwipe<T extends HTMLElement>(
  ref: React.RefObject<T>,
  { onNext, onPrev, threshold = 80 }: Options,
) {
  const acc = useRef(0)
  const locked = useRef(false)
  const idle = useRef<number | undefined>(undefined)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const armReset = () => {
      window.clearTimeout(idle.current)
      idle.current = window.setTimeout(() => {
        acc.current = 0
        locked.current = false
      }, 150)
    }

    const onWheel = (e: WheelEvent) => {
      // Ignore vertical scrolls; only horizontal-dominant motion is a swipe.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      armReset()
      if (locked.current) return
      acc.current += e.deltaX
      if (acc.current > threshold) {
        locked.current = true
        onNext()
      } else if (acc.current < -threshold) {
        locked.current = true
        onPrev()
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      el.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(idle.current)
    }
  }, [ref, onNext, onPrev, threshold])
}
