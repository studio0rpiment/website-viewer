interface Props {
  url: string
  alt: string
  /** Fullscreen: fill the carousel frame, letterboxed. Thumbnail: natural ratio, whole image. */
  interactive?: boolean
}

/**
 * A still image. In the gallery the <img> sets its own height from its native
 * aspect ratio, so portrait and landscape cards take different shapes and
 * nothing is cropped. Browsers apply EXIF orientation before reporting
 * dimensions (`image-orientation: from-image` is the default), so a phone
 * photo shot upright renders upright.
 */
export default function ImageFrame({ url, alt, interactive = false }: Props) {
  if (interactive) {
    return (
      <div className="site-frame">
        <img src={url} alt={alt} className="image-frame image-frame--full" />
      </div>
    )
  }
  return <img src={url} alt={alt} loading="lazy" className="image-frame image-frame--natural" />
}
