'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({error,reset}:{error:Error & {digest?:string};reset:()=>void}){
 useEffect(()=>{console.error(error)},[error])
 return <main style={{paddingTop:'140px',minHeight:'80vh',display:'flex',alignItems:'center'}}><div className="container" style={{maxWidth:'650px',textAlign:'center'}}><div className="hero-card" style={{padding:'48px 32px'}}><span className="eyebrow">Application Error</span><h1 style={{fontSize:'2rem',marginBottom:'16px',color:'var(--text-primary)'}}>Something went wrong</h1><p style={{color:'var(--text-secondary)',marginBottom:'28px'}}>The page could not be rendered. You can try again or return home.</p><div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}><button className="btn btn-primary" onClick={()=>reset()}>Try again</button><Link href="/" className="btn btn-secondary">Return home</Link></div></div></div></main>
}
