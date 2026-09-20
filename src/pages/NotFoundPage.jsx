import { Link } from 'react-router-dom'
import { Home, Compass } from 'lucide-react'
import SEO from '../components/SEO'

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found | Chiranjit Das"
        description="The page you are looking for could not be found. Return to the homepage of Chiranjit Das."
        robots="noindex, follow"
      />

      <main style={{ paddingTop: '140px', paddingBottom: '100px', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '650px', textAlign: 'center' }}>
          <div
            className="hero-card"
            style={{
              padding: '48px 32px',
              borderRadius: 'var(--radius-2xl)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
              }}
            >
              <Compass size={36} />
            </div>

            <span className="eyebrow" style={{ marginBottom: '8px' }}>
              Error 404
            </span>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
              Page Not Found
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '32px', maxWidth: '480px' }}>
              The page you are looking for might have been moved, renamed, or no longer exists. Explore the portfolio from the home page.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/" className="btn btn-primary">
                <Home size={16} /> Return to Homepage
              </Link>
              <Link to="/projects" className="btn btn-secondary">
                View Projects
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
