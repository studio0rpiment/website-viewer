import Icon from './Icon'
import type { ThemeMode } from '../themes'

interface Props {
  mode: ThemeMode
  onToggle: () => void
}

/** Moon while dark, sun while light. Click flips. */
export default function ThemeToggle({ mode, onToggle }: Props) {
  const next = mode === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      className="icon-button"
      onClick={onToggle}
      aria-label={`switch to ${next} theme`}
      title={`${next} theme`}
    >
      <Icon name={mode === 'dark' ? 'moon' : 'sun'} />
    </button>
  )
}
