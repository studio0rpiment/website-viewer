/** Which of the pair a slide is. Labels come from the showcase. */
export type Variant = 'a' | 'b'

export interface Showcase {
  id: string
  slug: string
  title: string
  label_a: string
  label_b: string
  is_default: boolean
}

/** One row: a student/group and their two sites. */
export interface Entry {
  id: string
  showcase_id: string
  name: string
  url_a: string
  url_b: string
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
}

export function toSlides(showcase: Showcase, entries: Entry[]): Slide[] {
  return entries.flatMap((e) =>
    (['a', 'b'] as Variant[]).map((variant) => ({
      id: `${e.id}::${variant}`,
      entryId: e.id,
      student: e.name,
      variant,
      label: variant === 'a' ? showcase.label_a : showcase.label_b,
      url: variant === 'a' ? e.url_a : e.url_b,
    })),
  )
}
