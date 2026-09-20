import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Internship from '../components/Internship'
import Education from '../components/Education'
import SEO from '../components/SEO'

export default function ExperiencePage({ experience = [], education = [] }) {
  return (
    <>
      <SEO
        title="Experience | Chiranjit Das"
        description="Explore the professional work experience, developer internships, and educational background of Chiranjit Das."
        canonical="/experience"
        ogType="profile"
      />

      <main style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <div className="container" style={{ marginBottom: '24px' }}>
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
            <Link to="/" className="project-action-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={15} /> Back to Home
            </Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>Experience</span>
          </nav>
        </div>

        <Internship items={experience} />
        <Education items={education} />
      </main>
    </>
  )
}
