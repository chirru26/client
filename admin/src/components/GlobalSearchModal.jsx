import { useQuery } from '@tanstack/react-query'
import {
  Briefcase,
  FileText,
  FolderKanban,
  GraduationCap,
  Mail,
  Search,
  ShieldCheck,
  User,
  Wrench,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../api'

function getIconForType(type = '') {
  const t = type.toLowerCase()
  if (t.includes('project')) return FolderKanban
  if (t.includes('skill')) return Wrench
  if (t.includes('exp')) return Briefcase
  if (t.includes('edu')) return GraduationCap
  if (t.includes('message')) return Mail
  if (t.includes('resume')) return FileText
  if (t.includes('audit')) return ShieldCheck
  return Search
}

export default function GlobalSearchModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [isOpen])

  const searchQuery = useQuery({
    queryKey: ['global-search', query],
    queryFn: () => adminApi.search(query),
    enabled: query.trim().length >= 2,
  })

  if (!isOpen) return null

  const results = searchQuery.data || []

  const handleSelect = (item) => {
    onClose()
    if (item.url) {
      navigate(item.url)
    } else if (item.type === 'project') {
      navigate('/projects')
    } else if (item.type === 'skill') {
      navigate('/skills')
    } else if (item.type === 'message') {
      navigate('/messages')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-card"
        style={{
          maxWidth: 620,
          padding: 0,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-light)', gap: 12 }}>
          <Search size={20} color="var(--primary)" />
          <input
            ref={inputRef}
            className="form-input"
            placeholder="Search projects, skills, messages, logs... (Press Esc to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '1.05rem',
              boxShadow: 'none',
              padding: 0,
            }}
          />
          <button type="button" className="btn btn-secondary btn-sm btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div style={{ maxHeight: 380, overflowY: 'auto', padding: '12px' }}>
          {query.trim().length < 2 ? (
            <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.88rem' }}>
              Type 2 or more characters to search across everything in the portfolio CMS...
            </div>
          ) : searchQuery.isLoading ? (
            <div className="loading-state" style={{ padding: '24px' }}>
              <div className="spinner" />
              <span>Searching CMS records…</span>
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.88rem' }}>
              No matches found for "{query}".
            </div>
          ) : (
            <div className="data-list">
              {results.map((item, idx) => {
                const Icon = getIconForType(item.type)
                return (
                  <div
                    key={item.id || idx}
                    className="data-row"
                    onClick={() => handleSelect(item)}
                    style={{
                      cursor: 'pointer',
                      padding: '10px 14px',
                      borderRadius: 10,
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: 'var(--bg-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={16} />
                    </div>

                    <div className="data-row-main">
                      <div className="data-row-title" style={{ gap: 8 }}>
                        <span style={{ fontWeight: 600 }}>{item.title || item.name}</span>
                        {item.type && <span className="badge badge-purple">{item.type}</span>}
                      </div>
                      {item.description && (
                        <div className="data-row-subtitle" style={{ fontSize: '0.78rem' }}>
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          <span>Search portfolio CMS</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  )
}
