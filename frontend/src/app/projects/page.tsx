import type { Metadata } from 'next'
import ProjectsPage from '@/pages/ProjectsPage'
import { serverApi } from '@/lib/serverApi'
export const metadata: Metadata={title:'Projects | Chiranjit Das',description:'Explore software engineering projects, backend architectures, and full-stack web applications developed by Chiranjit Das.',alternates:{canonical:'/projects'}}
export default async function Page(){return <ProjectsPage projects={await serverApi.projects()}/>}
