import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Globe,
  Save,
  Search,
  Share2,
  Sparkles,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { adminApi } from '../api'
import CloudinaryUpload from './CloudinaryUpload'
import { getImageUrl } from '../utils/imageUtils'

const PAGES = [
  { id: 'home', label: 'Home Page' },
  { id: 'projects', label: 'Projects Showcase' },
  { id: 'skills', label: 'Skills & Tech Stack' },
  { id: 'experience', label: 'Experience & Career' },
  { id: 'contact', label: 'Contact & Inquiries' },
]

export default function SeoSettings() {
  const qc = useQueryClient()
  const [selectedPage, setSelectedPage] = useState('home')

  const q = useQuery({
    queryKey: ['seo', selectedPage],
    queryFn: () => adminApi.seo(selectedPage),
  })

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    canonicalUrl: '',
    ogImageUrl: '',
    noIndex: false,
  })

  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  useEffect(() => {
    if (q.data) {
      setFormData({
        title: q.data.title || '',
        description: q.data.description || '',
        keywords: q.data.keywords || '',
        canonicalUrl: q.data.canonicalUrl || '',
        ogImageUrl: q.data.ogImageUrl || '',
        noIndex: Boolean(q.data.noIndex),
      })
    } else if (!q.isLoading) {
      setFormData({
        title: 'Chiranjit Das | Full Stack Software Engineer',
        description: 'Portfolio and engineering projects by Chiranjit Das.',
        keywords: 'software engineer, java, spring boot, react, full stack',
        canonicalUrl: 'https://chirru.me',
        ogImageUrl: '',
        noIndex: false,
      })
    }
  }, [q.data, q.isLoading, selectedPage])

  async function handleSave(e) {
    e.preventDefault()
    setBusy(true)
    setMsg({ text: '', type: '' })
    try {
      await adminApi.saveSeo(selectedPage, formData)
      setMsg({ text: 'SEO settings updated successfully!', type: 'success' })
      await qc.invalidateQueries({ queryKey: ['seo', selectedPage] })
    } catch (err) {
      setMsg({ text: err.message || 'Failed to save SEO settings.', type: 'error' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <Search size={26} color="var(--primary)" />
            <span>SEO & OpenGraph Metadata</span>
          </h1>
          <p>
            Configure search engine indexing, OpenGraph preview cards, and social share tags per page.
          </p>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="tabs" style={{ marginBottom: '20px' }}>
        {PAGES.map((page) => (
          <button
            key={page.id}
            type="button"
            className={`tab ${selectedPage === page.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedPage(page.id)
              setMsg({ text: '', type: '' })
            }}
          >
            {page.label}
          </button>
        ))}
      </div>

      <div className="grid-split">
        {/* Editor Form */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Sparkles size={18} color="var(--primary)" />
              <span>Metadata for /{selectedPage}</span>
            </h3>
          </div>

          <form className="form" onSubmit={handleSave}>
            {msg.text && (
              <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {msg.text}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Meta Title Tag ({formData.title.length}/60 chars)
              </label>
              <input
                className="form-input"
                placeholder="e.g. Chiranjit Das | Full Stack Software Engineer"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Meta Description ({formData.description.length}/160 chars)
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Concise overview of your portfolio page for search engine results..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Keywords (Comma separated)</label>
              <input
                className="form-input"
                placeholder="java, spring boot, react, postgresql, cloud"
                value={formData.keywords}
                onChange={(e) => setFormData((prev) => ({ ...prev, keywords: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Canonical URL</label>
              <input
                className="form-input"
                type="url"
                placeholder="https://chirru.me/projects"
                value={formData.canonicalUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, canonicalUrl: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Social Share Card Image (OpenGraph / Twitter)</label>
              <CloudinaryUpload
                folder="documents"
                resourceType="image"
                value={formData.ogImageUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, ogImageUrl: url }))}
                label="Upload 1200x630 Social Banner"
                helpText="PNG or JPG recommended (1200x630 px)"
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem' }}>
                <input
                  type="checkbox"
                  checked={formData.noIndex}
                  onChange={(e) => setFormData((prev) => ({ ...prev, noIndex: e.target.checked }))}
                />
                <span style={{ fontWeight: 500 }}>
                  Hide from Search Engines (Set <code>noindex, nofollow</code>)
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16 }} />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save SEO Metadata</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Search Engine & Social Preview Panel */}
        <div className="panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <Globe size={18} color="var(--primary)" />
              <span>Google SERP Preview</span>
            </h3>
          </div>

          <div style={{ padding: '16px' }}>
            <div className="serp-preview-card">
              <div className="serp-site-info">
                <span className="serp-domain">chirru.me</span>
                <span className="serp-slug">› {selectedPage === 'home' ? '' : selectedPage}</span>
              </div>
              <div className="serp-title">
                {formData.title || 'Page Title Not Set'}
              </div>
              <div className="serp-desc">
                {formData.description || 'No description provided. Search engines will generate a snippet from page content.'}
              </div>
            </div>

            <h4 style={{ fontSize: '0.84rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginTop: 24, marginBottom: 12 }}>
              <Share2 size={14} style={{ display: 'inline', marginRight: 6 }} />
              OpenGraph Preview (Twitter / LinkedIn)
            </h4>

            <div className="og-preview-card">
              {formData.ogImageUrl ? (
                <img src={getImageUrl(formData.ogImageUrl)} alt="Social Share Card" className="og-image-preview" />
              ) : (
                <div className="og-placeholder">
                  <Globe size={32} color="var(--text-tertiary)" />
                  <span>No OG Image Assigned</span>
                </div>
              )}
              <div className="og-content">
                <span className="og-domain">CHIRRU.ME</span>
                <div className="og-title">{formData.title || 'Page Title'}</div>
                <div className="og-desc">{formData.description || 'Page Description'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
