import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

/** Small monospace caption used for student names and slide variants. */
export default function Label({ children, className = '' }: Props) {
  return <span className={`label ${className}`.trim()}>{children}</span>
}
