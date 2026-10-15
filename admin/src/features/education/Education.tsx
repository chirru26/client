import { GraduationCap } from 'lucide-react'
import { adminApi } from '@/lib/api'
import ContentList from '@/components/ui/ContentList'

export default function Education() {
  return (
    <ContentList
      title="Academic Credentials & Degree Registry"
      singularName="Credential"
      subtitle="Accredited degree registry, capstone research honors, and verified academic transcripts."
      icon={GraduationCap}
      queryKey="education"
      queryFn={adminApi.education}
      createFn={adminApi.createEducation}
      deleteFn={adminApi.deleteEducation}
      formFields={[
        { name: 'degree', label: 'Degree / Program Accreditation', placeholder: 'e.g. B.Tech in Computer Science & Engineering', required: true },
        { name: 'institution', label: 'University / Institute', placeholder: 'e.g. State Technological University', required: true },
        { name: 'year', label: 'Academic Term / Graduation Year', placeholder: 'e.g. 2021 – 2025', required: false },
        { name: 'details', label: 'Capstone Research & Honors Classification', type: 'textarea', placeholder: 'First Class Distinction (GPA 8.9 / 10.0); Capstone research in Distributed Byzantine Fault Tolerance...', rows: 3 },
      ]}
      displayPrimary={(item) => String(item.degree || item.title || '')}
      displaySecondary={(item) => String(item.institution || '')}
      displayExtra={(item) => String(item.year || item.period || '')}
    />
  )
}
