import type { Metadata } from 'next'
import ContactPage from '@/pages/ContactPage'
import { serverApi } from '@/lib/serverApi'
export const metadata: Metadata={title:'Contact Chiranjit Das',description:'Connect with Chiranjit Das for software engineering opportunities, Java & Spring Boot backend projects, or technical inquiries.',alternates:{canonical:'/contact'}}
export default async function Page(){const [profile,socialLinks]=await Promise.all([serverApi.profile(),serverApi.socialLinks()]);return <ContactPage profile={profile} socialLinks={socialLinks}/>}
