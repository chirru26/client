import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Check,
  ExternalLink,
  FolderKanban,
  Github,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
  Wrench,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { adminApi } from '@/lib/api'
import CloudinaryUpload from '@/components/ui/CloudinaryUpload'
import { getImageUrl } from '@/lib/utils/imageUtils'
import QueryError from '@/components/ui/QueryError'

export default function Projects() {
  const qc = useQueryClient()
  const q = useQuery({ queryKey: ['projects'], queryFn: adminApi.projects })
  const skillsQuery = useQuery({ queryKey: ['skills'], queryFn: adminApi.skills })

  const [editingId, setEditingId] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [featured, setFeatured] = useState(false)
  const [liveUrl, setLiveUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [selectedSkillIds, setSelectedSkillIds] = useState<any[]>([])
  const [newSkillName, setNewSkillName] = useState('')
  const [addingSkill, setAddingSkill] = useState(false)
  const [search, setSearch] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)

  if (q.isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <span>Loading projects…</span>
      </div>
    )
  }

  if (q.isError && q.data === undefined) {
    return <QueryError message={q.error instanceof Error ? q.error.message : 'Unable to load projects.'} onRetry={() => { void q.refetch() }} />
  }

  const allSkills = (skillsQuery.data || []) as any[]

  const toggleSkill = (skillId: any) => {
    setSelectedSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    )
  }

  async function handleQuickAddSkill() {
    const trimmed = newSkillName.trim()
    if (!trimmed) return
    setAddingSkill(true)
    try {
      const created = (await adminApi.createSkill({
        name: trimmed,
        category: 'BACKEND',
      })) as any
      await qc.invalidateQueries({ queryKey: ['skills'] })
      if (created?.id) {
        setSelectedSkillIds((prev) => [...prev, created.id])
      }
      setNewSkillName('')
    } catch (err: any) {
      setError(err.message || 'Failed to add technology tag.')
    } finally {
      setAddingSkill(false)
    }
  }

  const handleStartEdit = (project: any) => {
    setEditingId(project.id)
    setTitle(project.title || '')
    setDescription(project.description || '')
    setFeatured(Boolean(project.featured))
    setLiveUrl(project.liveUrl || '')
    setGithubUrl(project.githubUrl || '')
    setImageUrl(project.imageUrl || '')
    setSelectedSkillIds((project.skills || []).map((s: any) => s.id || s))
    setError('')
    setSuccess('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setFeatured(false)
    setLiveUrl('')
    setGithubUrl('')
    setImageUrl('')
    setSelectedSkillIds([])
    setNewSkillName('')
    setError('')
    setSuccess('')
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setSuccess('')

    const payload = {
      title,
      description,
      featured,
      displayOrder: 0,
      liveUrl: liveUrl || undefined,
      githubUrl: githubUrl || undefined,
      imageUrl: imageUrl || undefined,
      skillIds: selectedSkillIds,
      technologyIds: [],
    }

    try {
      if (editingId) {
        await adminApi.updateProject(editingId, payload)
        setSuccess('Project updated successfully!')
      } else {
        await adminApi.createProject(payload)
        setSuccess('Project added successfully!')
      }
      handleCancelEdit()
      await qc.invalidateQueries({ queryKey: ['projects'] })
      await qc.invalidateQueries({ queryKey: ['dashboard'] })
    } catch (err: any) {
      setError(err.message || 'Failed to save project.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDeleteProject(id: any, projectTitle: string) {
    if (!window.confirm(`Are you sure you want to delete "${projectTitle}"?`)) return
    try {
      await adminApi.deleteProject(id)
      if (editingId === id) {
        handleCancelEdit()
      }
      await qc.invalidateQueries({ queryKey: ['projects'] })
      await qc.invalidateQueries({ queryKey: ['dashboard'] })
    } catch (err: any) {
      alert(err.message || 'Could not delete project.')
    }
  }

  const projects = (q.data || []) as any[]
  const filteredProjects = projects.filter((p) =>
    (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.skills || []).some((s: any) => (s.name || '').toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <FolderKanban size={26} color="var(--primary)" />
            <span>Projects Showcase Hub</span>
          </h1>
          <p>Author, manage, and curate flagship engineering artifacts and showcase repositories.</p>
        </div>
      </div>

      <div className="projects-meta-bar">
        <div className="projects-meta-breadcrumbs">
          <span>Portfolio Hub</span>
          <span style={{ color: '#a1a1aa' }}>/</span>
          <span style={{ fontWeight: 600, color: '#18181b' }}>Projects Showcase</span>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '1px 8px',
            borderRadius: 4,
            background: '#ffffff',
            color: '#d97706',
            border: '1px solid rgba(217, 119, 6, 0.3)',
          }}>
            Module Active
          </span>
        </div>
        <div className="projects-meta-sync">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#d97706' }} />
            Auto-Sync: Active
          </span>
          <span>Branch: <strong style={{ color: '#18181b', fontFamily: 'var(--font-mono)' }}>main-showcase</strong></span>
          <span>Last commit: <span style={{ color: '#18181b' }}>14m ago by CD</span></span>
        </div>
      </div>

      <div className="grid-split">
        <div className="panel">
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 className="panel-title" style={{ margin: 0 }}>
                {editingId ? (
                  <>
                    <Pencil size={18} color="var(--primary)" />
                    <span>Edit Project</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} color="var(--primary)" />
                    <span>Create New Project</span>
                  </>
                )}
              </h3>
              <span style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 4,
                background: '#fef3c7',
                color: '#92400e',
                border: '1px solid rgba(217, 119, 6, 0.25)',
              }}>
                {editingId ? 'EDIT_MODE' : 'DRAFT_FORM'}
              </span>
            </div>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCancelEdit}
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <form className="form" onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="form-group">
              <label className="form-label">
                Project Title <span style={{ color: 'var(--color-accent-amber, #d97706)' }}>*</span>
              </label>
              <input
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Decentralized Metrics Pipeline"
                required
              />
              <span style={{ fontSize: '0.74rem', color: '#71717a', marginTop: 2 }}>
                Appears as the primary headline across all public showcase grids.
              </span>
            </div>

            <div className="form-group">
              <CloudinaryUpload
                label="Project Cover / Screenshot"
                folder="projects"
                resourceType="image"
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                helperText="Upload JPEG, PNG, or WebP preview (Max 5 MB)"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  <Wrench size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                  Technologies & Skills Tags
                </label>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {selectedSkillIds.length} selected
                </span>
              </div>

              {allSkills.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '6px 0 10px' }}>
                  {allSkills.map((skill) => {
                    const isSelected = selectedSkillIds.includes(skill.id)
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => toggleSkill(skill.id)}
                        style={{
                          borderRadius: 20,
                          fontSize: '0.78rem',
                          padding: '3px 12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {isSelected && <Check size={12} />}
                        <span>{skill.name}</span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                  No technologies created yet. Add one below to tag this project.
                </p>
              )}

              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                <input
                  className="form-input"
                  placeholder="Add custom technology tag (e.g. Java, React, Docker)..."
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleQuickAddSkill()
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleQuickAddSkill}
                  disabled={!newSkillName.trim() || addingSkill}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Plus size={13} />
                  <span>{addingSkill ? 'Adding…' : 'Add Tag'}</span>
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Live Demo URL</label>
                <input
                  className="form-input"
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://app.domain.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">GitHub Repository</label>
                <input
                  className="form-input"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the architectural highlights, challenges solved, and key features..."
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span>Feature this project on hero/homepage</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-amber" disabled={busy} style={{ flex: 1 }}>
                {busy ? (
                  <>
                    <div className="spinner" style={{ width: 16, height: 16 }} />
                    <span>{editingId ? 'Updating…' : 'Adding…'}</span>
                  </>
                ) : (
                  <>
                    {editingId ? <Check size={16} /> : <Plus size={16} />}
                    <span>{editingId ? 'Update Project' : 'Add Project'}</span>
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  <RotateCcw size={15} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <span>Existing Projects ({filteredProjects.length})</span>
            </h3>
          </div>

          <div className="toolbar" style={{ marginBottom: '16px' }}>
            <div className="search-box" style={{ maxWidth: '100%' }}>
              <Search size={16} />
              <input
                className="form-input"
                placeholder="Search projects by title, desc, or technology..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FolderKanban size={24} />
              </div>
              <p>No projects found matching your query.</p>
            </div>
          ) : (
            <div className="data-list">
              {filteredProjects.map((project: any) => (
                <div
                  className="data-row"
                  key={project.id}
                  style={
                    editingId === project.id
                      ? { borderColor: '#d97706', background: '#fffbeb' }
                      : undefined
                  }
                >
                  {project.imageUrl && (
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 6,
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '1px solid var(--border-card)',
                      }}
                    >
                      <img
                        src={getImageUrl(project.imageUrl) || ''}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <div className="data-row-main">
                    <div className="data-row-title">
                      <span>{project.title}</span>
                      {project.featured && (
                        <span className="badge badge-amber">
                          <Star size={11} fill="currentColor" />
                          Featured Hero
                        </span>
                      )}
                      {editingId === project.id && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: '#92400e',
                            background: '#fef3c7',
                            padding: '1px 6px',
                            borderRadius: 4,
                            border: '1px solid rgba(217, 119, 6, 0.3)',
                          }}
                        >
                          Editing
                        </span>
                      )}
                    </div>

                    {project.skills && project.skills.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4, marginBottom: 4 }}>
                        {project.skills.map((skill: any) => (
                          <span
                            key={skill.id || skill.name}
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              background: 'var(--bg-card, #f8fafc)',
                              color: 'var(--text-secondary, #475569)',
                              padding: '1px 8px',
                              borderRadius: 10,
                              border: '1px solid var(--border-card, #e2e8f0)',
                            }}
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="data-row-subtitle">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: 'var(--primary)' }}
                        >
                          <ExternalLink size={12} /> Live
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: 'var(--text-secondary)' }}
                        >
                          <Github size={12} /> Code
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="data-row-actions" style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleStartEdit(project)}
                      title="Edit Project"
                    >
                      <Pencil size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      className="btn btn-danger btn-sm btn-icon"
                      onClick={() => handleDeleteProject(project.id, project.title)}
                      title="Delete Project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
