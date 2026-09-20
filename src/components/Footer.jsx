import { ArrowUp, Github, Linkedin, Instagram, Mail, Globe } from 'lucide-react'

export default function Footer({ profile = {}, socialLinks = [] }) {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const github = socialLinks.find((s) => s.platform?.toLowerCase() === 'github')?.url || profile.githubUrl
  const linkedin = socialLinks.find((s) => s.platform?.toLowerCase() === 'linkedin')?.url || profile.linkedinUrl
  const instagram = socialLinks.find((s) => s.platform?.toLowerCase() === 'instagram')?.url || profile.instagramUrl
  const xLink = socialLinks.find((s) => {
    const p = s.platform?.toLowerCase()
    const u = s.url?.toLowerCase() || ''
    return p === 'twitter' || p === 'x' || u.includes('x.com') || u.includes('twitter.com')
  })?.url || profile.twitterUrl || profile.xUrl

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">
            chirru<span>.</span>
          </div>
          <p className="footer-copy" style={{ marginTop: 4 }}>
            © {new Date().getFullYear()} {profile.name || 'Chirru'}.  All rights reserved.
          </p>
        </div>

        {/* Social Links */}
        <div className="footer-socials">
          {github && (
            <a href={github} target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="GitHub" style={{ width: 36, height: 36 }}>
              <Github size={16} />
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="LinkedIn" style={{ width: 36, height: 36 }}>
              <Linkedin size={16} />
            </a>
          )}
          {xLink && (
            <a href={xLink} target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="X (Twitter)" style={{ width: 36, height: 36 }}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          )}
          {instagram && (
            <a href={instagram} target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Instagram" style={{ width: 36, height: 36 }}>
              <Instagram size={16} />
            </a>
          )}
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="social-icon-btn" aria-label="Email" style={{ width: 36, height: 36 }}>
              <Mail size={16} />
            </a>
          )}

          <button className="back-to-top-btn" onClick={scrollToTop} aria-label="Scroll to top of page">
            <ArrowUp size={14} /> Back to top
          </button>
        </div>
      </div>
    </footer>
  )
}
