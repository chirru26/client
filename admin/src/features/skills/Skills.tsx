import { Wrench } from 'lucide-react'
import { adminApi } from '@/lib/api'
import ContentList from '@/components/ui/ContentList'

export default function Skills() {
  return (
    <ContentList
      title="Skills Matrix"
      singularName="Skill"
      subtitle="Architectural mastery, backend distributed clusters, cloud platforms, and developer toolchains."
      icon={Wrench}
      queryKey="skills"
      queryFn={adminApi.skills}
      createFn={adminApi.createSkill}
      deleteFn={adminApi.deleteSkill}
      formFields={[
        {
          name: 'name',
          label: 'Skill / Technology Name',
          placeholder: 'e.g. Java, Spring Boot, Apache Kafka, Kubernetes',
          required: true,
        },
        {
          name: 'category',
          label: 'Category Cluster',
          type: 'select',
          required: true,
          options: [
            { value: 'Backend & Distributed Systems', label: 'Backend & Distributed Systems' },
            { value: 'Frontend & UI', label: 'Frontend & UI Engineering' },
            { value: 'DevOps & Cloud', label: 'DevOps, CI/CD & Cloud Infrastructure' },
            { value: 'Storage & Databases', label: 'Storage & Distributed Databases' },
            { value: 'AI & Machine Learning', label: 'AI, LLMs & Machine Learning' },
            { value: 'Developer Tools', label: 'Developer Toolchains & Protocols' },
          ],
        },
        {
          name: 'proficiency',
          label: 'Proficiency Index',
          type: 'select',
          required: false,
          options: [
            { value: 'Architectural Mastery (95%+)', label: 'Architectural Mastery (95%+)' },
            { value: 'Production Core (85%+)', label: 'Production Core (85%+)' },
            { value: 'Working Knowledge (70%+)', label: 'Working Knowledge (70%+)' },
          ],
        },
      ]}
      displayPrimary={(item) => String(item.name || '')}
      displaySecondary={(item) => String(item.category || '')}
      displayExtra={(item) => item.proficiency ? `Mastery: ${item.proficiency}` : ''}
    />
  )
}
