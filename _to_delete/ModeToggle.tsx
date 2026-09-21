import Label from './Label'

interface Props {
  on: boolean
  onToggle: () => void
}

/**
 * Arms carousel mode. While armed the button is inverted and a hint says
 * what to do next (click a card to start the carousel there).
 */
export default function ModeToggle({ on, onToggle }: Props) {
  return (
    <>
      {on && <Label className="label--muted toolbar__hint">click a site to start</Label>}
      <button
        type="button"
        className={`mode-toggle ${on ? 'is-on' : ''}`}
        onClick={onToggle}
        aria-pressed={on}
      >
        carousel
      </button>
    </>
  )
}
