import type { Metadata } from 'next'
import AboutPage from '@/pages/AboutPage'
import { serverApi } from '@/lib/serverApi'
export const metadata: Metadata = { title:'About Chiranjit Das | Java Developer', description:'Learn about Chiranjit Das, a Java & Backend Software Engineer passionate about clean code, Spring Boot, REST APIs, and scalable distributed systems.', alternates:{canonical:'/about'} }
export default async function Page(){const [profile,skills]=await Promise.all([serverApi.profile(),serverApi.skills()]);return <AboutPage profile={profile} skills={skills}/>}
