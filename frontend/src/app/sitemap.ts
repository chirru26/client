import type { MetadataRoute } from 'next'
import { serverApi } from '@/lib/serverApi'
import { toProjectSlug } from '@/utils/slugUtils'
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const projects=await serverApi.projects();const base='https://www.chirru.in';return [{url:base,lastModified:new Date()},{url:`${base}/about`,lastModified:new Date()},{url:`${base}/projects`,lastModified:new Date()},{url:`${base}/experience`,lastModified:new Date()},{url:`${base}/contact`,lastModified:new Date()},...projects.map(p=>({url:`${base}/projects/${toProjectSlug(p.title)}`,lastModified:new Date()}))]}
