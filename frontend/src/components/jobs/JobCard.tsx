import { Link } from 'react-router-dom'
import { useLanguage } from '../../i18n/useLanguage'
import { useJobText } from '../../i18n/jobsTranslations'
import { skillOptions } from '../../data/profileData'
import { localizedText, type Job } from '../../types'
import { Button, Card, StatusBadge } from '../ui/Foundation'
import { jobStatusTone } from '../../types/status'

export function JobCard({ job }: { job: Job }) {
  const { language } = useLanguage()
  const jt = useJobText(language)
  const statusLabel = job.status === 'open' ? jt('openStatus') : job.status === 'expired' ? jt('expiredStatus') : job.status === 'filled' ? jt('filledStatus') : job.status === 'completed' ? jt('completedStatus') : localizedText(job.status as never, language)
  const required = job.requiredSkillIds.map((id) => skillOptions.find((skill) => skill.id === id)?.name[language] ?? id).join(', ')
  return <Card className="job-card"><div className="job-card__top"><span className="category-mark">{localizedText(job.category, language).slice(0, 2)}</span><StatusBadge label={statusLabel} tone={jobStatusTone[job.status]} /></div><h3>{localizedText(job.title, language)}</h3><p className="job-card__description">{localizedText(job.description, language)}</p><div className="job-card__facts"><span>⌖ {localizedText(job.location, language)}</span><span>◌ {localizedText(job.distance, language)}</span><span>{localizedText(job.dateLabel, language)}</span></div><div className="job-card__meta"><strong>₹{job.paymentDetails.amount.toLocaleString('en-IN')} <small>{job.paymentDetails.type === 'daily' ? jt('perDay') : jt('fixedPayment')}</small></strong><span>{jt('requiredSkills')}: {required}</span></div><div className="job-card__footer"><span>{jt('postedBy')} {localizedText(job.postedBy, language)}</span><Link to={`/jobs/${job.id}`}><Button variant="secondary">{jt('jobDetails')}</Button></Link></div></Card>
}
