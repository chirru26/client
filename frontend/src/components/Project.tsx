'use client'

import type { Project as ProjectType } from '@/types/portfolio'
import { getSafeExternalUrl } from '@/utils/externalUrl'
import { getImageUrl } from '@/utils/imageUtils'
import { toProjectSlug } from '@/utils/slugUtils'
import { motion } from 'framer-motion'
import { ArrowUpRight, FolderGit2, Github } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

interface ProjectProps { projects?: ProjectType[]; loading?: boolean }

function ProjectCardMedia({ project }: { project: ProjectType }) {
  const [imgError, setImgError] = useState(false)
  const [inView, setInView] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageUrl = getImageUrl(project.imageUrl)
  const hasValidImage = Boolean(imageUrl && !imgError)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      const timer = setTimeout(() => setInView(true), 0)
      return () => clearTimeout(timer)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="project-media-wrapper">
      {hasValidImage ? (
        inView ? (
          <Image
            src={imageUrl!}
            alt={`Thumbnail preview of ${project.title} project`}
            className={`project-thumbnail ${loaded ? 'loaded' : ''}`}
            width={640}
            height={360}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 420px"
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="project-thumbnail-placeholder" />
        )
      ) : (
        <div className="project-fallback-container">
          <div className="project-fallback-icon-wrap"><FolderGit2 size={24} /></div>
          <span className="project-fallback-title">{project.title}</span>
        </div>
      )}
      {project.featured && <span className="project-featured-badge">Featured</span>}
    </div>
  )
}

export default function Project({ projects = [], loading = false }: ProjectProps) {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<'featured' | 'all'>('featured')
  const filterOptions = useMemo(() => [{ id: 'featured' as const, label: 'Featured Projects' }, { id: 'all' as const, label: 'All Projects' }], [])
  const filteredProjects = useMemo(() => activeFilter === 'featured' ? projects.filter((p) => p.featured) : projects, [projects, activeFilter])

  return <section id="projects" className="section"><div className="container">
    <div className="section-header"><span className="eyebrow"><FolderGit2 size={14} /> Portfolio Projects</span><h2 className="section-title">Featured <span className="accent-highlight">Projects</span></h2><p className="section-subtitle">Selected software architectures, web applications, and systems built with modern tech stacks.</p></div>
    <div className="projects-filter-bar"><div className="filter-pills">{filterOptions.map((opt) => <button type="button" key={opt.id} className={`filter-pill ${activeFilter === opt.id ? 'active' : ''}`} aria-pressed={activeFilter === opt.id} onClick={() => setActiveFilter(opt.id)}>{opt.label}</button>)}</div><span className="kbd-badge" style={{ padding: '4px 10px' }}>Showing {filteredProjects.length}</span></div>
    {loading ? <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading projects...</div> :
      filteredProjects.length === 0 ? <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-medium)', color: 'var(--text-secondary)' }}><FolderGit2 size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} /><div>No projects published yet. Check back soon!</div></div> :
        <div className="projects-grid">{filteredProjects.map((project, index) => {
          const desc = !project.description || project.description.length < 6 || project.description === 'dfsb' ? 'A modern full-stack web application developed with Java, Spring Boot, and reactive frontend architecture.' : project.description
          const liveUrl = getSafeExternalUrl(project.liveUrl)
          const githubUrl = getSafeExternalUrl(project.githubUrl)
          const projectSlug = toProjectSlug(project.title)

          const handleCardClick = (e: React.MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.closest('a, button')) return
            router.push(`/projects/${projectSlug}`)
          }

          return <motion.article
            key={project.id || project.slug || index}
            className="project-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                router.push(`/projects/${projectSlug}`)
              }
            }}
          >
            <ProjectCardMedia project={project} />
            <div className="project-card-body"><h3 className="project-card-title"><Link href={`/projects/${projectSlug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{project.title}</Link></h3><p className="project-card-desc">{desc}</p>
              {project.skills && project.skills.length > 0 && <div className="project-tech-tags">{project.skills.map((skill) => <span className="tech-chip" key={skill.id || skill.name}>{skill.name}</span>)}</div>}
              {(liveUrl || githubUrl) && (
                <div className="project-card-footer">
                  <div className="project-action-links">
                    {liveUrl && <a href={liveUrl} target="_blank" rel="noreferrer" className="project-action-link" title="Live Demo" onClick={(e) => e.stopPropagation()}><ArrowUpRight size={13} /> <span className="desktop-action-label">Live Demo</span><span className="mobile-action-label">Live</span></a>}
                    {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer" className="project-action-link" title="Source Code" onClick={(e) => e.stopPropagation()}><Github size={13} /> <span>Code</span></a>}
                  </div>
                </div>
              )}
            </div>
          </motion.article>
        })}</div>}
  </div></section>
}
