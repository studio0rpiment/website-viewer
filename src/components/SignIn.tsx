import { useState, type FormEvent } from 'react'
import Label from './Label'
import { supabase } from '../lib/supabase'

/** Magic-link sign in. Supabase emails a link; clicking it returns here signed in. */
export default function SignIn() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setStatus('sending')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: location.href },
    })
    if (error) {
      setStatus('error')
      setMessage(error.message)
    } else {
      setStatus('sent')
    }
  }

  return (
    <main className="notice">
      <form className="signin" onSubmit={submit}>
        <Label className="label--student">sign in</Label>
        {status === 'sent' ? (
          <Label className="label--muted">check {email} for a link</Label>
        ) : (
          <>
            <input
              type="email"
              value={email}
              placeholder="email"
              autoFocus
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="text-button" disabled={status === 'sending'}>
              send link
            </button>
            {status === 'error' && <Label className="label--muted">{message}</Label>}
          </>
        )}
      </form>
    </main>
  )
}
