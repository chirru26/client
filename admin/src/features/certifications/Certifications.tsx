import { BadgeCheck } from 'lucide-react'
import { adminApi } from '@/lib/api'
import ContentList from '@/components/ui/ContentList'

export default function Certifications() {
  return (
    <ContentList
      title="Certifications & Professional Badges Hub"
      singularName="Certification"
      subtitle="Cryptographic verification links (Credly, AWS, CNCF), compliance monitors, and digital badges."
      icon={BadgeCheck}
      queryKey="certifications"
      queryFn={adminApi.certifications}
      createFn={adminApi.createCertification}
      deleteFn={adminApi.deleteCertification}
      formFields={[
        { name: 'name', label: 'Certification Title', placeholder: 'e.g. AWS Certified Solutions Architect - Professional', required: true },
        { name: 'issuer', label: 'Issuing Organization', placeholder: 'e.g. Amazon Web Services (AWS) / CNCF / Linux Foundation', required: true },
        { name: 'issueDate', label: 'Issue Date / Validity Window', placeholder: 'e.g. Nov 2024 – Nov 2027', required: false },
        { name: 'verificationUrl', label: 'Verification Link (Credly / AWS / CNCF)', placeholder: 'https://www.credly.com/badges/...', required: false },
        { name: 'imageUrl', label: 'Digital Badge Asset / Vector Icon', type: 'image-upload', folder: 'certifications', uploadLabel: 'Upload Badge Image', helpText: 'High-resolution PNG, SVG, WebP badge up to 5MB', required: false },
        { name: 'credentialUrl', label: 'Cryptographic Transcript / Certificate PDF', type: 'doc-upload', folder: 'certifications', uploadLabel: 'Upload Certificate PDF', helpText: 'PDF certificate document up to 10MB', required: false },
      ]}
      displayPrimary={(item) => String(item.name || item.title || '')}
      displaySecondary={(item) => String(item.issuer || item.organization || '')}
      displayExtra={(item) => String(item.issueDate || item.year || '')}
    />
  )
}
