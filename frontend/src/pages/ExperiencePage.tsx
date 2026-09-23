import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Internship from '@/components/Internship'
import Education from '@/components/Education'
import type { Education as EducationType, Experience } from '@/types/portfolio'
export default function ExperiencePage({experience=[],education=[]}:{experience?:Experience[];education?:EducationType[]}){return <main style={{paddingTop:'100px',minHeight:'80vh'}}><div className="container" style={{marginBottom:'24px'}}><nav aria-label="Breadcrumb" style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'.88rem'}}><Link href="/" className="project-action-link" style={{display:'inline-flex',alignItems:'center',gap:'4px'}}><ArrowLeft size={15}/> Back to Home</Link><span style={{color:'var(--text-muted)'}}>/</span><span style={{color:'var(--text-secondary)'}}>Experience</span></nav></div><Internship items={experience}/><Education items={education}/></main>}