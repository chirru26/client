import { BriefcaseBusiness } from 'lucide-react'
import { adminApi } from '../api'
import ContentList from './ContentList'

export default function Experience() {
  return (
    <ContentList
      title="Experience"
      subtitle="Document your career history, leadership roles, and engineering milestones."
      icon={BriefcaseBusiness}
      queryKey="experience"
      queryFn={adminApi.experience}
      createFn={adminApi.createExperience}
      deleteFn={adminApi.deleteExperience}
      formFields={[
        { 
          name: 'position',
          label: 'Position / Job Title',
          placeholder: 'e.g. Senior Full Stack Engineer',
          required: true,
        },
        {
          name: 'company',
          label: 'Company / Organization',
          placeholder: 'e.g. Acme Corp',
          required: true,
        },
        {
          name: 'startDate',
          label: 'Start Date',
          type: 'date',
          required: true,
        },
        {
          name: 'endDate',
          label: 'End Date',
          type: 'date',
          required: false,
        },
        {
          name: 'current',
          label: 'Currently Working Here',
          type: 'checkbox',
          required: false,
        },
        {
          name: 'description',
          label: 'Key Responsibilities & Achievements',
          type: 'textarea',
          placeholder: 'Architected distributed systems, led frontend migration...',
          rows: 3,
        },
      ]}
      displayPrimary={(item) => item.position || item.title}
      displaySecondary={(item) => item.company}
      displayExtra={(item) => {
        const start = item.startDate || ''
        const end = item.current ? 'Present' : item.endDate || ''
        return start ? `${start} – ${end}` : ''
      }}
    />
  )
}