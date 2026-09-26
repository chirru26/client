import { Wrench } from 'lucide-react'
import { adminApi } from '../api'
import ContentList from './ContentList'

export default function Skills() {
  return (
    <ContentList
      title="Skills"
      subtitle="Organize your technical proficiencies, frameworks, libraries, and developer tools."
      icon={Wrench}
      queryKey="skills"
      queryFn={adminApi.skills}
      createFn={adminApi.createSkill}
      deleteFn={adminApi.deleteSkill}
      formFields={[
        {
          name: 'name',
          label: 'Skill Name',
          placeholder: 'e.g. React 19, TypeScript, PostgreSQL',
          required: true,
        },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          options: [
            { value: 'Frontend', label: 'Frontend' },
            { value: 'Backend', label: 'Backend' },
            { value: 'Database', label: 'Database & Storage' },
            { value: 'DevOps', label: 'DevOps & Cloud' },
            { value: 'AI / ML', label: 'AI & Machine Learning' },
            { value: 'Tools', label: 'Developer Tools' },
          ],
        },
      ]}
      displayPrimary={(item) => item.name}
      displaySecondary={(item) => item.category}
    />
  )
}