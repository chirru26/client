import { BadgeCheck } from 'lucide-react'
import { adminApi } from '../api'
import ContentList from './ContentList'

export default function Certifications() {
  return (
    <ContentList
      title="Certifications"
      subtitle="Showcase your professional accreditations, verified badges, and certifications."
      icon={BadgeCheck}
      queryKey="certifications"
      queryFn={adminApi.certifications}
      createFn={adminApi.createCertification}
      deleteFn={adminApi.deleteCertification}
      formFields={[
        {
          name: 'name',
          label: 'Certificate Title',
          placeholder: 'e.g. AWS Certified Solutions Architect',
          required: true,
        },
        {
          name: 'issuer',
          label: 'Issuing Organization',
          placeholder: 'e.g. Amazon Web Services (AWS)',
          required: true,
        },
        {
          name: 'issueDate',
          label: 'Issue Date / Year',
          placeholder: 'e.g. 2024',
          required: false,
        },
        {
          name: 'imageUrl',
          label: 'Certificate Badge / Image',
          type: 'image-upload',
          folder: 'certifications',
          uploadLabel: 'Upload Badge Image',
          helpText: 'PNG, JPEG, WebP badge up to 5MB',
          required: false,
        },
        {
          name: 'credentialUrl',
          label: 'Certificate PDF Document',
          type: 'doc-upload',
          folder: 'certifications',
          uploadLabel: 'Upload Certificate PDF',
          helpText: 'PDF certificate document up to 10MB',
          required: false,
        },
      ]}
      displayPrimary={(item) => item.name || item.title}
      displaySecondary={(item) => item.issuer || item.organization}
      displayExtra={(item) => item.issueDate || item.year}
    />
  )
}