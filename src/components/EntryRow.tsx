import Field from './Field'
import type { Entry, Showcase } from '../types'

interface Props {
  entry: Entry
  showcase: Showcase
  index: number
  count: number
  onChange: (patch: Partial<Entry>) => void
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
}

/** One editable student row: name, url a, url b, plus move/remove controls. */
export default function EntryRow({ entry, showcase, index, count, onChange, onMove, onRemove }: Props) {
  return (
    <div className={`entry-row entry-row--${showcase.slots}`}>
      <Field value={entry.name} placeholder="name" onCommit={(name) => onChange({ name })} className="field--name" />
      <Field value={entry.url_a} placeholder={`${showcase.label_a} url`} onCommit={(url_a) => onChange({ url_a })} />
      {showcase.slots === 2 && (
        <Field value={entry.url_b} placeholder={`${showcase.label_b} url`} onCommit={(url_b) => onChange({ url_b })} />
      )}
      <div className="entry-row__tools">
        <button type="button" className="text-button" onClick={() => onMove(-1)} disabled={index === 0} aria-label="move up">
          ↑
        </button>
        <button type="button" className="text-button" onClick={() => onMove(1)} disabled={index === count - 1} aria-label="move down">
          ↓
        </button>
        <button type="button" className="text-button text-button--danger" onClick={onRemove} aria-label="remove">
          ×
        </button>
      </div>
    </div>
  )
}
