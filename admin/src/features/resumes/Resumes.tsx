
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Download,
  FileCheck,
  FileText,
  Plus,
  Star,
  Trash2,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { adminApi } from '@/lib/api'
import { getImageUrl } from '@/lib/utils/imageUtils'
import CloudinaryUpload, {
  type UploadResponse,
} from '@/components/ui/CloudinaryUpload'

interface Resume {
  id: string | number
  title: string
  versionLabel?: string
  url: string
  publicId?: string
  active: boolean
  createdAt?: string
}

interface ResumeForm {
  title: string
  versionLabel: string
  url: string
  publicId: string
  active: boolean
}

const DEFAULT_TITLE = 'Chiranjit Das - Software Engineer Resume'

function createInitialForm(version = 'v2026.1'): ResumeForm {
  return {
    title: DEFAULT_TITLE,
    versionLabel: version,
    url: '',
    publicId: '',
    active: true,
  }
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export default function Resumes() {
  const qc = useQueryClient()

  const {
    data: resumes = [],
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery<Resume[]>({
    queryKey: ['resumes'],
    queryFn: () => adminApi.resumes() as Promise<Resume[]>,
  })

  const [formData, setFormData] = useState<ResumeForm>(
    () => createInitialForm(),
  )
  const [busy, setBusy] = useState(false)
  const [busyAction, setBusyAction] = useState<string | null>(null)
  const [error, setError] = useState('')

  const items = resumes

  async function refreshResumeData() {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ['resumes'] }),
      qc.invalidateQueries({ queryKey: ['profile'] }),
    ])
  }

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const title = formData.title.trim()
    const versionLabel = formData.versionLabel.trim()

    if (!title || !versionLabel) {
      setError('Resume title and version are required.')
      return
    }

    if (!formData.url.trim()) {
      setError('Please upload a PDF resume file.')
      return
    }

    if (busy || busyAction) return

    setBusy(true)

    try {
      await adminApi.createResume({
        ...formData,
        title,
        versionLabel,
        url: formData.url.trim(),
      })

      const nextVersion = `v${new Date().getFullYear()}.${items.length + 1}`

      setFormData(createInitialForm(nextVersion))
      await refreshResumeData()
    } catch (err) {
      setError(
        getErrorMessage(err, 'Failed to save resume version.'),
      )
    } finally {
      setBusy(false)
    }
  }

  async function handleSetActive(item: Resume) {
    if (item.active || busy || busyAction) return

    setError('')
    setBusyAction(`activate-${item.id}`)

    try {
      await adminApi.createResume({
        title: item.title,
        versionLabel: item.versionLabel || '',
        url: item.url,
        publicId: item.publicId || '',
        active: true,
      })

      await refreshResumeData()
    } catch (err) {
      setError(
        getErrorMessage(err, 'Failed to activate resume.'),
      )
    } finally {
      setBusyAction(null)
    }
  }

  async function handleDelete(item: Resume) {
    if (busy || busyAction) return

    if (item.active) {
      setError(
        'Activate another resume before deleting the active public resume.',
      )
      return
    }

    const confirmed = window.confirm(
      `Delete resume version "${item.versionLabel || item.title}"? This action cannot be undone.`,
    )

    if (!confirmed) return

    setError('')
    setBusyAction(`delete-${item.id}`)

    try {
      await adminApi.deleteResume(item.id)
      await refreshResumeData()
    } catch (err) {
      setError(
        getErrorMessage(err, 'Could not delete resume.'),
      )
    } finally {
      setBusyAction(null)
    }
  }

  function handleUploadChange(
    url: string,
    data?: UploadResponse | null,
  ) {
    setError('')

    setFormData((prev) => ({
      ...prev,
      url,
      publicId: data?.publicId ?? (url ? prev.publicId : ''),
    }))
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <FileText size={26} color="var(--primary)" />
            <span>Resume Editions & CV Distribution Hub</span>
          </h1>
          <p>
            Manage resume versions, download documents, and choose
            the active public resume.
          </p>
        </div>
      </div>

      <div className="grid-split">
        {/* Upload Resume Form */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Plus size={18} color="var(--primary)" />
              <span>Upload New CV Edition</span>
            </h3>
          </div>

          <form className="form" onSubmit={handleAdd}>
            {error && (
              <div className="alert alert-error" role="alert">
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="resume-title">
                Resume Title *
              </label>
              <input
                id="resume-title"
                className="form-input"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                required
                maxLength={200}
                disabled={busy || !!busyAction}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="resume-version">
                Version Tag / Edition *
              </label>
              <input
                id="resume-version"
                className="form-input"
                value={formData.versionLabel}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    versionLabel: e.target.value,
                  }))
                }
                required
                maxLength={50}
                disabled={busy || !!busyAction}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Upload PDF Document *
              </label>

              <CloudinaryUpload
                folder="resume"
                resourceType="raw"
                value={formData.url}
                onChange={handleUploadChange}
                label="Drop PDF Resume or click to upload"
                helpText="PDF document up to 10MB"
              />

              {formData.url && (
                <p className="data-row-subtitle">
                  Resume document uploaded.
                </p>
              )}
            </div>

            <div className="form-group">
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      active: e.target.checked,
                    }))
                  }
                  disabled={busy || !!busyAction}
                />
                <span
                  style={{
                    fontWeight: 600,
                    color: 'var(--primary)',
                  }}
                >
                  Set as Active Public Resume
                </span>
              </label>

              <p className="data-row-subtitle">
                Controls which resume is served by your public
                portfolio API, provided the backend supports this behavior.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={busy || !!busyAction}
            >
              {busy ? (
                <>
                  <span
                    className="spinner"
                    style={{ width: 16, height: 16 }}
                  />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Save Resume Version</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Available Versions */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <FileCheck size={18} color="var(--primary)" />
              <span>Available Versions ({items.length})</span>
            </h3>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="spinner" />
              <span>Loading resumes…</span>
            </div>
          ) : isError ? (
            <div className="empty-state">
              <FileText size={26} />
              <p>
                {getErrorMessage(
                  queryError,
                  'Failed to load resumes.',
                )}
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => void refetch()}
              >
                Retry
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <FileText size={26} />
              <p>No resume editions created yet.</p>
            </div>
          ) : (
            <div className="data-list">
              {items.map((item) => {
                const actionBusy =
                  busyAction === `activate-${item.id}` ||
                  busyAction === `delete-${item.id}`

                const downloadUrl = getImageUrl(item.url)

                return (
                  <div
                    className="data-row"
                    key={item.id}
                    style={{
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    {/* Resume Icon */}
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 8,
                        background: item.active
                          ? 'rgba(217, 119, 6, 0.12)'
                          : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${
                          item.active
                            ? 'rgba(217, 119, 6, 0.3)'
                            : 'rgba(239, 68, 68, 0.2)'
                        }`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.active
                          ? 'var(--color-accent-amber, #d97706)'
                          : '#ef4444',
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={20} />
                    </div>

                    {/* FIX: Resume text layout starts here */}
                    <div
                      className="data-row-main"
                      style={{
                        minWidth: 0,
                        flex: '1 1 0%',
                      }}
                    >
                      {/* FIX: Stack title and badges vertically */}
                      <div
                        className="data-row-title"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: 6,
                          minWidth: 0,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            lineHeight: 1.4,
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {item.title}
                        </span>

                        <span className="badge badge-purple">
                          {item.versionLabel || 'Edition'}
                        </span>

                        {item.active && (
                          <span
                            className="badge badge-amber"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              width: 'fit-content',
                              maxWidth: '100%',
                            }}
                          >
                            <Star
                              size={11}
                              style={{
                                marginRight: 4,
                                flexShrink: 0,
                              }}
                            />
                            Active Public CV
                          </span>
                        )}
                      </div>

                      {/* FIX: Document text appears below the badges */}
                      <div
                        className="data-row-subtitle"
                        style={{
                          fontSize: '0.76rem',
                          color: 'var(--text-tertiary)',
                          marginTop: 6,
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {item.createdAt
                          ? `Uploaded on ${new Date(
                              item.createdAt,
                            ).toLocaleDateString()}`
                          : 'Resume document'}
                      </div>
                    </div>

                    {/* Actions stay on the right */}
                    <div
                      className="data-row-actions"
                      style={{
                        flexShrink: 0,
                        alignItems: 'center',
                      }}
                    >
                      {!item.active && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => void handleSetActive(item)}
                          disabled={busy || !!busyAction}
                          style={{ fontSize: '0.78rem' }}
                        >
                          {busyAction === `activate-${item.id}`
                            ? 'Activating…'
                            : 'Make Active'}
                        </button>
                      )}

                      <a
                        href={downloadUrl || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm btn-icon"
                        title="Open resume PDF"
                        aria-label={`Open resume ${
                          item.versionLabel || item.title
                        }`}
                        onClick={(e) => {
                          if (!downloadUrl) e.preventDefault()
                        }}
                      >
                        <Download size={14} />
                      </a>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm btn-icon"
                        onClick={() => void handleDelete(item)}
                        disabled={
                          busy ||
                          !!busyAction ||
                          item.active ||
                          actionBusy
                        }
                        title={
                          item.active
                            ? 'Activate another resume before deleting this one'
                            : 'Delete resume'
                        }
                        aria-label={`Delete resume ${
                          item.versionLabel || item.title
                        }`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
