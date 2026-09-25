import { useCallback, useEffect, useState } from 'react'

/**
 * Tiny path router — no library needed for five routes.
 *   /             front page: course title + list of showcases
 *   /:slug        a showcase
 *   /edit         admin index (URL only, sign in required)
 *   /edit/new     create a showcase
 *   /edit/:slug   edit a showcase
 */
export type Route =
  | { page: 'home' }
  | { page: 'gallery'; slug: string }
  | { page: 'admin' }
  | { page: 'new' }
  | { page: 'edit'; slug: string }

export function parse(pathname: string): Route {
  const [a, b] = pathname.split('/').filter(Boolean)
  if (!a) return { page: 'home' }
  if (a === 'edit') {
    if (!b) return { page: 'admin' }
    if (b === 'new') return { page: 'new' }
    return { page: 'edit', slug: b }
  }
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
