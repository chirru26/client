import { AlertCircle, Check, Copy, ExternalLink, FileText, Image as ImageIcon, Link2, Trash2, UploadCloud, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { adminApi } from '../api'
import { getImageUrl } from '../utils/imageUtils'

export default function CloudinaryUpload({
  label = 'Upload File',
  folder = 'projects',
  resourceType = 'image',
  value = '',
  onChange,
  accept,
  helperText,
}) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showManualUrl, setShowManualUrl] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const isDocument = resourceType === 'raw' || folder === 'resume' || folder === 'documents'
  const defaultAccept = isDocument ? '.pdf,application/pdf' : 'image/jpeg,image/png,image/webp'
  const acceptedTypes = accept || defaultAccept

  const maxBytes = isDocument ? 10 * 1024 * 1024 : 5 * 1024 * 1024
  const defaultHelper = isDocument
    ? 'Upload PDF document (Max 10 MB)'
    : 'Upload JPEG, PNG, or WebP (Max 5 MB)'

  const handleFile = async (file) => {
    if (!file) return
    setError('')

    // Client-side validation
    if (file.size > maxBytes) {
      setError(`File size exceeds maximum limit of ${isDocument ? '10 MB' : '5 MB'}`)
      return
    }

    if (isDocument) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setError('Only PDF documents are allowed')
        return
      }
    } else {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setError('Only JPEG, PNG, and WebP images are allowed')
        return
      }
    }

    setUploading(true)
    try {
      const res = await adminApi.uploadMedia(folder, file)
      if (res && res.url) {
        onChange(res.url, res)
      }
    } catch (err) {
      setError(err.message || 'Upload failed. Please check network and file.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (uploading) return
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleCopy = () => {
    if (!value) return
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    onChange('', null)
    setError('')
  }

  return (
    <div className="cloudinary-upload-wrapper">
      <div className="cloudinary-upload-header">
        <label className="form-label" style={{ marginBottom: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {isDocument ? (
              <FileText size={14} color="#0b5c46" />
            ) : (
              <ImageIcon size={14} color="#0b5c46" />
            )}
            <span>{label}</span>
          </span>
        </label>

        <button
          type="button"
          className="cloudinary-mode-toggle"
          onClick={() => setShowManualUrl(!showManualUrl)}
        >
          <Link2 size={12} />
          <span>{showManualUrl ? 'File Upload' : 'Paste URL'}</span>
        </button>
      </div>

      {showManualUrl ? (
        <div style={{ marginTop: '6px' }}>
          <input
            className="form-input"
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={isDocument ? 'https://.../document.pdf' : 'https://.../image.jpg'}
          />
        </div>
      ) : (
        <div style={{ marginTop: '6px' }}>
          {value ? (
            /* Uploaded Preview Card */
            <div className="cloudinary-preview-box">
              {!isDocument ? (
                <div className="cloudinary-img-thumb">
                  <img
                    src={getImageUrl(value)}
                    alt="Uploaded preview"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              ) : (
                <div className="cloudinary-doc-badge">
                  <FileText size={22} color="#0b5c46" />
                  <span className="cloudinary-doc-tag">PDF</span>
                </div>
              )}

              <div className="cloudinary-preview-meta">
                <span className="cloudinary-preview-url" title={value}>
                  {value}
                </span>
                <span className="cloudinary-preview-tag">
                  ✓ Uploaded to Cloudinary ({folder})
                </span>
              </div>

              <div className="cloudinary-preview-actions">
                <a
                  href={getImageUrl(value)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm btn-icon"
                  title="Open live link"
                >
                  <ExternalLink size={14} />
                </a>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm btn-icon"
                  onClick={handleCopy}
                  title="Copy link"
                >
                  {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm btn-icon"
                  onClick={handleClear}
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ) : (
            /* Drag and Drop Upload Zone */
            <div
              className={`cloudinary-dropzone ${isDragOver ? 'dragover' : ''} ${uploading ? 'uploading' : ''
                }`}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => {
                if (!uploading && fileInputRef.current) {
                  fileInputRef.current.click()
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedTypes}
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFile(e.target.files[0])
                  }
                }}
              />

              {uploading ? (
                <div className="cloudinary-uploading-box">
                  <div className="spinner" style={{ width: 22, height: 22, borderColor: 'rgba(11, 92, 70, 0.2)', borderTopColor: '#0b5c46' }} />
                  <span className="cloudinary-uploading-text">
                    Uploading {isDocument ? 'document' : 'image'} to Cloudinary…
                  </span>
                </div>
              ) : (
                <div className="cloudinary-drop-content">
                  <div className="cloudinary-icon-circle">
                    <UploadCloud size={20} />
                  </div>
                  <div className="cloudinary-drop-text">
                    <span className="cloudinary-drop-action">
                      Click to upload <strong>{isDocument ? 'document' : 'image'}</strong>
                    </span>
                    <span className="cloudinary-drop-sub">or drag and drop here</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="cloudinary-helper-text">
            {helperText || defaultHelper}
          </div>
        </div>
      )}

      {error && (
        <div className="cloudinary-error-banner">
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-icon"
            onClick={() => setError('')}
            style={{ marginLeft: 'auto', padding: 2 }}
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  )
}
