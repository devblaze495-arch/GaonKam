import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Alert, Button, Card, Rating, StatusBadge, TrustScore } from '../components/ui/Foundation'
import { EmptyState, ErrorState, LoadingState } from '../components/states/AsyncStates'
import { useLanguage } from '../i18n/useLanguage'
import { useAuth } from '../auth/useAuth'
import { useJobText } from '../i18n/jobsTranslations'
import { jobsService } from '../services/jobsService'
import { applicationService, type JobApplication } from '../services/applicationService'
import { skillOptions } from '../data/profileData'
import { localizedText, type Job } from '../types'
import { localizedName } from '../types/auth'
import { jobStatusTone } from '../types/status'
import { profileService } from '../services/profileService'

export function JobDetailsPage() {
  const { jobId } = useParams()
  const { language, t } = useLanguage()
  const jt = useJobText(language)
  const { user } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [application, setApplication] = useState<JobApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [success, setSuccess] = useState(false)
  const [userSkillIds, setUserSkillIds] = useState<string[]>([])

  useEffect(() => {
    if (!jobId) return
    Promise.all([jobsService.getJobById(jobId), applicationService.getApplicationStatus(jobId)])
      .then(([nextJob, nextApplication]) => { setJob(nextJob); setApplication(nextApplication) })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false))
  }, [jobId])
  useEffect(() => { if (user) profileService.getProfile(user).then((profile) => setUserSkillIds(profile.skills.map((skill) => skill.skillId))).catch(() => undefined) }, [user])

  if (isLoading) return <LoadingState label={jt('jobDetails')} />
  if (error) return <section className="page-section"><ErrorState title={jt('applicationFailed')} retryLabel={jt('retry')} onRetry={() => window.location.reload()} /></section>
  if (!job) return <section className="page-section"><EmptyState title={jt('noJobs')} description={jt('noResultsHint')} /></section>
  const currentJob = job

  const statusLabel = job.status === 'open' ? jt('openStatus') : job.status === 'expired' ? jt('expiredStatus') : job.status === 'filled' ? jt('filledStatus') : job.status === 'completed' ? jt('completedStatus') : jt('applicationsClosed')
  const skills = job.requiredSkillIds.map((id) => skillOptions.find((skill) => skill.id === id)).filter(Boolean)
  const hasMatch = job.requiredSkillIds.some((skillId) => userSkillIds.includes(skillId))

  async function apply() {
    setIsApplying(true)
    try { const next = await applicationService.applyForJob(currentJob.id); setApplication(next); setSuccess(true); setConfirm(false) } catch { setError(true) } finally { setIsApplying(false) }
  }

  return <section className="page-section job-details-page"><Link className="back-link" to="/jobs">← {jt('backToJobs')}</Link><div className="job-details-heading"><div><span className="eyebrow">{localizedText(currentJob.category, language)}</span><h1>{localizedText(currentJob.title, language)}</h1></div><StatusBadge label={statusLabel} tone={jobStatusTone[currentJob.status]} /></div><Card className="job-detail-card"><div className="job-detail-facts"><strong>₹{currentJob.paymentDetails.amount.toLocaleString('en-IN')} <small>{currentJob.paymentDetails.type === 'daily' ? jt('perDay') : jt('fixedPayment')}</small></strong><span>⌖ {localizedText(currentJob.location, language)} · {localizedText(currentJob.distance, language)}</span><span>{localizedText(currentJob.dateLabel, language)} · {currentJob.schedule.time}</span></div><SectionTitle title={jt('description')} /><p className="job-description">{localizedText(currentJob.description, language)}</p><SectionTitle title={jt('requiredSkills')} /><div className="job-skill-tags">{skills.map((skill) => <span key={skill!.id}>{skill!.name[language]}</span>)}</div>{hasMatch && <Alert tone="success">{jt('skillMatch')}</Alert>}<SectionTitle title={jt('employer')} /><div className="employer-summary"><div className="profile-avatar">{localizedName(currentJob.employer.name, language).slice(0, 1)}</div><div><h3>{localizedName(currentJob.employer.name, language)}</h3><p>{localizedText(currentJob.employer.location, language)}</p><Rating value={currentJob.employer.rating} accessibleLabel={`${currentJob.employer.rating} ${jt('reviews')}`} /> <span>{currentJob.employer.reviewCount} {jt('reviews')}</span></div><TrustScore score={currentJob.employer.trustScore} label={t('trustScore')} /></div><div className="job-detail-row"><span>{jt('workersRequired')}</span><strong>{currentJob.workersRequired}</strong></div></Card>{success && <Alert tone="success">{jt('applicationSubmitted')}</Alert>}{application ? <Card className="application-state"><strong>{jt('applied')}</strong><span>{application.status === 'pending' ? jt('pendingApplication') : application.status === 'accepted' ? jt('acceptedApplication') : jt('rejectedApplication')}</span></Card> : currentJob.status === 'open' ? <Button disabled={isApplying} onClick={() => setConfirm(true)}>{isApplying ? jt('applicationSubmitted') : jt('applyForWork')}</Button> : <Button disabled>{jt('applicationsClosed')}</Button>}{confirm && <Card className="confirm-panel"><h2>{jt('confirmApplication')}</h2><p>{jt('confirmApplicationText')}</p><div><Button variant="secondary" onClick={() => setConfirm(false)}>{t('cancel')}</Button><Button onClick={apply}>{jt('applyForWork')}</Button></div></Card>}</section>
}

function SectionTitle({ title }: { title: string }) { return <h2 className="job-detail-section-title">{title}</h2> }
