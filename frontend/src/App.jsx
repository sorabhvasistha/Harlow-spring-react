import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import heroImg from './assets/hero.png'
import AuthPanel from './components/AuthPanel'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import './App.css'

const features = [
  { number: '01', title: 'One calm place', text: 'Keep your account, preferences, and important details together without the noise.' },
  { number: '02', title: 'Built for trust', text: 'Secure sessions and clear account controls help you stay in charge of your access.' },
  { number: '03', title: 'Ready when you are', text: 'Create an account in seconds and get back to the things that matter to you.' },
]

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 16 16" className="arrow-icon"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" /></svg>
}

function LandingPage() {
  const [authMode, setAuthMode] = useState(null)
  const { user, loading, setUser, logout } = useAuth()
  const navigate = useNavigate()
  const firstName = user?.name.split(' ')[0]

  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Harlow home"><span className="brand-mark" aria-hidden="true">H</span><span>harlow</span></a>
        <nav className="site-nav" aria-label="Main navigation"><a href="#why-harlow">Why Harlow</a><a href="#security">Security</a><a href="#about">About</a></nav>
        <div className="header-actions">
          {!loading && (user ? <><span className="signed-in">Hi, {firstName}</span><button className="login-link" type="button" onClick={logout}>Log out</button></> : <><button className="login-link" type="button" onClick={() => setAuthMode('login')}>Log in</button><button className="button button-small" type="button" onClick={() => setAuthMode('register')}>Create account</button></>)}
        </div>
      </header>

      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />A simpler way to be you</p>
          <h1 id="hero-title">Your account,<br /><em>your space.</em></h1>
          <p className="hero-description">A thoughtful home for your digital life. Create an account, move with confidence, and keep everything that matters close.</p>
          <div className="hero-actions"><button className="button button-primary" type="button" onClick={() => setAuthMode('register')}>Get started <ArrowIcon /></button><a className="text-link" href="#why-harlow">See how it works <ArrowIcon /></a></div>
          <div className="member-note"><div className="avatar-stack" aria-hidden="true"><span>JM</span><span>AK</span><span>+</span></div><span>{user ? `Your session is protected, ${firstName}.` : 'Join a growing community of thoughtful people.'}</span></div>
        </div>
        <div className="hero-art" aria-label="Harlow account workspace preview"><div className="art-glow" /><div className="art-card art-card-back"><span className="mini-label">YOUR SPACE</span><span className="mini-line" /></div><div className="art-card art-card-front"><div className="card-topline"><span className="mini-label">WELCOME BACK</span><span className="status-dot" /></div><div className="profile-row"><span className="profile-avatar">{user ? user.name[0].toUpperCase() : 'S'}</span><span><strong>{user ? `Good to see you, ${firstName}.` : 'Good to see you.'}</strong><small>Your space is ready.</small></span></div><div className="card-divider" /><div className="card-stat-row"><span><small>ACCOUNT STATUS</small><strong>{user ? 'Protected' : 'Private'}</strong></span><span className="lock-badge" aria-label="Secure account"><svg aria-hidden="true" viewBox="0 0 16 16"><rect x="3.5" y="7" width="9" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg></span></div><img src={heroImg} alt="" className="card-art" /></div><div className="floating-pill"><span className="pill-check">✓</span><span><strong>Session secure</strong><small>Just now</small></span></div></div>
      </section>

      <section className="trust-strip" id="security" aria-label="Security highlights"><span className="trust-label">Made for peace of mind</span><span className="trust-item"><span className="trust-icon">✓</span> Private by design</span><span className="trust-item"><span className="trust-icon">⌁</span> Secure sessions</span><span className="trust-item"><span className="trust-icon">✦</span> Always in your control</span></section>
      <section className="features-section" id="why-harlow" aria-labelledby="features-title"><div className="section-heading"><p className="eyebrow">The Harlow difference</p><h2 id="features-title">Less friction.<br /><em>More living.</em></h2></div><div className="feature-grid">{features.map((feature) => <article className="feature-card" key={feature.number}><span className="feature-number">{feature.number}</span><h3>{feature.title}</h3><p>{feature.text}</p><span className="feature-arrow" aria-hidden="true"><ArrowIcon /></span></article>)}</div></section>
      <section className="closing-section" id="about"><p className="eyebrow">Start with Harlow</p><h2>Make room for<br /><em>what matters.</em></h2><button className="button button-primary" type="button" onClick={() => setAuthMode('register')}>Create your account <ArrowIcon /></button></section>
      <footer className="site-footer"><a className="brand" href="/" aria-label="Harlow home"><span className="brand-mark" aria-hidden="true">H</span><span>harlow</span></a><p>© 2025 Harlow. A little more human.</p><div className="footer-links"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></footer>
      {authMode && <AuthPanel mode={authMode} onClose={() => setAuthMode(null)} onAuthenticated={(authenticatedUser) => { setUser(authenticatedUser); setAuthMode(null); navigate('/dashboard') }} />}
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<ProtectedRoute fallback={<Navigate to="/" replace />}><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
