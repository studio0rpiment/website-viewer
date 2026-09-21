import { useState, type FormEvent } from 'react'
import Label from '../components/Label'
import SignIn from '../components/SignIn'
import { useSession } from '../hooks/useSession'
import { createShowcase } from '../lib/data'
import { slugify } from './EditPage'

interface Props {
  navigate: (path: string) => void
}

/** Create a showcase, then jump to its editor. URL-only, like the editor. */
export default function NewPage({ navigate }: Props) {
  const { session, ready } = useSession()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [labelA, setLabelA] = useState('a')
  const [labelB, setLabelB] = useState('b')
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
      })
      navigate(`/${s.slug}/edit`)
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
        <input type="text" placeholder="label a" value={labelA} onChange={(e) => setLabelA(e.target.value)} />
        <input type="text" placeholder="label b" value={labelB} onChange={(e) => setLabelB(e.target.value)} />
        <button type="submit" className="text-button">create</button>
        {error && <Label className="label--muted">{error}</Label>}
      </form>
    </main>
  )
}
