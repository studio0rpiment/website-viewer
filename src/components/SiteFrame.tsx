import { useLayoutEffect, useRef, useState } from 'react'

interface Props {
  url: string
  title: string
  /** Virtual viewport width the site is laid out at before being scaled to fit. */
  layoutWidth?: number
  /** When true the iframe receives pointer events (fullscreen); otherwise it is a thumbnail. */
  interactive?: boolean
}

/**
 * Renders a live website scaled to fill its parent box.
 * The parent must be position: relative with a definite size.
 * Resize is event-driven via ResizeObserver.
 */
export default function SiteFrame({
  url,
  title,
  layoutWidth = 1280,
  interactive = false,
}: Props) {
  const box = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [missing, setMissing] = useState(false)

  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /**
   * Same-origin frames only (local copies under /sites/):
   *  - a path that doesn't exist falls through to the SPA's index.html, which
   *    would embed this app inside itself — detect that and show a placeholder;
   *  - horizontal two-finger swipes over the site would otherwise be swallowed
   *    by the embedded page, so re-dispatch them on the <iframe> element where
   *    the carousel's wheel listener can see them. Vertical scroll is left alone.
   * Cross-origin frames throw on access and keep all their events; that's the browser's rule.
   */
  const onLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    const frame = e.currentTarget
    try {
      const doc = frame.contentDocument
      if (!doc) return
      if (doc.querySelector('#root[data-pair-gallery]')) {
        setMissing(true)
        return
      }
      doc.addEventListener(
        'wheel',
        (ev) => {
          if (Math.abs(ev.deltaX) <= Math.abs(ev.deltaY)) return
          ev.preventDefault()
          frame.dispatchEvent(
            new WheelEvent('wheel', {
              deltaX: ev.deltaX,
              deltaY: ev.deltaY,
              bubbles: true,
              cancelable: true,
            }),
          )
        },
        { passive: false },
      )
    } catch {
      /* cross-origin: nothing to inspect or forward, that's fine */
    }
  }

  const scale = interactive || size.w === 0 ? 1 : size.w / layoutWidth
  const frameW = interactive ? size.w : layoutWidth
  const frameH = interactive ? size.h : size.h / scale

  return (
    <div ref={box} className="site-frame">
      {missing ? (
        <div className="site-frame__missing">
          <span className="label">file not found</span>
          <span className="label label--muted">{url}</span>
        </div>
      ) : (
        size.w > 0 && (
          <iframe
            src={url}
            title={title}
            loading="lazy"
            onLoad={onLoad}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            style={{
              width: frameW,
              height: frameH,
              transform: `scale(${scale})`,
              pointerEvents: interactive ? 'auto' : 'none',
            }}
          />
        )
      )}
    </div>
  )
}
