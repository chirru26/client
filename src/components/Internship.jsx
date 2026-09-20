import { motion } from 'framer-motion'
import { Briefcase, Building, Calendar, MapPin } from 'lucide-react'

export default function Internship({ items = [] }) {
  return (
    <section id="experience" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="eyebrow">
            <Briefcase size={14} /> Career Journey
          </span>
          <h2 className="section-title">
            Work & <span className="accent-highlight">Experience</span>
          </h2>
          <p className="section-subtitle">
            Professional track record, developer roles, and practical industry experience.
          </p>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              maxWidth: 700,
              margin: '0 auto',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-medium)',
              padding: '36px 28px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
              Open to New Opportunities
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: 500, margin: '0 auto' }}>
              Actively seeking Software Engineer, Java Developer, and Full-Stack development roles. Experience history will be updated as new milestones are reached.
            </p>
          </motion.div>
        ) : (
          <div className="timeline-container">
            <div className="timeline-line" />
            {items.map((item, index) => {
              const isCurrent = item.current || !item.endDate || item.endDate.toLowerCase() === 'present'
              return (
                <motion.article
                  key={item.id || index}
                  className={`timeline-node ${isCurrent ? 'current' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                >
                  <div className="timeline-icon-box">
                    <Building size={22} />
                  </div>

                  <div className="timeline-content-card">
                    <div className="timeline-card-header">
                      <div>
                        <h3 className="timeline-role-title">{item.position}</h3>
                        <div className="timeline-company-name">{item.company}</div>
                      </div>

                      <div className={`timeline-date-badge ${isCurrent ? 'active-badge' : ''}`}>
                        <Calendar size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                        {item.startDate || ''} — {isCurrent ? 'Present' : item.endDate}
                      </div>
                    </div>

                    {item.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: 12 }}>
                        <MapPin size={14} /> {item.location}
                      </div>
                    )}

                    <p className="timeline-desc">{item.description}</p>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
