import Hero from '../components/Hero'
import About from '../components/About'
import Project from '../components/Project'
import Internship from '../components/Internship'
import Education from '../components/Education'
import Contact from '../components/Contact'
import SEO from '../components/SEO'
import { getImageUrl } from '../utils/imageUtils'

export default function Home({
  profile = {},
  projects = [],
  skills = [],
  experience = [],
  education = [],
  socialLinks = [],
  projectsLoading = false,
  onShowToast,
}) {
  const profileImageUrl = getImageUrl(profile.imageUrl) || 'https://www.chirru.in/og-image.jpg'

  // Construct real verified sameAs profiles
  const sameAsList = []
  if (profile.githubUrl) sameAsList.push(profile.githubUrl)
  if (profile.linkedinUrl) sameAsList.push(profile.linkedinUrl)
  socialLinks.forEach((s) => {
    if (s.url && !sameAsList.includes(s.url)) {
      sameAsList.push(s.url)
    }
  })

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name || 'Chiranjit Das',
    url: 'https://www.chirru.in/',
    jobTitle: 'Java & Backend Developer',
    description:
      profile.headline || 'Software Engineer specializing in Java, Spring Boot, REST APIs, and scalable architectures.',
    email: profile.email || 'chirru26@gmail.com',
    image: profileImageUrl,
    sameAs: sameAsList,
    knowsAbout: [
      'Java',
      'Spring Boot',
      'PostgreSQL',
      'REST APIs',
      'Microservices',
      'Docker',
      'React',
      'Clean Architecture',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Chiranjit Das Portfolio',
    url: 'https://www.chirru.in/',
    description: 'Official portfolio and software engineering projects of Chiranjit Das.',
    author: {
      '@type': 'Person',
      name: 'Chiranjit Das',
    },
  }

  return (
    <>
      <SEO
        title="Chiranjit Das | Java & Backend Developer"
        description="Official portfolio of Chiranjit Das, Java & Backend Software Engineer specializing in Spring Boot, REST APIs, Microservices, and scalable web applications."
        canonical="/"
        ogType="website"
        schema={[personSchema, websiteSchema]}
      />

      <main>
        <Hero
          profile={profile}
          socialLinks={socialLinks}
          projectCount={projects.length}
          skillCount={skills.length}
        />
        <About profile={profile} skills={skills} />
        <Project projects={projects} loading={projectsLoading} />
        <Internship items={experience} />
        <Education items={education} />
        <Contact profile={profile} socialLinks={socialLinks} onShowToast={onShowToast} />
      </main>
    </>
  )
}
