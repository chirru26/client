import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { adminApi } from '../api'

function getActionBadge(action = '') {
  const act = action.toUpperCase()
  if (act.includes('DELETE')) return 'badge-danger'
  if (act.includes('CREATE') || act.includes('UPLOAD')) return 'badge-emerald'
  if (act.includes('UPDATE') || act.includes('SAVE')) return 'badge-purple'
  if (act.includes('LOGIN')) return 'badge-blue'
  return 'badge-slate'
}

export default function AuditLogs() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [filterAction, setFilterAction] = useState('ALL')

  const query = useQuery({
    queryKey: ['audit-logs', page],
    queryFn: () => adminApi.auditLogs(page, 25),
    staleTime: 10000,
  })

  const rawData = query.data
  const logs = Array.isArray(rawData) ? rawData : rawData?.content || []
  const totalPages = rawData?.totalPages || 1
  const totalElements = rawData?.totalElements || logs.length

  const filteredLogs = logs.filter((log) => {
    const act = (log.action || '').toUpperCase()
    if (filterAction !== 'ALL' && !act.includes(filterAction)) return false
    if (!search) return true
    const text = JSON.stringify(log).toLowerCase()
    return text.includes(search.toLowerCase())
  })

  return (
    <>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <ShieldCheck size={26} color="var(--primary)" />
            <span>Audit Logs Trail</span>
          </h1>
          <p>
            Immutable history of administrative mutations, security logins, and CMS operations.
          </p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <h3 className="panel-title">
            <Activity size={18} color="var(--primary)" />
            <span>Recorded Operations ({totalElements})</span>
          </h3>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="search-box" style={{ maxWidth: 240 }}>
              <Search size={15} />
              <input
                className="form-input"
                placeholder="Filter logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: '6px 10px 6px 32px', fontSize: '0.84rem' }}
              />
            </div>

            <select
              className="form-select"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '0.84rem', width: 'auto' }}
            >
              <option value="ALL">All Actions</option>
              <option value="LOGIN">Logins</option>
              <option value="CREATE">Creations</option>
              <option value="UPDATE">Updates</option>
              <option value="DELETE">Deletions</option>
              <option value="UPLOAD">Media Uploads</option>
            </select>
          </div>
        </div>

        {query.isLoading ? (
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading audit records…</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="empty-state">
            <ShieldCheck size={28} />
            <p>No audit log events found.</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Actor</th>
                    <th>IP Address</th>
                    <th>Entity / Details</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td>
                        <span className={`badge ${getActionBadge(item.action)}`}>
                          {item.action || 'OPERATION'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem' }}>
                          <User size={14} color="var(--text-tertiary)" />
                          <span style={{ fontWeight: 500 }}>{item.actorEmail || item.actor || 'admin'}</span>
                        </div>
                      </td>
                      <td>
                        <code style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {item.ipAddress || item.ip || '127.0.0.1'}
                        </code>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.84rem', maxWidth: 380, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.details || item.resource || item.entityType || '—'}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                          <Clock size={13} />
                          <span>
                            {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Page {page + 1} of {totalPages}
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
