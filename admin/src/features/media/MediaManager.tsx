import { useState } from 'react'
import {
  CloudUpload,
  FileText,
  Image as ImageIcon,
  Copy,
  Check,
  Folder,
  Trash2,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import CloudinaryUpload from '@/components/ui/CloudinaryUpload'
import { getImageUrl } from '@/lib/utils/imageUtils'

const RECENT_MEDIA_KEY = 'chirru_recent_cloudinary_media'

function getSavedRecentMedia() {
  try {
    const raw = localStorage.getItem(RECENT_MEDIA_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecentMedia(items: any[]) {
  try {
    localStorage.setItem(RECENT_MEDIA_KEY, JSON.stringify(items.slice(0, 30)))
  } catch {}
}

export default function MediaManager() {
  const [selectedFolder, setSelectedFolder] = useState('projects')
  const [resourceType, setResourceType] = useState('image')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [recentUploads, setRecentUploads] = useState<any[]>(getSavedRecentMedia)
  const [latestUrl, setLatestUrl] = useState('')

  const handleUploadSuccess = (url: string, data: any) => {
    setLatestUrl(url)
    const newEntry = {
      url,
      publicId: data?.publicId || '',
      originalFilename: data?.originalFilename || (resourceType === 'raw' ? 'Document.pdf' : 'Image Upload'),
      folder: selectedFolder,
      resourceType,
      format: data?.format || (resourceType === 'raw' ? 'pdf' : 'image'),
      bytes: data?.bytes || 0,
      createdAt: new Date().toISOString(),
    }
    const updated = [newEntry, ...recentUploads.filter((item) => item.url !== url)]
    setRecentUploads(updated)
    saveRecentMedia(updated)
  }

  const handleCopy = (url: string, index: number) => {
    navigator.clipboard.writeText(url)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleRemoveRecent = (index: number) => {
    const updated = recentUploads.filter((_, i) => i !== index)
    setRecentUploads(updated)
    saveRecentMedia(updated)
  }

  const handleClearAll = () => {
    if (window.confirm('Clear all recent upload logs from this browser? (Files remain safely on Cloudinary)')) {
      setRecentUploads([])
      saveRecentMedia([])
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <CloudUpload size={26} color="var(--primary)" />
            <span>Media & Documents Vault</span>
          </h1>
          <p>
            Cloudinary CDN ingestion bridge with auto-optimization for responsive srcset (320w–1920w) and EXIF stripping.
          </p>
        </div>
      </div>

      <div className="projects-meta-bar">
        <div className="projects-meta-breadcrumbs">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', flexShrink: 0 }} />
          <span style={{ fontWeight: 600, color: '#18181b' }}>CDN Storage Quota:</span>
          <span>4.2 GB of 20 GB Allocated (21%)</span>
        </div>
        <div className="projects-meta-sync">
          <span>Auto WebP / AVIF: <strong style={{ color: '#059669' }}>Enabled</strong></span>
          <span>EXIF Stripping: <strong style={{ color: '#059669' }}>Enforced</strong></span>
          <span>Origin: <strong style={{ color: '#18181b' }}>res.cloudinary.com</strong></span>
        </div>
      </div>

      <div className="grid-split">
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Sparkles size={18} color="var(--primary)" />
              <span>Upload New Asset</span>
            </h3>
          </div>

          <div className="form">
            <div className="form-group">
              <label className="form-label">Asset Type</label>
              <div className="media-type-selector">
                <button
                  type="button"
                  className={`btn ${resourceType === 'image' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => {
                    setResourceType('image')
                    if (selectedFolder === 'resume') setSelectedFolder('projects')
                  }}
                  style={{ justifyContent: 'center' }}
                >
                  <ImageIcon size={16} />
                  <span>Images <small className="media-type-hint">(PNG, WebP)</small></span>
                </button>
                <button
                  type="button"
                  className={`btn ${resourceType === 'raw' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => {
                    setResourceType('raw')
                    if (selectedFolder === 'profile') setSelectedFolder('resume')
                  }}
                  style={{ justifyContent: 'center' }}
                >
                  <FileText size={16} />
                  <span>Documents <small className="media-type-hint">(PDF)</small></span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Destination Cloudinary Folder</label>
              <select
                className="form-select"
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
              >
                {resourceType === 'image' ? (
                  <>
                    <option value="projects">projects (Project screenshots, covers, logos)</option>
                    <option value="profile">profile (Avatar photo, portraits, headers)</option>
                    <option value="certifications">certifications (Badges, credentials)</option>
                    <option value="documents">documents (General image assets)</option>
                  </>
                ) : (
                  <>
                    <option value="resume">resume (CV, Resume documents)</option>
                    <option value="certifications">certifications (PDF certificates, accreditation)</option>
                    <option value="documents">documents (General whitepapers, reports)</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <CloudinaryUpload
                folder={selectedFolder}
                resourceType={resourceType}
                value={latestUrl}
                onChange={handleUploadSuccess}
                label={
                  resourceType === 'image'
                    ? `Upload Image Asset (/${selectedFolder})`
                    : `Upload PDF Document (/${selectedFolder})`
                }
                helpText={
                  resourceType === 'image'
                    ? 'Accepted: JPEG, PNG, WebP (Max 5MB)'
                    : 'Accepted: PDF documents (Max 10MB)'
                }
              />
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="panel-title">
              <Folder size={18} color="var(--primary)" />
              <span>Recent Uploads ({recentUploads.length})</span>
            </h3>
            {recentUploads.length > 0 && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleClearAll}
                style={{ fontSize: '0.78rem', padding: '4px 8px' }}
              >
                Clear History
              </button>
            )}
          </div>

          {recentUploads.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <CloudUpload size={24} />
              </div>
              <p>No media uploaded in this session yet.</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                Uploaded files and their Cloudinary CDN URLs will appear here for 1-click copying.
              </span>
            </div>
          ) : (
            <div className="data-list">
              {recentUploads.map((item, idx) => (
                <div className="data-row" key={idx} style={{ alignItems: 'center' }}>
                  {item.resourceType === 'raw' || item.format === 'pdf' ? (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ef4444',
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={20} />
                    </div>
                  ) : (
                    <img
                      src={getImageUrl(item.url) || ''}
                      alt={item.originalFilename}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                        objectFit: 'cover',
                        border: '1px solid var(--border-light)',
                        flexShrink: 0,
                      }}
                    />
                  )}

                  <div className="data-row-main" style={{ minWidth: 0 }}>
                    <div className="data-row-title" style={{ gap: 6, flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.originalFilename || 'Uploaded Asset'}
                      </span>
                      <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                        {item.folder}
                      </span>
                      <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
                        {item.format?.toUpperCase()}
                      </span>
                    </div>
                    <div
                      className="data-row-subtitle"
                      style={{
                        fontSize: '0.75rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 280,
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      {item.url}
                    </div>
                  </div>

                  <div className="data-row-actions" style={{ gap: 6, flexShrink: 0 }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm btn-icon"
                      onClick={() => handleCopy(item.url, idx)}
                      title="Copy Cloudinary CDN URL"
                    >
                      {copiedIndex === idx ? (
                        <Check size={14} color="var(--primary)" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                    <a
                      href={getImageUrl(item.url) || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm btn-icon"
                      title="Open file in new tab"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm btn-icon"
                      onClick={() => handleRemoveRecent(idx)}
                      title="Remove from history"
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
