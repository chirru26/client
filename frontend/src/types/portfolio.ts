export interface Skill {
  id?: string | number
  name: string
  category?: string | null
}

export interface SocialLink {
  id?: string | number
  platform?: string | null
  label?: string | null
  url: string
}

export interface Profile {
  id?: string | number
  name?: string | null
  headline?: string | null
  bio?: string | null
  location?: string | null
  email?: string | null
  imageUrl?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  instagramUrl?: string | null
  twitterUrl?: string | null
  xUrl?: string | null
  openToWork?: boolean
  [key: string]: unknown
}

export interface Project {
  id?: string | number
  title: string
  slug?: string | null
  description?: string | null
  shortDescription?: string | null
  summary?: string | null
  imageUrl?: string | null
  liveUrl?: string | null
  githubUrl?: string | null
  featured?: boolean
  skills?: Skill[]
  [key: string]: unknown
}

export interface Experience {
  id?: string | number
  position?: string | null
  company?: string | null
  startDate?: string | null
  endDate?: string | null
  current?: boolean
  location?: string | null
  description?: string | null
  [key: string]: unknown
}

export interface Education {
  id?: string | number
  degree?: string | null
  institution?: string | null
  field?: string | null
  startDate?: string | null
  endDate?: string | null
  description?: string | null
  [key: string]: unknown
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export type ToastType = 'info' | 'success' | 'error'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}
