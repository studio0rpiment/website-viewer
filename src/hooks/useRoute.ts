import { useCallback, useEffect, useState } from 'react'

/**
 * Tiny path router — no library needed for four routes.
 *   /             front page: course title + list of showcases
 *   /new          create a showcase
 *   /:slug        a showcase
 *   /:slug/edit   its editor
 */
export type Route =
  | { page: 'home' }
  | { page: 'gallery'; slug: string }
  | { page: 'edit'; slug: string }
  | { page: 'new' }

export function parse(pathname: string): Route {
  const [a, b] = pathname.split('/').filter(Boolean)
  if (!a) return { page: 'home' }
  if (a === 'new') return { page: 'new' }
  if (b === 'edit') return { page: 'edit', slug: a }
  return { page: 'gallery', slug: a }
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parse(location.pathname))

  useEffect(() => {
    const onPop = () => setRoute(parse(location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((path: string) => {
    history.pushState(null, '', path)
    setRoute(parse(path))
  }, [])

  return { route, navigate }
}
