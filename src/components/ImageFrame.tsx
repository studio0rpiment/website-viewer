interface Props {
  url: string
  alt: string
  /** Thumbnail crops to the top like a site; fullscreen shows the whole image. */
  interactive?: boolean
}

/** A still image in the same box a SiteFrame would fill. */
export default function ImageFrame({ url, alt, interactive = false }: Props) {
  return (
    <div className="site-frame">
      <img
        src={url}
        alt={alt}
        loading="lazy"
        className={`image-frame ${interactive ? 'image-frame--full' : ''}`.trim()}
      />
    </div>
  )
}
