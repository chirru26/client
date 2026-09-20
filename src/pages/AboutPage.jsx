import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import About from '../components/About'
import SEO from '../components/SEO'

export default function AboutPage({ profile = {}, skills = [] }) {
  return (
    <>
      <SEO
        title="About Chiranjit Das | Java Developer"
        description="Learn about Chiranjit Das, a Java & Backend Software Engineer passionate about clean code, Spring Boot, REST APIs, and scalable distributed systems."
        canonical="/about"
        ogType="profile"
      />

      <main style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <div className="container" style={{ marginBottom: '24px' }}>
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
            <Link to="/" className="project-action-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={15} /> Back to Home
            </Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>About</span>
          </nav>
        </div>

        <About profile={profile} skills={skills} />
      </main>
    </>
  )
}
