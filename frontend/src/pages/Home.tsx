import Hero from '@/components/Hero'
import About from '@/components/About'
import Project from '@/components/Project'
import Internship from '@/components/Internship'
import Education from '@/components/Education'
import Contact from '@/components/Contact'
import { getImageUrl } from '@/utils/imageUtils'
import { getSafeExternalUrl } from '@/utils/externalUrl'
import type { Profile, Project as ProjectType, Skill, Experience, Education as EducationType, SocialLink, ToastType } from '@/types/portfolio'

interface HomeProps { profile?:Profile;projects?:ProjectType[];skills?:Skill[];experience?:Experience[];education?:EducationType[];socialLinks?:SocialLink[];projectsLoading?:boolean;onShowToast?:(message:string,type?:ToastType)=>void }

function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
}

export default function Home({profile={},projects=[],skills=[],experience=[],education=[],socialLinks=[],projectsLoading=false,onShowToast}:HomeProps){
 const profileImageUrl=getImageUrl(profile.imageUrl)||'https://www.chirru.in/og-image.jpg'
 const sameAsList:string[]=[]; [profile.githubUrl,profile.linkedinUrl,...socialLinks.map(s=>s.url)].forEach(url=>{const safe=getSafeExternalUrl(url); if(safe&&!sameAsList.includes(safe))sameAsList.push(safe)})
 const personSchema={'@context':'https://schema.org','@type':'Person',name:profile.name||'Chiranjit Das',url:'https://www.chirru.in/',jobTitle:'Java & Backend Developer',description:profile.headline||'Software Engineer specializing in Java, Spring Boot, REST APIs, and scalable architectures.',email:profile.email||'chirru26@gmail.com',image:profileImageUrl,sameAs:sameAsList,knowsAbout:['Java','Spring Boot','PostgreSQL','REST APIs','Microservices','Docker','React','Clean Architecture']}
 const websiteSchema={'@context':'https://schema.org','@type':'WebSite',name:'Chiranjit Das Portfolio',url:'https://www.chirru.in/',description:'Official portfolio and software engineering projects of Chiranjit Das.',author:{'@type':'Person',name:'Chiranjit Das'}}
 return <main><script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd([personSchema,websiteSchema])}}/><Hero profile={profile} socialLinks={socialLinks} projectCount={projects.length} skillCount={skills.length}/><About profile={profile} skills={skills}/><Project projects={projects} loading={projectsLoading}/><Internship items={experience}/><Education items={education}/><Contact profile={profile} socialLinks={socialLinks} onShowToast={onShowToast}/></main>
}
