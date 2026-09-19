import { useState } from 'react'
import { api } from '../services/api'

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 16 16" className="arrow-icon"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" /></svg>
}

export default function AuthPanel({ mode, onClose, onAuthenticated }) {
  const isRegistering = mode === 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const user = await api(`/api/auth/${isRegistering ? 'register' : 'login'}`, {
        method: 'POST',
        body: JSON.stringify(form),
      })
      onAuthenticated(user)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setBusy(false)
    }
  }

  function update(field) {
    return (event) => setForm({ ...form, [field]: event.target.value })
  }

  return (
    <div className="auth-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="auth-panel" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="auth-close" type="button" onClick={onClose} aria-label="Close">x</button>
        <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />{isRegistering ? 'Start with Harlow' : 'Welcome back'}</p>
        <h2 id="auth-title">{isRegistering ? <>Make room for<br /><em>what matters.</em></> : <>Good to<br /><em>see you.</em></>}</h2>
        <p className="auth-intro">{isRegistering ? 'Create a private space that is yours.' : 'Sign in to return to your space.'}</p>
        <form onSubmit={handleSubmit}>
          {isRegistering && <label>Name<input type="text" value={form.name} onChange={update('name')} autoComplete="name" required /></label>}
          <label>Email<input type="email" value={form.email} onChange={update('email')} autoComplete="email" required /></label>
          <label>Password<input type="password" value={form.password} onChange={update('password')} autoComplete={isRegistering ? 'new-password' : 'current-password'} minLength={8} required /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary auth-submit" type="submit" disabled={busy}>{busy ? 'Please wait...' : isRegistering ? 'Create account' : 'Log in'} <ArrowIcon /></button>
        </form>
      </section>
    </div>
  )
}
