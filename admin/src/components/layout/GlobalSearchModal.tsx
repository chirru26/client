'use client'

import { useQuery } from '@tanstack/react-query'
import { Briefcase, FileText, FolderKanban, GraduationCap, Mail, Search, ShieldCheck, Wrench, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminApi } from '@/lib/api'
import QueryError from '@/components/ui/QueryError'

type SearchResult = {
  id?: string | number
  title?: string
  name?: string
  type?: string
  description?: string
  url?: string
}

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

export default function GlobalSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const timeoutId = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => window.clearTimeout(timeoutId)
  }, [isOpen])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedQuery(query.trim()), 250)
    return () => window.clearTimeout(timeoutId)
  }, [query])

  const searchQuery = useQuery({
    queryKey: ['global-search', debouncedQuery],
    queryFn: () => adminApi.search(debouncedQuery),
    enabled: isOpen && debouncedQuery.length >= 2,
    staleTime: 15_000,
  })

  if (!isOpen) return null

  const results = (Array.isArray(searchQuery.data) ? searchQuery.data : []) as SearchResult[]
  const handleClose = () => {
    setQuery('')
    setDebouncedQuery('')
    onClose()
  }
  const handleSelect = (item: SearchResult) => {
    handleClose()
    if (item.url) router.push(item.url)
    else if (item.type === 'project') router.push('/projects')
    else if (item.type === 'skill') router.push('/skills')
    else if (item.type === 'message') router.push('/messages')
    else router.push('/')
  }

  return (
    <div className="modal-backdrop" onClick={handleClose} style={{ zIndex: 9999 }}>
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-search-title"
        onClick={(event) => event.stopPropagation()}
        style={{ maxWidth: 620, padding: 0, borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-light)', gap: 12 }}>
          <Search size={20} color="var(--primary)" aria-hidden="true" />
          <h2 id="global-search-title" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>Search portfolio CMS</h2>
          <input
            ref={inputRef}
            className="form-input"
            aria-label="Search projects, skills, messages and logs"
            placeholder="Search projects, skills, messages, logs..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: '1.05rem', boxShadow: 'none', padding: 0 }}
          />
          <button type="button" className="btn btn-secondary btn-sm btn-icon" onClick={handleClose} aria-label="Close search">
            <X size={16} />
          </button>
        </div>
        <div style={{ maxHeight: 380, overflowY: 'auto', padding: 12 }}>
          {query.trim().length < 2 ? (
            <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '.88rem' }}>
              Type 2 or more characters to search across your portfolio CMS.
            </div>
          ) : query.trim() !== debouncedQuery ? (
            <div className="loading-state" style={{ padding: 24 }} aria-live="polite"><div className="spinner" /><span>Preparing search…</span></div>
          ) : searchQuery.isFetching ? (
            <div className="loading-state" style={{ padding: 24 }} aria-live="polite"><div className="spinner" /><span>Searching CMS records…</span></div>
          ) : searchQuery.isError ? (
            <QueryError message={searchQuery.error instanceof Error ? searchQuery.error.message : 'Search failed. Please try again.'} onRetry={() => { void searchQuery.refetch() }} />
          ) : results.length === 0 ? (
            <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '.88rem' }}>
              No matches found for “{debouncedQuery}”.
            </div>
          ) : (
            <div className="data-list" aria-label="Search results">
              {results.map((item, idx) => {
                const Icon = getIconForType(item.type)
                const title = item.title || item.name || 'Untitled result'
                return (
                  <button
                    type="button"
                    key={item.id ?? `${item.type ?? 'result'}-${idx}`}
                    className="data-row"
                    onClick={() => handleSelect(item)}
                    style={{ width: '100%', textAlign: 'left', cursor: 'pointer', padding: '10px 14px', borderRadius: 10, alignItems: 'center', font: 'inherit', color: 'inherit', background: 'transparent', border: 0 }}
                  >
                    <span aria-hidden="true" style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                      <Icon size={16} />
                    </span>
                    <span className="data-row-main">
                      <span className="data-row-title" style={{ gap: 8 }}>
                        <span style={{ fontWeight: 600 }}>{title}</span>
                        {item.type && <span className="badge badge-purple">{item.type}</span>}
                      </span>
                      {item.description && <span className="data-row-subtitle" style={{ fontSize: '.78rem' }}>{item.description}</span>}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)', fontSize: '.75rem', color: 'var(--text-tertiary)' }}>
          <span>Search portfolio CMS</span>
          <span>Press ESC to close</span>
        </div>
      </section>
    </div>
  )
}
