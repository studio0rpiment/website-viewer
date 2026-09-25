import { useEffect, useRef, useState } from 'react'

/**
 * Natural width/height ratio of an <img>, measured when it loads — and on
 * mount if it already has (a cached image can be complete before React
 * attaches onLoad). The browser applies EXIF orientation before reporting
 * naturalWidth/Height, so this is the ratio as the photo was meant to be seen.
 */
export function useImageRatio(url: string) {
  const ref = useRef<HTMLImageElement>(null)
  const [ratio, setRatio] = useState<number | null>(null)

  const measure = (el: HTMLImageElement) => {
    if (el.naturalWidth && el.naturalHeight) setRatio(el.naturalWidth / el.naturalHeight)
  }

  useEffect(() => {
    setRatio(null)
    if (ref.current?.complete) measure(ref.current)
  }, [url])

  return { ref, ratio, onLoad: (e: React.SyntheticEvent<HTMLImageElement>) => measure(e.currentTarget) }
}
