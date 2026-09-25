import { useState, type FormEvent } from 'react'
import Label from '../components/Label'
import SignIn from '../components/SignIn'
import { useSession } from '../hooks/useSession'
import { createShowcase } from '../lib/data'
import { slugify } from './EditPage'
import SlotsPicker from '../components/SlotsPicker'

interface Props {
  navigate: (path: string) => void
}

/** Create a showcase, then jump to its editor. URL-only, like the editor. */
export default function NewPage({ navigate }: Props) {
  const { session, ready } = useSession()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slots, setSlots] = useState<1 | 2>(2)
  const [labelA, setLabelA] = useState('')
  const [labelB, setLabelB] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [term, setTerm] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!ready) return null
  if (!session) return <SignIn />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const s = await createShowcase({
        title,
        slug: slugify(slug || title),
        label_a: labelA,
        label_b: labelB,
        due_date: dueDate || null,
        term,
        slots,
      })
      navigate(`/edit/${s.slug}`)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <main className="notice">
      <form className="signin" onSubmit={submit}>
        <Label className="label--student">new showcase</Label>
        <input type="text" placeholder="title" value={title} required autoFocus onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder={`slug (${slugify(title) || 'from title'})`} value={slug} onChange={(e) => setSlug(e.target.value)} />
        <SlotsPicker value={slots} onChange={setSlots} />
        <input
          type="text"
          placeholder={slots === 2 ? 'caption under the first site (e.g. slop)' : 'caption under each site (optional)'}
          value={labelA}
          onChange={(e) => setLabelA(e.target.value)}
        />
        {slots === 2 && (
          <input
            type="text"
            placeholder="caption under the second site (e.g. mcp+skill)"
            value={labelB}
            onChange={(e) => setLabelB(e.target.value)}
          />
        )}
        <label className="field">
          <span className="label label--muted">due date</span>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>
        <input type="text" placeholder="term (e.g. F26)" value={term} onChange={(e) => setTerm(e.target.value)} />
        <button type="submit" className="text-button">create</button>
        {error && <Label className="label--muted">{error}</Label>}
      </form>
    </main>
  )
}
