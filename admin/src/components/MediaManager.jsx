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
import CloudinaryUpload from './CloudinaryUpload'
import { getImageUrl } from '../utils/imageUtils'

const RECENT_MEDIA_KEY = 'chirru_recent_cloudinary_media'

function getSavedRecentMedia() {
  try {
    const raw = localStorage.getItem(RECENT_MEDIA_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecentMedia(items) {
  try {
    localStorage.setItem(RECENT_MEDIA_KEY, JSON.stringify(items.slice(0, 30)))
  } catch {}
}

export default function MediaManager() {
  const [selectedFolder, setSelectedFolder] = useState('projects')
  const [resourceType, setResourceType] = useState('image')
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [recentUploads, setRecentUploads] = useState(getSavedRecentMedia)
  const [latestUrl, setLatestUrl] = useState('')

  const handleUploadSuccess = (url, data) => {
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

  const handleCopy = (url, index) => {
    navigator.clipboard.writeText(url)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleRemoveRecent = (index) => {
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
            <span>Media & Documents</span>
          </h1>
          <p>
            Upload, optimize, and store portfolio images and PDF documents directly via Cloudinary CDN.
          </p>
        </div>
      </div>

      <div className="grid-split">
        {/* Left Column: Upload Hub */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Sparkles size={18} color="var(--primary)" />
              <span>Upload New Asset</span>
            </h3>
          </div>

          <div className="form">
            {/* Asset Type Switcher */}
            <div className="form-group">
              <label className="form-label">Asset Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
                  <span>Images (PNG/JPG/WebP)</span>
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
                  <span>Documents (PDF)</span>
                </button>
              </div>
            </div>

            {/* Target Folder Selection */}
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

            {/* Cloudinary Upload Dropzone */}
            <div className="form-group">
              <label className="form-label">
                {resourceType === 'image' ? 'Upload Image' : 'Upload Document'}
              </label>
              <CloudinaryUpload
                folder={selectedFolder}
                resourceType={resourceType}
                value={latestUrl}
                onChange={handleUploadSuccess}
                label={
                  resourceType === 'image'
                    ? `Drop image for /${selectedFolder} or click to browse`
                    : `Drop PDF document for /${selectedFolder} or click to browse`
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

        {/* Right Column: Upload History & CDN Quick Links */}
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
                      src={getImageUrl(item.url)}
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
                      href={getImageUrl(item.url)}
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
