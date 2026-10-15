export type JsonObject = Record<string, any>

export interface AuthResponse {
  accessToken?: string
  refreshToken?: string
  [key: string]: any
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | null
}

export interface UserProfile {
  id?: string | number
  name?: string
  title?: string
  bio?: string
  avatarUrl?: string
  email?: string
  phone?: string
  location?: string
  [key: string]: any
}

export interface ProjectItem {
  id: string | number
  title: string
  description?: string
  liveUrl?: string
  githubUrl?: string
  imageUrl?: string
  featured?: boolean
  tags?: string[]
  [key: string]: any
}
