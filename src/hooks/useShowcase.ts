import { useCallback, useEffect, useState } from 'react'
import { loadShowcase, type Loaded } from '../lib/data'

type State =
  | { status: 'loading' }
  | { status: 'ready'; data: Loaded }
  | { status: 'missing' }
  | { status: 'error'; message: string }

/** Loads a showcase (by slug, or the default) and exposes a reload + local patch. */
export function useShowcase(slug?: string) {
  const [state, setState] = useState<State>({ status: 'loading' })

  const reload = useCallback(async () => {
    try {
      const data = await loadShowcase(slug)
      setState(data ? { status: 'ready', data } : { status: 'missing' })
    } catch (e) {
      setState({ status: 'error', message: (e as Error).message })
    }
  }, [slug])

  useEffect(() => {
    reload()
  }, [reload])

  /** Apply a local change without a round trip (after a successful write). */
  const patch = useCallback((fn: (d: Loaded) => Loaded) => {
    setState((s) => (s.status === 'ready' ? { status: 'ready', data: fn(s.data) } : s))
  }, [])

  return { state, reload, patch }
}
