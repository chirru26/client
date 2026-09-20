import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Github, FolderGit2, Code2, ExternalLink, Layers } from 'lucide-react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import { findProjectBySlug, toProjectSlug } from '../utils/slugUtils'
import { getImageUrl } from '../utils/imageUtils'

export default function ProjectDetailsPage({ projects = [], loading = false }) {
  const { slug } = useParams()
  const project = findProjectBySlug(projects, slug)

  if (loading && !project) {
    return (
      <main style={{ paddingTop: '120px', minHeight: '80vh', textAlign: 'center' }}>
        <div className="container">
          <p style={{ color: 'var(--text-muted)' }}>Loading project details...</p>
        </div>
      </main>
    )
  }

  if (!project) {
    return (
      <main style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <SEO
          title="Project Not Found | Chiranjit Das"
          description="The requested project could not be found in the portfolio."
          robots="noindex, follow"
        />
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Project Not Found
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            We couldn't locate any project matching &quot;{slug}&quot;. It might have been moved or updated.
          </p>
          <Link to="/projects" className="btn btn-primary">
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </div>
      </main>
    )
  }

  const projectSlug = toProjectSlug(project.title)
  const canonicalUrl = `/projects/${projectSlug}`
  const projectImageUrl = getImageUrl(project.imageUrl) || 'https://www.chirru.in/og-image.jpg'
  
  // Format description
  const cleanDesc =
    project.description && project.description.length > 6 && project.description !== 'dfsb'
      ? project.description
      : 'A modern full-stack application developed with Java, Spring Boot, and reactive architecture.'

  const metaDesc =
    cleanDesc.length > 155 ? `${cleanDesc.substring(0, 152)}...` : cleanDesc

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: metaDesc,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform, Web',
    image: projectImageUrl,
    author: {
      '@type': 'Person',
      name: 'Chiranjit Das',
      url: 'https://www.chirru.in/',
    },
    url: `https://www.chirru.in${canonicalUrl}`,
  }

  return (
    <>
      <SEO
        title={`${project.title} | Chiranjit Das`}
        description={metaDesc}
        canonical={canonicalUrl}
        ogType="article"
        ogImage={projectImageUrl}
        twitterImage={projectImageUrl}
        schema={softwareSchema}
      />

      <main style={{ paddingTop: '100px', minHeight: '85vh', paddingBottom: '80px' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '0.88rem' }}>
            <Link to="/" className="project-action-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Home
            </Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <Link to="/projects" className="project-action-link">
              Projects
            </Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>{project.title}</span>
          </nav>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="hero-card"
            style={{ padding: '36px 32px' }}
          >
            {/* Header / H1 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <FolderGit2 size={14} /> Software Project
                </span>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {project.title}
                </h1>
              </div>

              {project.featured && (
                <span className="project-featured-badge" style={{ position: 'static' }}>
                  Featured Project
                </span>
              )}
            </div>

            {/* Project Media */}
            {project.imageUrl && (
              <div
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  margin: '20px 0 32px 0',
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-surface-container)',
                }}
              >
                <img
                  src={getImageUrl(project.imageUrl)}
                  alt={`Screenshot and overview of ${project.title} project`}
                  style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', display: 'block' }}
                  loading="eager"
                  decoding="async"
                />
              </div>
            )}

            {/* Section: Overview */}
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="var(--primary)" /> Overview
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {cleanDesc}
              </p>
            </section>

            {/* Section: Tech Stack */}
            {project.skills && project.skills.length > 0 && (
              <section style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Code2 size={18} color="var(--primary)" /> Technology Stack
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {project.skills.map((skill) => (
                    <span key={skill.id || skill.name} className="tech-chip" style={{ fontSize: '0.88rem', padding: '6px 14px' }}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Section: Project Links */}
            <section style={{ paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
                Project Links
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    aria-label={`Visit live demo for ${project.title}`}
                  >
                    <ArrowUpRight size={16} /> View Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    aria-label={`View ${project.title} source code on GitHub`}
                  >
                    <Github size={16} /> View Source on GitHub
                  </a>
                )}
                <Link to="/projects" className="btn btn-ghost" aria-label="Return to all projects">
                  <ArrowLeft size={16} /> All Projects
                </Link>
              </div>
            </section>
          </motion.article>
        </div>
      </main>
    </>
  )
}
