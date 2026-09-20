import type { Metadata } from 'next'
import Home from '@/pages/Home'
import { getPortfolioData } from '@/lib/serverApi'
export const metadata: Metadata = {title:'Chiranjit Das | Java & Backend Developer',description:'Official portfolio of Chiranjit Das, Java & Backend Software Engineer specializing in Spring Boot, REST APIs, Microservices, and scalable web applications.',alternates:{canonical:'/'}}
export default async function Page(){return <Home {...await getPortfolioData()} projectsLoading={false}/>}
