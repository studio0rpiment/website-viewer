interface Props {
  value: number
  min: number
  max: number
  step: number
  onChange: (next: number) => void
}

/** + / − pair that steps a value; disabled at the ends. */
export default function ScaleControl({ value, min, max, step, onChange }: Props) {
  return (
    <div className="scale-control" role="group" aria-label="image size">
      <button
        type="button"
        className="icon-button"
        aria-label="larger"
        title="larger"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + step))}
      >
        +
      </button>
      <button
        type="button"
        className="icon-button"
        aria-label="smaller"
        title="smaller"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - step))}
      >
        −
      </button>
    </div>
  )
}
