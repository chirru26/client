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

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) return fallback
    return (await response.json()) as T
  } catch {
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
