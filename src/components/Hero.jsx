import { motion } from 'framer-motion'
import { ArrowUpRight, Code2, FileText, Github, Globe, Linkedin, Instagram, Mail, MapPin, Send, User } from 'lucide-react'
import { portfolioApi } from '../api'
import { getImageUrl } from '../utils/imageUtils'

export default function Hero({ profile = {}, socialLinks = [], projectCount = 0, skillCount = 0 }) {
  function handleResumeClick() {
    portfolioApi.trackEvent('resume_download', { source: 'hero_cta' })
  }

  const github = socialLinks.find((s) => s.platform?.toLowerCase() === 'github')?.url || profile.githubUrl
  const linkedin = socialLinks.find((s) => s.platform?.toLowerCase() === 'linkedin')?.url || profile.linkedinUrl
  const instagram = socialLinks.find((s) => s.platform?.toLowerCase() === 'instagram')?.url || profile.instagramUrl
  const xLink = socialLinks.find((s) => {
    const p = s.platform?.toLowerCase()
    const u = s.url?.toLowerCase() || ''
    return p === 'twitter' || p === 'x' || u.includes('x.com') || u.includes('twitter.com')
  })?.url || profile.twitterUrl || profile.xUrl
  const email = profile.email

  // Clean headline if default is informal
  let headline = profile.headline || 'Aspiring Java & Backend Software Engineer'

  return (
    <section id="home" className="hero-section section">
      <div className="container hero-container-landscape">
        <motion.div
          className="hero-card hero-card-landscape"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Left Column: Identity, Bio & Actions */}
          <div className="hero-landscape-left">
            {/* Status Indicator */}
            {profile.openToWork !== false && (
              <div className="status-pill hero-status-pill">
                <span className="status-indicator" />
                <span>Available for new opportunities</span>
              </div>
            )}

            {/* Profile Info Row */}
            <div className="hero-landscape-profile">
              <div className="avatar-wrapper hero-avatar-landscape">
                {profile.imageUrl ? (
                  <img
                    src={getImageUrl(profile.imageUrl)}
                    alt={`${profile.name || 'Chiranjit Das'} - Java & Backend Software Engineer`}
                    className="avatar-img"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                ) : (
                  <div className="avatar-fallback"><User size={60} /></div>
                )}
              </div>
              <div className="hero-landscape-info">
                <h1 className="hero-profile-name">{profile.name || 'Chiranjit Das'}</h1>
                <p className="hero-profile-headline">{headline}</p>
                <div className="hero-location-badge">
                  <MapPin size={14} />
                  <span>{profile.location || 'India · Open to Remote'}</span>
                </div>
              </div>
            </div>

            {/* Actions & Socials */}
            <div className="hero-landscape-actions-wrap">
              <div className="hero-actions hero-landscape-actions">
                <a className="btn btn-primary" href="#projects">
                  Explore Projects <ArrowUpRight size={16} />
                </a>

                <a
                  className="btn btn-secondary"
                  href={portfolioApi.resumeDownloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleResumeClick}
                >
                  <FileText size={15} /> Resume
                </a>

                <a className="btn btn-ghost" href="#contact">
                  <Send size={15} /> Contact
                </a>
              </div>

              <div className="hero-socials hero-landscape-socials">
                {github && (
                  <a href={github} target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="GitHub">
                    <Github size={18} />
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="LinkedIn">
                    <Linkedin size={18} />
                  </a>
                )}
                {xLink && (
                  <a href={xLink} target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="X (Twitter)">
                    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {instagram && (
                  <a href={instagram} target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Instagram">
                    <Instagram size={18} />
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="social-icon-btn" aria-label="Email">
                    <Mail size={18} />
                  </a>
                )}
                {socialLinks
                  .filter((s) => {
                    const p = s.platform?.toLowerCase()
                    const u = s.url?.toLowerCase() || ''
                    return !['github', 'linkedin', 'instagram', 'twitter', 'x'].includes(p) && !u.includes('x.com') && !u.includes('twitter.com')
                  })
                  .map((s) => (
                    <a
                      key={s.id || s.url}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="social-icon-btn"
                      aria-label={s.label || s.platform}
                      title={s.label || s.platform}
                    >
                      <Globe size={18} />
                    </a>
                  ))}
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hero-landscape-divider" />

          {/* Right Column: Metrics & Focus Areas */}
          <div className="hero-landscape-right">
            {/* Quick Metrics */}
            <div className="hero-stats-grid">
              <div className="stat-box">
                <div className="stat-number">{projectCount > 0 ? `${projectCount}` : '0'}</div>
                <div className="stat-label">Projects Built</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{skillCount > 0 ? `${skillCount}` : '10+'}</div>
                <div className="stat-label">Core Techs</div>
              </div>
            </div>

            {/* Focus Tags */}
            <div className="hero-focus-section">
              <div className="hero-focus-heading hero-landscape-focus-heading">
                <Code2 size={14} color="var(--primary-light)" />
                <span>Core Focus Areas</span>
              </div>
              <div className="hero-tags-box hero-landscape-tags">
                <span className="tag-badge">Backend Architecture</span>
                <span className="tag-badge">Spring Boot & Java</span>
                <span className="tag-badge">RESTful APIs</span>
                <span className="tag-badge">PostgreSQL</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
