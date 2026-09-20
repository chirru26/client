import { motion } from 'framer-motion'
import { GraduationCap, Calendar, Landmark, BookOpen, Sparkles } from 'lucide-react'

export default function Education({ items = [] }) {
  return (
    <section id="education" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="eyebrow">
            <GraduationCap size={14} /> Academic Journey
          </span>
          <h2 className="section-title">
            Formal <span className="accent-highlight">Education</span>
          </h2>
          <p className="section-subtitle">
            Academic background, degrees, and foundational engineering education.
          </p>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="edu-empty-card"
          >
            <div className="edu-empty-icon">
              <Sparkles size={22} />
            </div>
            <h3 className="edu-empty-title">Education History</h3>
            <p className="edu-empty-subtitle">
              Academic qualifications will appear here once configured in the CMS.
            </p>
          </motion.div>
        ) : (
          <div className="edu-grid">
            {items.map((item, index) => {
              let field = item.field
              if (field && field.toLowerCase().includes('computer science')) {
                field = 'Computer Science & Engineering'
              }

              const dateRange = (item.startDate || item.endDate)
                ? `${item.startDate || ''} — ${item.endDate || 'Present'}`
                : null

              return (
                <motion.article
                  className="edu-modern-card"
                  key={item.id || index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="edu-card-topbar">
                    <div className="edu-icon-badge">
                      <GraduationCap size={22} />
                    </div>
                    {dateRange && (
                      <div className="edu-date-badge">
                        <Calendar size={13} />
                        <span>{dateRange}</span>
                      </div>
                    )}
                  </div>

                  <div className="edu-card-content">
                    <h3 className="edu-degree-title">{item.degree}</h3>

                    <div className="edu-institution-row">
                      <Landmark size={15} className="edu-institution-icon" />
                      <span className="edu-institution-name">{item.institution}</span>
                    </div>

                    {field && (
                      <div className="edu-field-tag">
                        <BookOpen size={13} />
                        <span>{field}</span>
                      </div>
                    )}

                    {item.description && (
                      <p className="edu-card-description">{item.description}</p>
                    )}
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

