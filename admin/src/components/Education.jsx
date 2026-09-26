import { GraduationCap } from 'lucide-react'
import { adminApi } from '../api'
import ContentList from './ContentList'

export default function Education() {
  return (
    <ContentList
      title="Education"
      subtitle="Manage your academic qualifications, degrees, and university credentials."
      icon={GraduationCap}
      queryKey="education"
      queryFn={adminApi.education}
      createFn={adminApi.createEducation}
      deleteFn={adminApi.deleteEducation}
      formFields={[
        {
          name: 'degree',
          label: 'Degree / Major',
          placeholder: 'e.g. B.Tech in Computer Science',
          required: true,
        },
        {
          name: 'institution',
          label: 'University / Institution',
          placeholder: 'e.g. University of California, Berkeley',
          required: true,
        },
        {
          name: 'year',
          label: 'Graduation Year / Period',
          placeholder: 'e.g. 2021 - 2025',
          required: false,
        },
        {
          name: 'details',
          label: 'Specialization or Honors (Optional)',
          type: 'textarea',
          placeholder: 'Specialized in Distributed Computing & Machine Learning...',
          rows: 2,
        },
      ]}
      displayPrimary={(item) => item.degree || item.title}
      displaySecondary={(item) => item.institution}
      displayExtra={(item) => item.year || item.period}
    />
  )
}