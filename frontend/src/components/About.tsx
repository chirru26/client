'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Briefcase, Code, Sparkles } from 'lucide-react'
import type { Profile, Skill } from '@/types/portfolio'

const DEFAULT_SKILLS: Skill[] = [
  { id: 'd1', name: 'Java', category: 'Backend' },
  { id: 'd2', name: 'Spring Boot', category: 'Backend' },
  { id: 'd3', name: 'PostgreSQL', category: 'Databases' },
  { id: 'd4', name: 'Hibernate / JPA', category: 'Backend' },
  { id: 'd5', name: 'React', category: 'Frontend' },
  { id: 'd6', name: 'JavaScript', category: 'Frontend' },
  { id: 'd7', name: 'REST APIs', category: 'Backend' },
  { id: 'd8', name: 'Git & GitHub', category: 'Tools' },
  { id: 'd9', name: 'Docker', category: 'DevOps' },
  { id: 'd10', name: 'Maven', category: 'Tools' },
  { id: 'd11', name: 'JWT Security', category: 'Backend' },
  { id: 'd12', name: 'Tailwind CSS', category: 'Frontend' },
]

interface AboutProps { profile?: Profile; skills?: Skill[] }

export default function About({ profile = {}, skills = [] }: AboutProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const activeSkillsList = skills.length > 0 ? skills : DEFAULT_SKILLS

  const categories = useMemo(() => {
    const set = new Set<string>(['All'])
    activeSkillsList.forEach((skill) => {
      if (skill.category?.trim()) set.add(skill.category.trim())
    })
    return Array.from(set)
  }, [activeSkillsList])

  const filteredSkills = useMemo(() => (
    selectedCategory === 'All'
      ? activeSkillsList
      : activeSkillsList.filter(
          (skill) => skill.category?.toLowerCase() === selectedCategory.toLowerCase(),
        )
  ), [activeSkillsList, selectedCategory])

  const bioText = profile.bio
    ? profile.bio.replace(/with a strong/i, 'with a strong')
    : 'I am a software developer passionate about building reliable, maintainable, and performant web services. With a solid foundation in modern Java, Spring Boot, and reactive frontend architectures, I engineer end-to-end applications designed for scale and clarity.'

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow"><Code size={14} /> Background & Competencies</span>
          <h2 className="section-title">About <span className="accent-highlight">{profile.name || 'Me'}</span></h2>
          <p className="section-subtitle">An overview of my engineering philosophy, background, and core technological competencies.</p>
        </div>
        <div className="about-grid">
          <motion.div className="about-narrative" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <p className="bio-paragraph">{bioText}</p>
            <ul className="about-highlights-list">
              <li className="about-highlight-item"><div className="highlight-icon"><MapPin size={16} /></div><div><strong>Location:</strong> {profile.location || 'India (Open to Worldwide Remote)'}</div></li>
              <li className="about-highlight-item"><div className="highlight-icon"><Briefcase size={16} /></div><div><strong>Specialization:</strong> Backend Architecture, REST API Design, Full-Stack Web</div></li>
              <li className="about-highlight-item"><div className="highlight-icon"><Sparkles size={16} /></div><div><strong>Engineering Values:</strong> Code Reliability, Type Safety, Clean Architecture</div></li>
            </ul>
          </motion.div>
          <motion.div className="skills-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}>
            <div className="skills-card-header"><h3>Technical Arsenal</h3><span className="kbd-badge" style={{ padding: '3px 8px' }}>{filteredSkills.length} {filteredSkills.length === 1 ? 'skill' : 'skills'}</span></div>
            {categories.length > 1 && <div className="category-tabs">{categories.map((category) => <button key={category} className={`category-tab ${selectedCategory === category ? 'active' : ''}`} onClick={() => setSelectedCategory(category)}>{category}</button>)}</div>}
            <div className="skills-matrix">{filteredSkills.map((skill) => <motion.div key={skill.id || skill.name} className="skill-item" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }}><span className="skill-dot" /><span className="skill-name" title={skill.name}>{skill.name}</span></motion.div>)}</div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
