'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, FolderGit2, Github } from 'lucide-react'
import Link from 'next/link'
import { getImageUrl } from '@/utils/imageUtils'
import { toProjectSlug } from '@/utils/slugUtils'
import type { Project as ProjectType } from '@/types/portfolio'

interface ProjectProps { projects?: ProjectType[]; loading?: boolean }

function ProjectCardMedia({ project }: { project: ProjectType }) {
  const [imgError, setImgError] = useState(false)
  const imageUrl = getImageUrl(project.imageUrl)
  const hasValidImage = Boolean(imageUrl && !imgError)
  return <div className="project-media-wrapper">
    {hasValidImage ? <Image src={imageUrl!} alt={`Thumbnail preview of ${project.title} project`} className="project-thumbnail" width={640} height={360} sizes="(max-width: 700px) calc(100vw - 64px), 560px" loading="lazy" onError={() => setImgError(true)} /> :
      <div className="project-fallback-container"><div className="project-fallback-icon-wrap"><FolderGit2 size={28} /></div><span className="project-fallback-title">{project.title}</span></div>}
    {project.featured && <span className="project-featured-badge">Featured</span>}
  </div>
}

export default function Project({ projects = [], loading = false }: ProjectProps) {
  const [activeFilter, setActiveFilter] = useState<'featured' | 'all'>('featured')
  const filterOptions = useMemo(() => [{ id: 'featured' as const, label: 'Featured Projects' }, { id: 'all' as const, label: 'All Projects' }], [])
  const filteredProjects = useMemo(() => activeFilter === 'featured' ? projects.filter((p) => p.featured) : projects, [projects, activeFilter])

  return <section id="projects" className="section"><div className="container">
    <div className="section-header"><span className="eyebrow"><FolderGit2 size={14} /> Portfolio Projects</span><h2 className="section-title">Featured <span className="accent-highlight">Projects</span></h2><p className="section-subtitle">Selected software architectures, web applications, and systems built with modern tech stacks.</p></div>
    <div className="projects-filter-bar"><div className="filter-pills">{filterOptions.map((opt) => <button type="button" key={opt.id} className={`filter-pill ${activeFilter === opt.id ? 'active' : ''}`} aria-pressed={activeFilter === opt.id} onClick={() => setActiveFilter(opt.id)}>{opt.label}</button>)}</div><span className="kbd-badge" style={{ padding: '4px 10px' }}>Showing {filteredProjects.length} of {projects.length}</span></div>
    {loading ? <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading projects...</div> :
      filteredProjects.length === 0 ? <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-medium)', color: 'var(--text-muted)' }}>Server Offline. Projects Loading failed.</div> :
      <div className="projects-grid">{filteredProjects.map((project, index) => {
        const desc = !project.description || project.description.length < 6 || project.description === 'dfsb' ? 'A modern full-stack web application developed with Java, Spring Boot, and reactive frontend architecture.' : project.description
        return <motion.article key={project.id || project.slug || index} className="project-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: index * 0.06 }}>
          <ProjectCardMedia project={project} />
          <div className="project-card-body"><h3 className="project-card-title"><Link href={`/projects/${toProjectSlug(project.title)}`} style={{ color: 'inherit', textDecoration: 'none' }}>{project.title}</Link></h3><p className="project-card-desc">{desc}</p>
            {project.skills && project.skills.length > 0 && <div className="project-tech-tags">{project.skills.map((skill) => <span className="tech-chip" key={skill.id || skill.name}>{skill.name}</span>)}</div>}
            <div className="project-card-footer"><div className="project-action-links"><Link href={`/projects/${toProjectSlug(project.title)}`} className="project-action-link"><FolderGit2 size={15} /> Details</Link>{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="project-action-link"><ArrowUpRight size={15} /> Live Demo</a>}{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-action-link"><Github size={15} /> Code</a>}</div></div>
          </div>
        </motion.article>
      })}</div>}
  </div></section>
}
