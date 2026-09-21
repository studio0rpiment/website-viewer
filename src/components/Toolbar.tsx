import type { ReactNode } from 'react'

/** Fixed top-right row for global controls. */
export default function Toolbar({ children }: { children: ReactNode }) {
  return <div className="toolbar">{children}</div>
}
