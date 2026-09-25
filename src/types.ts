/** Which of the pair a slide is. Labels come from the showcase. */
export type Variant = 'a' | 'b'

export interface Showcase {
  id: string
  slug: string
  title: string
  label_a: string
  label_b: string
  is_default: boolean
  /** ISO date (YYYY-MM-DD) or null. */
  due_date: string | null
  /** Term label shown after the date, e.g. "F26". */
  term: string
  /** Sites per student: 2 = a/b pair, 1 = single (label_b unused). */
  slots: 1 | 2
}

const IMAGE_RE = /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i
/** An entry URL that points at an image renders as <img> instead of an iframe. */
export function isImage(url: string): boolean {
  return IMAGE_RE.test(url)
}

/** "22 september F26" — day, lowercase month, term. Empty when there's no date. */
export function formatDue(s: Pick<Showcase, 'due_date' | 'term'>): string {
  if (!s.due_date) return s.term
  const [y, m, d] = s.due_date.split('-').map(Number)
  const month = new Date(y, m - 1, d).toLocaleString('en-US', { month: 'long' }).toLowerCase()
  return `${d} ${month} ${s.term}`.trim()
}

/** One row: a student/group and their two sites. */
export type Rotation = 0 | 90 | 180 | 270

export interface Entry {
  id: string
  showcase_id: string
  name: string
  url_a: string
  url_b: string
  /** Display rotation for each image, clockwise degrees. Ignored for sites. */
  rot_a: Rotation
  rot_b: Rotation
  sort: number
}

/** A single site, flattened out of an Entry for the gallery and carousel. */
export interface Slide {
  id: string
  entryId: string
  student: string
  variant: Variant
  label: string
  url: string
  kind: 'site' | 'image'
  rot: Rotation
}

export function toSlides(showcase: Showcase, entries: Entry[]): Slide[] {
  const variants: Variant[] = showcase.slots === 1 ? ['a'] : ['a', 'b']
  return entries.flatMap((e) =>
    variants.map((variant) => {
      const url = variant === 'a' ? e.url_a : e.url_b
      return {
        id: `${e.id}::${variant}`,
        entryId: e.id,
        student: e.name,
        variant,
        label: variant === 'a' ? showcase.label_a : showcase.label_b,
        url,
        kind: isImage(url) ? 'image' : 'site',
        rot: (variant === 'a' ? e.rot_a : e.rot_b) ?? 0,
      }
    }),
  )
}
