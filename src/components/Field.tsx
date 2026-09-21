import { useEffect, useState } from 'react'

interface Props {
  value: string
  onCommit: (value: string) => void
  placeholder?: string
  label?: string
  mono?: boolean
  className?: string
}

/**
 * Text input that commits on blur or Enter (event-driven — no save timers).
 * Keeps a local draft so typing never fights with props; resyncs when the
 * committed value changes from outside.
 */
export default function Field({ value, onCommit, placeholder, label, className = '' }: Props) {
  const [draft, setDraft] = useState(value)
  useEffect(() => setDraft(value), [value])

  const commit = () => {
    if (draft !== value) onCommit(draft)
  }

  return (
    <label className={`field ${className}`.trim()}>
      {label && <span className="label label--muted">{label}</span>}
      <input
        type="text"
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
          if (e.key === 'Escape') setDraft(value)
        }}
      />
    </label>
  )
}
