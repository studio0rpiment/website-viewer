import { useRef, useState } from 'react'
import { addEntry, saveEntry } from '../lib/data'
import { uploadImage } from '../lib/storage'
import type { Entry, Showcase } from '../types'

interface Props {
  showcase: Showcase
  /** Current row count, so new rows sort after existing ones. */
  count: number
  onAdded: (entries: Entry[]) => void
  onError: (message: string) => void
}

/** "Abigail.jpg" → "Abigail"; "jack_lee-final.png" → "Jack Lee Final". */
export function nameFromFile(filename: string): string {
  const stem = filename.replace(/\.[^.]+$/, '')
  return stem
    .split(/[\s_\-.]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/**
 * Pick a set of image files; each becomes a student row named after the file,
 * with the image uploaded into slot a. Files are processed in name order so the
 * gallery matches the folder.
 */
export default function BulkImport({ showcase, count, onAdded, onError }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<string | null>(null)

  const run = async (list: FileList | null) => {
    if (!list || list.length === 0) return
    const files = [...list].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
    const added: Entry[] = []
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const name = nameFromFile(file.name)
        setProgress(`${i + 1} / ${files.length} — ${name}`)
        const row = await addEntry(showcase.id, count + i)
        const url = await uploadImage(file, showcase.slug, name.toLowerCase().replace(/\s+/g, '-'))
        await saveEntry({ id: row.id, name, url_a: url })
        added.push({ ...row, name, url_a: url })
      }
    } catch (e) {
      onError((e as Error).message)
    } finally {
      setProgress(null)
      if (input.current) input.current.value = ''
      if (added.length) onAdded(added)
    }
  }

  return (
    <>
      <button type="button" className="text-button" disabled={progress !== null} onClick={() => input.current?.click()}>
        {progress ?? '+ add from images'}
      </button>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => run(e.target.files)} />
    </>
  )
}
