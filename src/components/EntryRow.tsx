import Field from './Field'
import UploadButton from './UploadButton'
import type { Entry, Showcase } from '../types'

interface Props {
  entry: Entry
  showcase: Showcase
  index: number
  count: number
  onChange: (patch: Partial<Entry>) => void
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
  onError: (message: string) => void
}

/** One editable student row: name, url(s) with upload, plus move/remove controls. */
export default function EntryRow({ entry, showcase, index, count, onChange, onMove, onRemove, onError }: Props) {
  const slots: Array<'a' | 'b'> = showcase.slots === 2 ? ['a', 'b'] : ['a']
  const stem = entry.name.trim() ? entry.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : entry.id.slice(0, 8)

  return (
    <div className={`entry-row entry-row--${showcase.slots}`}>
      <Field value={entry.name} placeholder="name" onCommit={(name) => onChange({ name })} className="field--name" />
      {slots.map((v) => {
        const key = `url_${v}` as const
        const label = v === 'a' ? showcase.label_a : showcase.label_b
        return (
          <div className="url-slot" key={v}>
            <Field
              value={entry[key]}
              placeholder={`${label || 'site'} url or image`}
              onCommit={(url) => onChange({ [key]: url })}
            />
            <UploadButton
              folder={showcase.slug}
              name={`${stem}-${v}`}
              onDone={(url) => onChange({ [key]: url })}
              onError={onError}
            />
          </div>
        )
      })}
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
