import { BriefcaseBusiness } from 'lucide-react'
import { adminApi } from '@/lib/api'
import ContentList from '@/components/ui/ContentList'

export default function Experience() {
  return (
    <ContentList
      title="Work Experience & Career Milestones"
      singularName="Role"
      subtitle="Document career history, leadership appointments, architectural deliverables, and toolchain impact."
      icon={BriefcaseBusiness}
      queryKey="experience"
      queryFn={adminApi.experience}
      createFn={adminApi.createExperience}
      deleteFn={adminApi.deleteExperience}
      formFields={[
        { 
          name: 'position',
          label: 'Position / Architectural Role',
          placeholder: 'e.g. Staff Distributed Architect / Senior Backend Engineer',
          required: true,
        },
        {
          name: 'company',
          label: 'Organization / Enterprise',
          placeholder: 'e.g. Spotify / Klarna / Ericsson',
          required: true,
        },
        {
          name: 'location',
          label: 'Location & Policy',
          placeholder: 'e.g. Stockholm, Sweden (Hybrid / Global Remote)',
          required: false,
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
          label: 'Currently Active Role (Present)',
          type: 'checkbox',
          required: false,
        },
        {
          name: 'description',
          label: 'Architectural Deliverables & Measured Impact',
          type: 'textarea',
          placeholder: 'Cut p99 tail latency from 142ms to 18ms; orchestrated Kafka event backbone processing 45k ops/sec...',
          rows: 4,
        },
      ]}
      displayPrimary={(item) => String(item.position || item.title || '')}
      displaySecondary={(item) => [item.company, item.location].filter(Boolean).join(' · ')}
      displayExtra={(item) => {
        const start = item.startDate || ''
        const end = item.current ? 'Present' : item.endDate || ''
        return start ? `${start} – ${end}` : ''
      }}
    />
  )
}
