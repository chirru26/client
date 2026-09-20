import type { Metadata } from 'next'
import ExperiencePage from '@/pages/ExperiencePage'
import { serverApi } from '@/lib/serverApi'
export const metadata: Metadata = { title:'Experience | Chiranjit Das', description:'Explore the professional work experience, developer internships, and educational background of Chiranjit Das.', alternates:{canonical:'/experience'} }
export default async function Page(){const [experience,education]=await Promise.all([serverApi.experience(),serverApi.education()]);return <ExperiencePage experience={experience} education={education}/>}
