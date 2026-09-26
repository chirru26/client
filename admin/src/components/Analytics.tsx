import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  BarChart3,
  Calendar,
  Download,
  Eye,
  FolderKanban,
  Globe,
  Smartphone,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { adminApi } from '../api'

export default function Analytics() {
  const [days, setDays] = useState(30)

  const dashQuery = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: adminApi.analyticsDashboard,
  })

  const timeSeriesQuery = useQuery({
    queryKey: ['analytics-timeseries', days],
    queryFn: () => adminApi.analytics(days),
  })

  const isBusy = dashQuery.isLoading || timeSeriesQuery.isLoading

  const dashData = dashQuery.data || {}
  const rawEvents = timeSeriesQuery.data || []

  // Aggregate stats from events
  const pageViews = rawEvents.filter((e) => e.eventType === 'page_view' || !e.eventType).length
  const projectViews = rawEvents.filter((e) => e.eventType === 'project_view').length
  const resumeDownloads = rawEvents.filter((e) => e.eventType === 'resume_download').length
  const totalEvents = rawEvents.length

  // Top paths
  const pathCounts = {}
  const deviceCounts = {}
  const countryCounts = {}

  rawEvents.forEach((ev) => {
    const p = ev.path || '/'
    pathCounts[p] = (pathCounts[p] || 0) + 1

    const d = ev.device || 'Desktop / Browser'
    deviceCounts[d] = (deviceCounts[d] || 0) + 1

    const c = ev.country || 'Global / Unknown'
    countryCounts[c] = (countryCounts[c] || 0) + 1
  })

  const topPaths = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  const topDevices = Object.entries(deviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <BarChart3 size={26} color="var(--primary)" />
            <span>Portfolio Analytics</span>
          </h1>
          <p>
            Real-time insights into visitor traffic, project impressions, and resume downloads.
          </p>
        </div>

        <div className="analytics-time-picker">
          {[
            { label: '7 Days', val: 7 },
            { label: '30 Days', val: 30 },
            { label: '90 Days', val: 90 },
            { label: '1 Year', val: 365 },
          ].map((opt) => (
            <button
              key={opt.val}
              type="button"
              className={`btn btn-sm ${days === opt.val ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDays(opt.val)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isBusy ? (
        <div className="loading-state">
          <div className="spinner" />
          <span>Aggregating analytics data…</span>
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="analytics-kpi-grid">
            <div className="analytics-kpi-card">
              <div className="analytics-kpi-header">
                <span className="analytics-kpi-title">Total Interactions</span>
                <div className="analytics-kpi-icon emerald">
                  <Activity size={18} />
                </div>
              </div>
              <div className="analytics-kpi-val">{dashData.totalViews || totalEvents || 0}</div>
              <span className="analytics-kpi-sub">
                <TrendingUp size={13} color="var(--primary)" /> {totalEvents} events in last {days}d
              </span>
            </div>

            <div className="analytics-kpi-card">
              <div className="analytics-kpi-header">
                <span className="analytics-kpi-title">Page Views</span>
                <div className="analytics-kpi-icon blue">
                  <Eye size={18} />
                </div>
              </div>
              <div className="analytics-kpi-val">{dashData.pageViews || pageViews || 0}</div>
              <span className="analytics-kpi-sub">{pageViews} recent views</span>
            </div>

            <div className="analytics-kpi-card">
              <div className="analytics-kpi-header">
                <span className="analytics-kpi-title">Project Clicks</span>
                <div className="analytics-kpi-icon purple">
                  <FolderKanban size={18} />
                </div>
              </div>
              <div className="analytics-kpi-val">{dashData.projectViews || projectViews || 0}</div>
              <span className="analytics-kpi-sub">{projectViews} project views</span>
            </div>

            <div className="analytics-kpi-card">
              <div className="analytics-kpi-header">
                <span className="analytics-kpi-title">Resume Downloads</span>
                <div className="analytics-kpi-icon amber">
                  <Download size={18} />
                </div>
              </div>
              <div className="analytics-kpi-val">{dashData.resumeDownloads || resumeDownloads || 0}</div>
              <span className="analytics-kpi-sub">{resumeDownloads} recent CV downloads</span>
            </div>
          </div>

          <div className="grid-split" style={{ marginTop: '24px' }}>
            {/* Top Visited Pages & Sections */}
            <div className="panel">
              <div className="panel-header">
                <h3 className="panel-title">
                  <Globe size={18} color="var(--primary)" />
                  <span>Top Visited Routes & Projects</span>
                </h3>
              </div>

              {topPaths.length === 0 ? (
                <div className="empty-state">
                  <Globe size={24} />
                  <p>No visitor path telemetry recorded yet.</p>
                </div>
              ) : (
                <div className="data-list">
                  {topPaths.map(([path, count]) => {
                    const pct = Math.round((count / (totalEvents || 1)) * 100)
                    return (
                      <div className="data-row" key={path} style={{ display: 'block', padding: '12px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{path}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {count} hits ({pct}%)
                          </span>
                        </div>
                        <div className="analytics-bar-bg">
                          <div className="analytics-bar-fill" style={{ width: `${Math.max(pct, 4)}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Devices & Geographies */}
            <div className="panel">
              <div className="panel-header">
                <h3 className="panel-title">
                  <Smartphone size={18} color="var(--primary)" />
                  <span>Devices & Traffic Sources</span>
                </h3>
              </div>

              <div style={{ padding: '8px 16px' }}>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 12 }}>
                  Device Breakdown
                </h4>
                {topDevices.map(([device, count]) => (
                  <div key={device} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.86rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{device}</span>
                    <span className="badge badge-slate">{count} visits</span>
                  </div>
                ))}

                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginTop: 20, marginBottom: 12 }}>
                  Visitor Geographies
                </h4>
                {topCountries.map(([country, count]) => (
                  <div key={country} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.86rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{country}</span>
                    <span className="badge badge-purple">{count} hits</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
