import type {
  Education,
  Experience,
  Profile,
  Project,
  Skill,
  SocialLink,
} from '@/types/portfolio'

const API_URL = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:8080/api/v2'
).replace(/\/$/, '')

const isDev = process.env.NODE_ENV === 'development'

async function get<T>(path: string, fallback: T): Promise<T> {
  const url = `${API_URL}${path}`

  try {
    const response = await fetch(url, {
      ...(isDev ? { cache: 'no-store' } : { next: { revalidate: 1800 } }),
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[serverApi] ${response.status} ${response.statusText}: ${url}`)
      }
      return fallback
    }

    return (await response.json()) as T
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[serverApi] Failed to fetch ${url}`, error)
    }
    return fallback
  }
}

export const serverApi = {
  profile: (): Promise<Profile> => get('/portfolio/profile', {}),
  projects: (): Promise<Project[]> => get('/portfolio/projects', []),
  skills: (): Promise<Skill[]> => get('/portfolio/skills', []),
  experience: (): Promise<Experience[]> => get('/portfolio/experience', []),
  education: (): Promise<Education[]> => get('/portfolio/education', []),
  socialLinks: (): Promise<SocialLink[]> => get('/portfolio/social-links', []),
}

export async function getPortfolioData() {
  const [profile, projects, skills, experience, education, socialLinks] =
    await Promise.all([
      serverApi.profile(),
      serverApi.projects(),
      serverApi.skills(),
      serverApi.experience(),
      serverApi.education(),
      serverApi.socialLinks(),
    ])

  return { profile, projects, skills, experience, education, socialLinks }
}
