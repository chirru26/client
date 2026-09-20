import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Project from '../components/Project'
import SEO from '../components/SEO'

export default function ProjectsPage({ projects = [], loading = false }) {
  return (
    <>
      <SEO
        title="Projects | Chiranjit Das"
        description="Explore software engineering projects, backend architectures, and full-stack web applications developed by Chiranjit Das."
        canonical="/projects"
        ogType="website"
      />

      <main style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <div className="container" style={{ marginBottom: '24px' }}>
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
            <Link to="/" className="project-action-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={15} /> Back to Home
            </Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>Projects</span>
          </nav>
        </div>

        <Project projects={projects} loading={loading} />
      </main>
    </>
  )
}
