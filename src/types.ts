export type Variant = 'slop' | 'mcp'

export const VARIANT_LABEL: Record<Variant, string> = {
  slop: 'slop',
  mcp: 'mcp+skill',
}

/** One row in students.json */
export interface Student {
  name: string
  slop: string
  mcp: string
}

/** A single site, flattened out of a Student for the carousel */
export interface Slide {
  id: string
  student: string
  variant: Variant
  url: string
}

export function toSlides(students: Student[]): Slide[] {
  return students.flatMap((s) =>
    (['slop', 'mcp'] as Variant[]).map((variant) => ({
      id: `${s.name}::${variant}`,
      student: s.name,
      variant,
      url: s[variant],
    })),
  )
}
