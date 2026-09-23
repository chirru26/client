import type { ContactFormData, Education, Experience, Profile, Project, Skill, SocialLink } from './portfolio'
export type { ContactFormData } from './portfolio'

export type JsonRecord = Record<string, unknown>

export type ApiProfile = Profile
export type ApiProject = Project
export type ApiSkill = Skill
export type ApiExperience = Experience
export type ApiEducation = Education
export type ApiSocialLink = SocialLink

export interface ContactResponse {
  message?: string
  success?: boolean
  [key: string]: unknown
}

export type PortfolioData = {
  profile: Profile
  projects: Project[]
  skills: Skill[]
  experience: Experience[]
  education: Education[]
  socialLinks: SocialLink[]
}

export type ContactRequest = ContactFormData
