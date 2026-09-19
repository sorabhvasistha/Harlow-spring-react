import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const spaces = [
  { label: 'Profile', detail: 'Your personal details', icon: '01' },
  { label: 'Preferences', detail: 'Shape your Harlow space', icon: '02' },
  { label: 'Security', detail: 'Review your session', icon: '03' },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const firstName = user.name.split(' ')[0]

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <button className="brand dashboard-brand" type="button" onClick={() => navigate('/')} aria-label="Go to Harlow home">
          <span className="brand-mark" aria-hidden="true">H</span>
          <span>harlow</span>
        </button>
        <div className="dashboard-account">
          <span className="dashboard-avatar" aria-hidden="true">{user.name[0].toUpperCase()}</span>
          <span>{user.email}</span>
          <button className="login-link" type="button" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      <section className="dashboard-welcome" aria-labelledby="dashboard-title">
        <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />Your private space</p>
        <h1 id="dashboard-title">Good to see you,<br /><em>{firstName}.</em></h1>
        <p>Everything is ready. Take a moment to make Harlow feel like yours.</p>
      </section>

      <section className="dashboard-status" aria-label="Account status">
        <div><span className="status-dot" /><span><small>ACCOUNT STATUS</small><strong>Protected</strong></span></div>
        <div><span className="dashboard-check">✓</span><span><small>SESSION</small><strong>Active now</strong></span></div>
        <div><span className="dashboard-initial">{user.name[0].toUpperCase()}</span><span><small>SIGNED IN AS</small><strong>{user.name}</strong></span></div>
      </section>

      <section className="dashboard-content" aria-labelledby="spaces-title">
        <div className="dashboard-section-heading"><p className="eyebrow">Make it yours</p><h2 id="spaces-title">Your Harlow<br /><em>space.</em></h2></div>
        <div className="dashboard-grid">{spaces.map((space) => <button className="dashboard-card" type="button" key={space.label}><span className="dashboard-card-number">{space.icon}</span><span><strong>{space.label}</strong><small>{space.detail}</small></span><span className="dashboard-card-arrow" aria-hidden="true">↗</span></button>)}</div>
      </section>
    </main>
  )
}
