import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, Copy, Check, ShieldCheck, Github, Linkedin, Instagram, Globe, Loader2 } from 'lucide-react'
import { portfolioApi } from '../api'

export default function Contact({ profile = {}, socialLinks = [], onShowToast }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState({ type: '', text: '' })
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  const github = socialLinks.find((s) => s.platform?.toLowerCase() === 'github')?.url || profile.githubUrl
  const linkedin = socialLinks.find((s) => s.platform?.toLowerCase() === 'linkedin')?.url || profile.linkedinUrl
  const instagram = socialLinks.find((s) => s.platform?.toLowerCase() === 'instagram')?.url || profile.instagramUrl
  const xLink = socialLinks.find((s) => {
    const p = s.platform?.toLowerCase()
    const u = s.url?.toLowerCase() || ''
    return p === 'twitter' || p === 'x' || u.includes('x.com') || u.includes('twitter.com')
  })?.url || profile.twitterUrl || profile.xUrl
  const email = profile.email || 'contact@example.com'

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleCopyEmail() {
    if (!profile.email) return
    navigator.clipboard.writeText(profile.email)
    setCopied(true)
    onShowToast?.('Email address copied to clipboard!', 'success')
    setTimeout(() => setCopied(false), 2500)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setStatus({ type: '', text: '' })

    try {
      await portfolioApi.contact(form)
      setStatus({ type: 'success', text: 'Thank you! Message sent successfully!' })
      setForm({ name: '', email: '', subject: '', message: '' })
      onShowToast?.('Message sent successfully! I will get back to you soon.', 'success')
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Failed to send message. Please try again or email directly.' })
      onShowToast?.(err.message || 'Failed to send message. Please try again.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="eyebrow">
            <Mail size={14} /> Get in Touch
          </span>
          <h2 className="section-title">
            Let's <span className="accent-highlight">Connect</span>
          </h2>
          <p className="section-subtitle">
            Have a project, engineering opportunity, or technical inquiry? Send a direct message or connect via professional channels.
          </p>
        </div>

       <div className="contact-grid">
          {/* Left: Contact Info Card */}
          <motion.div
            className="contact-info-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="contact-direct-card">
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 700 }}>
                Direct Reach
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Feel free to email directly or copy the address for later:
              </p>

              {profile.email && (
                <div className="contact-email-row">
                  <span className="contact-email-text">{profile.email}</span>
                  <button
                    className="copy-email-btn"
                    onClick={handleCopyEmail}
                    type="button"
                    aria-label="Copy email to clipboard"
                  >
                    {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}

            </div>

            {/* Social Links on Contact */}
            <div className="contact-direct-card">
              <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 700 }}>
                Professional Networks
              </h4>
              <div className="hero-socials" style={{ marginTop: 4 }}>
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
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            className="contact-form-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="floating-form-group">
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  className="floating-input"
                  placeholder=" "
                  value={form.name}
                  onChange={handleChange}
                />
                <label className="floating-label" htmlFor="contact-name">
                  Your Name 
                </label>
              </div>

              <div className="floating-form-group">
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  className="floating-input"
                  placeholder=" "
                  value={form.email}
                  onChange={handleChange}
                />
                <label className="floating-label" htmlFor="contact-email">
                  Email Address 
                </label>
              </div>

              <div className="floating-form-group">
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  className="floating-input"
                  placeholder=" "
                  value={form.subject}
                  onChange={handleChange}
                />
                <label className="floating-label" htmlFor="contact-subject">
                  Subject
                </label>
              </div>

              <div className="floating-form-group">
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  className="floating-textarea"
                  placeholder=" "
                  value={form.message}
                  onChange={handleChange}
                />
                <label className="floating-label" htmlFor="contact-message">
                  Message 
                </label>
              </div>

              {status.text && (
                <div className={`form-alert ${status.type}`}>
                  {status.text}
                </div>
              )}

              <button type="submit" className="btn btn-filled" disabled={busy} style={{ width: '100%' }}>
                {busy ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Sending message...
                  </>
                ) : (
                  <>
                    Send Message <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
