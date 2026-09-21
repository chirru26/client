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
  'https://api.chirru.in/api/v2'
).replace(/\/$/, '')

const PROD_API_URL = 'https://api.chirru.in/api/v2'

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      if (API_URL !== PROD_API_URL) {
        const prodRes = await fetch(`${PROD_API_URL}${path}`, {
          next: { revalidate: 3600 },
          headers: { Accept: 'application/json' },
        }).catch(() => null)
        if (prodRes && prodRes.ok) return (await prodRes.json()) as T
      }
      return fallback
    }
    return (await response.json()) as T
  } catch {
    if (API_URL !== PROD_API_URL) {
      try {
        const prodRes = await fetch(`${PROD_API_URL}${path}`, {
          next: { revalidate: 3600 },
          headers: { Accept: 'application/json' },
        })
        if (prodRes.ok) return (await prodRes.json()) as T
      } catch {
        return fallback
      }
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
