import { useState } from 'react'

interface Props {
  url: string
  alt: string
  /** Fullscreen: fill the carousel frame, letterboxed. Thumbnail: fit a square, whole image. */
  interactive?: boolean
}

/**
 * A still image. In the gallery it sits in a square cell: the image's longest
 * side spans the cell, so a portrait is as tall as a landscape is wide — every
 * image gets the same "longest dimension" regardless of orientation. Nothing is
 * cropped. Orientation comes from the browser, which applies EXIF rotation
 * before reporting naturalWidth/Height.
 */
export default function ImageFrame({ url, alt, interactive = false }: Props) {
  const [landscape, setLandscape] = useState<boolean | null>(null)

  if (interactive) {
    return (
      <div className="site-frame">
        <img src={url} alt={alt} className="image-frame image-frame--full" />
      </div>
    )
  }
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      onLoad={(e) => setLandscape(e.currentTarget.naturalWidth >= e.currentTarget.naturalHeight)}
      className={`image-frame image-frame--natural ${
        landscape === null ? '' : landscape ? 'is-landscape' : 'is-portrait'
      }`.trim()}
    />
  )
}
