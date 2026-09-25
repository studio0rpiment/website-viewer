import { useRef, useState } from 'react'
import { uploadImage } from '../lib/storage'

interface Props {
  folder: string
  name: string
  onDone: (url: string) => void
  onError: (message: string) => void
}

/** Text button that opens a file picker, uploads the image, and hands back its URL. */
export default function UploadButton({ folder, name, onDone, onError }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  const pick = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    try {
      onDone(await uploadImage(file, folder, name))
    } catch (e) {
      onError((e as Error).message)
    } finally {
      setBusy(false)
      if (input.current) input.current.value = ''
    }
  }

  return (
    <>
      <button type="button" className="text-button" disabled={busy} onClick={() => input.current?.click()}>
        {busy ? 'uploading…' : 'upload'}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => pick(e.target.files?.[0])}
      />
    </>
  )
}
