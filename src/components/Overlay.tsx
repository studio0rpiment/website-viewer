import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  onClose: () => void
  children: ReactNode
  /** CSS selector for the parts of the overlay that should NOT close it when clicked. */
  keep?: string
}

/**
 * Full-viewport backdrop. Clicking anywhere outside `keep` or pressing Escape
 * closes it. On mount it takes keyboard focus so Esc reaches us even if an
 * embedded site had focus before (a cross-origin iframe swallows key events).
 */
export default function Overlay({ onClose, children, keep = '[data-keep]' }: Props) {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    el.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      ref={el}
      tabIndex={-1}
      className="overlay"
      onClick={(e) => {
        if (!(e.target as Element).closest(keep)) onClose()
      }}
    >
      {children}
    </div>
  )
}
