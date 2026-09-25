interface Props {
  value: 1 | 2
  onChange: (v: 1 | 2) => void
}

/** "one site per student" / "a pair" — two text buttons, the active one solid. */
export default function SlotsPicker({ value, onChange }: Props) {
  return (
    <div className="slots-picker" role="radiogroup" aria-label="sites per student">
      {([1, 2] as const).map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          className={`text-button ${value === n ? 'is-active' : ''}`.trim()}
          onClick={() => onChange(n)}
        >
          {n === 1 ? 'one site' : 'a pair'}
        </button>
      ))}
    </div>
  )
}
