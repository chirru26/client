'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight, Code2, FileText, Mail, MapPin, Send, User } from 'lucide-react'
import { portfolioApi } from '@/api'
import { getImageUrl } from '@/utils/imageUtils'
import { getSafeMailto } from '@/utils/externalUrl'
import { getOrderedSocialLinks } from '@/utils/socialUtils'
import { SocialIcon } from '@/components/SocialIcon'
import type { Profile, SocialLink } from '@/types/portfolio'

interface HeroProps {
  profile?: Profile
  socialLinks?: SocialLink[]
  projectCount?: number
  skillCount?: number
}

export default function Hero({ profile = {}, socialLinks = [], projectCount = 0, skillCount = 0 }: HeroProps) {
  function handleResumeClick() {
    void portfolioApi.trackEvent('resume_download', { source: 'hero_cta' })
  }

  const orderedSocials = useMemo(() => getOrderedSocialLinks(socialLinks, profile), [socialLinks, profile])
  const safeEmail = getSafeMailto(profile.email)

  const [imgError, setImgError] = useState(false)
  const avatarUrl = getImageUrl(profile.imageUrl)
  const showAvatar = Boolean(avatarUrl && !imgError)

  // Clean headline if default is informal
  const headline = profile.headline || 'Aspiring Java & Backend Software Engineer'

  return (
    <section id="home" className="hero-section section">
      <div className="container hero-container-landscape">
        <div className="hero-card hero-card-landscape">
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
                {showAvatar ? (
                  <Image
                    src={avatarUrl!}
                    alt={`${profile.name || 'Chiranjit Das'} - Java & Backend Software Engineer`}
                    className="avatar-img"
                    width={160}
                    height={160}
                    sizes="160px"
                    priority
                    fetchPriority="high"
                    onError={() => setImgError(true)}
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
                {orderedSocials.map((link) => (
                  <a
                    key={link.id || `${link.platform}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon-btn"
                    aria-label={link.label}
                    title={link.label}
                  >
                    <SocialIcon link={link} size={18} />
                  </a>
                ))}
                {safeEmail && (
                  <a href={safeEmail} className="social-icon-btn" aria-label="Email" title="Email">
                    <Mail size={18} />
                  </a>
                )}
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
        </div>
      </div>
    </section>
  )
}
