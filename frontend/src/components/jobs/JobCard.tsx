import { Link } from 'react-router-dom'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'
import { useLanguage } from '../../i18n/useLanguage'
import { useJobText } from '../../i18n/jobsTranslations'
import { skillOptions } from '../../data/profileData'
import { localizedText, type Job } from '../../types'
import { Button, Card, StatusBadge } from '../ui/Foundation'
import { jobStatusTone } from '../../types/status'

export function JobCard({ job }: { job: Job }) {
  const { language, localizeJobStatus, localizeCategory } = useLanguage()
  const jt = useJobText(language)
  const statusLabel = localizeJobStatus(job.status)
  const requiredSkills = job.requiredSkillIds.map((id) => skillOptions.find((skill) => skill.id === id)?.name[language] ?? id)

  return (
    <Card className="job-card">
      <div className="job-card__header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="eyebrow">{localizeCategory(typeof job.category === 'string' ? job.category : (job.category as any)?.[language] || 'agriculture')}</span>
            <StatusBadge label={statusLabel} tone={jobStatusTone[job.status]} />
          </div>
          <h3 className="job-card__title">{localizedText(job.title, language)}</h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="job-card__wage">₹{job.paymentDetails.amount.toLocaleString('en-IN')}</div>
          <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            {job.paymentDetails.type === 'daily' ? jt('perDay') : jt('fixedPayment')}
          </small>
        </div>
      </div>

      <p className="job-card__description">{localizedText(job.description, language)}</p>

      <div className="job-card__meta">
        <div className="job-card__meta-item">
          <MapPin size={14} color="var(--primary)" />
          <span>{localizedText(job.location, language)} {job.distance ? `(${localizedText(job.distance, language)})` : ''}</span>
        </div>
        <div className="job-card__meta-item">
          <Calendar size={14} color="var(--accent-blue)" />
          <span>{localizedText(job.dateLabel, language)}</span>
        </div>
      </div>

      {requiredSkills.length > 0 && (
        <div className="job-card__tags">
          {requiredSkills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="job-tag">{skill}</span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, paddingTop: 10, borderTop: '1px solid var(--border-light)' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {jt('postedBy')} <strong>{localizedText(job.postedBy, language)}</strong>
        </span>
        <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
          <Button variant="secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            {jt('jobDetails')} <ArrowRight size={14} />
          </Button>
        </Link>
      </div>
    </Card>
  )
}
