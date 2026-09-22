import { useState, type FormEvent } from 'react'
import Label from './Label'
import { supabase } from '../lib/supabase'

/** The one account allowed to sign in. Password is set in Supabase → Authentication → Users. */
const ADMIN_EMAIL = 'kevin@orpiment.studio'

/** Password-only sign in for the single admin. No email round trip. */
export default function SignIn() {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password })
    setBusy(false)
    if (error) setMessage(error.message)
    // on success the auth state event re-renders the page
  }

  return (
    <main className="notice">
      <form className="signin" onSubmit={submit}>
        <Label className="label--student">sign in</Label>
        <Label className="label--muted">{ADMIN_EMAIL}</Label>
        <input
          type="password"
          value={password}
          placeholder="password"
          autoFocus
          required
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="text-button" disabled={busy}>
          sign in
        </button>
        {message && <Label className="label--muted">{message}</Label>}
      </form>
    </main>
  )
}
