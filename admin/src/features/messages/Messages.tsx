import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CheckCheck,
  Clock,
  Mail,
  MailOpen,
  RotateCcw,
  Search,
  Send,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { adminApi } from '@/lib/api'
import QueryError from '@/components/ui/QueryError'

export default function Messages() {
  const qc = useQueryClient()
  const q = useQuery({ queryKey: ['messages'], queryFn: adminApi.messages })

  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  if (q.isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <span>Loading inquiries & messages…</span>
      </div>
    )
  }

  if (q.isError && q.data === undefined) {
    return <QueryError message={q.error instanceof Error ? q.error.message : 'Unable to load messages.'} onRetry={() => { void q.refetch() }} />
  }

  const messages = (q.data || []) as any[]

  async function handleToggleRead(id: any, currentRead: boolean) {
    try {
      await adminApi.markMessage(id, !currentRead)
      await qc.invalidateQueries({ queryKey: ['messages'] })
      await qc.invalidateQueries({ queryKey: ['dashboard'] })
    } catch (err: any) {
      alert(err.message || 'Could not update message status.')
    }
  }

  async function handleDeleteMessage(id: any, senderName: string) {
    if (!window.confirm(`Delete message from "${senderName || 'Anonymous'}"?`)) return
    try {
      await adminApi.deleteMessage(id)
      await qc.invalidateQueries({ queryKey: ['messages'] })
      await qc.invalidateQueries({ queryKey: ['dashboard'] })
    } catch (err: any) {
      alert(err.message || 'Could not delete message.')
    }
  }

  const filteredMessages = messages.filter((m) => {
    if (filter === 'unread' && m.read) return false
    if (filter === 'read' && !m.read) return false

    if (!search) return true
    const s = search.toLowerCase()
    return (
      (m.name || '').toLowerCase().includes(s) ||
      (m.email || '').toLowerCase().includes(s) ||
      (m.subject || '').toLowerCase().includes(s) ||
      (m.message || '').toLowerCase().includes(s)
    )
  })

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <Mail size={26} color="var(--accent-amber)" />
            <span>Inquiries &amp; Communications Inbox</span>
          </h1>
          <p>
            Real-time multi-channel triage across Recruiter / Direct Hire, Consulting &amp; Advisory, and Technical Speaking inquiries with verified origin logs.
          </p>
        </div>
      </div>

      <div className="panel">
        <div className="toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              All ({messages.length})
            </button>
            <button
              className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button
              className={`btn btn-sm ${filter === 'read' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('read')}
            >
              Read ({messages.length - unreadCount})
            </button>
          </div>

          <div className="search-box">
            <Search size={16} />
            <input
              className="form-input"
              placeholder="Search sender, subject or text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filteredMessages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <MailOpen size={24} />
            </div>
            <p>No messages found matching your criteria.</p>
          </div>
        ) : (
          <div className="data-list">
            {filteredMessages.map((m) => (
              <article
                className={`message-card ${!m.read ? 'unread' : ''}`}
                key={m.id}
              >
                <div className="message-header">
                  <div className="message-sender">
                    <div className="message-avatar">
                      {(m.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="message-meta">
                      <h4>{m.subject || 'No Subject'}</h4>
                      <span>
                        <strong>{m.name || 'Anonymous'}</strong> &lt;
                        <a
                          href={`mailto:${m.email}`}
                          style={{ color: 'var(--primary)', textDecoration: 'underline' }}
                        >
                          {m.email}
                        </a>
                        &gt;
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {!m.read ? (
                      <span className="badge badge-rose">New / Unread</span>
                    ) : (
                      <span className="badge badge-neutral">Read</span>
                    )}
                    {m.createdAt && (
                      <span
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Clock size={12} />
                        {new Date(m.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="message-body">{m.message}</div>

                <div className="message-actions">
                  <a
                    href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(
                      m.subject || 'Portfolio Inquiry'
                    )}`}
                    className="btn btn-secondary btn-sm"
                  >
                    <Send size={13} />
                    <span>Reply Email</span>
                  </a>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleToggleRead(m.id, m.read)}
                  >
                    {m.read ? (
                      <>
                        <RotateCcw size={13} />
                        <span>Mark Unread</span>
                      </>
                    ) : (
                      <>
                        <CheckCheck size={13} />
                        <span>Mark as Read</span>
                      </>
                    )}
                  </button>

                  <button
                    className="btn btn-danger btn-sm btn-icon"
                    onClick={() => handleDeleteMessage(m.id, m.name)}
                    title="Delete message"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
