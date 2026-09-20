import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Contact from '../components/Contact'
import SEO from '../components/SEO'

export default function ContactPage({ profile = {}, socialLinks = [], onShowToast }) {
  return (
    <>
      <SEO
        title="Contact Chiranjit Das"
        description="Connect with Chiranjit Das for software engineering opportunities, Java & Spring Boot backend projects, or technical inquiries."
        canonical="/contact"
        ogType="website"
      />

      <main style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <div className="container" style={{ marginBottom: '24px' }}>
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
            <Link to="/" className="project-action-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={15} /> Back to Home
            </Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>Contact</span>
          </nav>
        </div>

        <Contact profile={profile} socialLinks={socialLinks} onShowToast={onShowToast} />
      </main>
    </>
  )
}
