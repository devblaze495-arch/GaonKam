import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Alert, Button, Card, ConfirmDialog, Field, Input, Rating, StarRating, StatusBadge, TrustScore } from '../components/ui/Foundation'
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

  // Modal states for Dispute and Rating
  const [showDisputeModal, setShowDisputeModal] = useState(false)
  const [disputeReason, setDisputeReason] = useState('')
  const [disputeDesc, setDisputeDesc] = useState('')

  const [showRatingModal, setShowRatingModal] = useState(false)
  const [ratingVal, setRatingVal] = useState(5)
  const [ratingComment, setRatingComment] = useState('')

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
    try {
      const next = await applicationService.applyForJob(currentJob.id)
      setApplication(next)
      setSuccess(true)
      setConfirm(false)
    } catch {
      setError(true)
    } finally {
      setIsApplying(false)
    }
  }

  async function handleWithdraw() {
    if (!window.confirm(t('withdrawConfirm'))) return
    try {
      await applicationService.withdrawApplication(currentJob.id)
      setApplication(null)
    } catch {
      alert('Could not withdraw application.')
    }
  }

  async function handleDisputeSubmit() {
    if (!disputeReason.trim()) return
    try {
      await jobsService.createJobDispute(currentJob.id, { reason: disputeReason, description: disputeDesc })
      alert('Dispute raised successfully.')
      setShowDisputeModal(false)
    } catch {
      alert('Error submitting dispute.')
    }
  }

  async function handleRatingSubmit() {
    try {
      await jobsService.createJobRating(currentJob.id, { targetUserId: currentJob.postedBy as any, rating: ratingVal, comment: ratingComment })
      alert('Rating submitted successfully!')
      setShowRatingModal(false)
    } catch {
      alert('Error submitting rating.')
    }
  }

  return (
    <section className="page-section job-details-page">
      <Link className="back-link" to="/jobs">← {jt('backToJobs')}</Link>
      
      <div className="job-details-heading" style={{ marginTop: 12 }}>
        <div>
          <span className="eyebrow">{localizedText(currentJob.category, language)}</span>
          <h1>{localizedText(currentJob.title, language)}</h1>
        </div>
        <StatusBadge label={statusLabel} tone={jobStatusTone[currentJob.status]} />
      </div>

      <Card className="job-detail-card">
        <div className="job-detail-facts">
          <strong>₹{currentJob.paymentDetails.amount.toLocaleString('en-IN')} <small>{currentJob.paymentDetails.type === 'daily' ? jt('perDay') : jt('fixedPayment')}</small></strong>
          <span>📍 {localizedText(currentJob.location, language)} • {localizedText(currentJob.distance, language)}</span>
          <span>📅 {localizedText(currentJob.dateLabel, language)} • {currentJob.schedule.time}</span>
        </div>

        <h2 className="job-detail-section-title">{jt('description')}</h2>
        <p className="job-description">{localizedText(currentJob.description, language)}</p>

        <h2 className="job-detail-section-title">{jt('requiredSkills')}</h2>
        <div className="job-skill-tags">
          {skills.map((skill) => <span key={skill!.id}>{skill!.name[language]}</span>)}
        </div>

        {hasMatch && <Alert tone="success">{jt('skillMatch')}</Alert>}

        <h2 className="job-detail-section-title">{jt('employer')}</h2>
        <div className="employer-summary">
          <div className="profile-avatar">{localizedName(currentJob.employer.name, language).slice(0, 1)}</div>
          <div>
            <h3>{localizedName(currentJob.employer.name, language)}</h3>
            <p>{localizedText(currentJob.employer.location, language)}</p>
            <Rating value={currentJob.employer.rating} accessibleLabel={`${currentJob.employer.rating} ${jt('reviews')}`} />
          </div>
          <TrustScore score={currentJob.employer.trustScore} label={t('trustScore')} />
        </div>

        <div className="job-detail-row">
          <span>{jt('workersRequired')}</span>
          <strong>{currentJob.workersRequired}</strong>
        </div>
      </Card>

      {success && <Alert tone="success">{jt('applicationSubmitted')}</Alert>}

      {application ? (
        <Card className="application-state" style={{ marginTop: 16 }}>
          <div>
            <strong>{jt('applied')}</strong>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
              {application.status === 'pending' ? jt('pendingApplication') : application.status === 'accepted' ? jt('acceptedApplication') : jt('rejectedApplication')}
            </p>
          </div>
          {application.status === 'pending' && (
            <Button variant="secondary" onClick={handleWithdraw}>
              {t('withdrawApplication')}
            </Button>
          )}
        </Card>
      ) : currentJob.status === 'open' ? (
        <Button disabled={isApplying} onClick={() => setConfirm(true)} style={{ marginTop: 16 }}>
          {isApplying ? jt('applicationSubmitted') : jt('applyForWork')}
        </Button>
      ) : (
        <Button disabled style={{ marginTop: 16 }}>{jt('applicationsClosed')}</Button>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <Button variant="quiet" onClick={() => setShowRatingModal(true)}>
          ⭐ {t('rateEmployer')}
        </Button>
        <Button variant="quiet" onClick={() => setShowDisputeModal(true)}>
          ⚠️ {t('disputeTitle')}
        </Button>
      </div>

      {confirm && (
        <ConfirmDialog
          title={jt('confirmApplication')}
          text={jt('confirmApplicationText')}
          onConfirm={apply}
          onCancel={() => setConfirm(false)}
          confirmLabel={jt('applyForWork')}
          cancelLabel={t('cancel')}
        />
      )}

      {showDisputeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{t('disputeTitle')}</h3>
            <Field label={t('disputeReason')}>
              <Input value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} placeholder="e.g. Non-payment, unsafe work" />
            </Field>
            <Field label={t('disputeDescription')}>
              <textarea className="form-control" rows={3} value={disputeDesc} onChange={(e) => setDisputeDesc(e.target.value)} />
            </Field>
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setShowDisputeModal(false)}>{t('cancel')}</Button>
              <Button onClick={handleDisputeSubmit}>{t('submitDispute')}</Button>
            </div>
          </div>
        </div>
      )}

      {showRatingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{t('submitRating')}</h3>
            <StarRating value={ratingVal} onChange={setRatingVal} />
            <Field label={t('reviews')}>
              <textarea className="form-control" rows={2} value={ratingComment} onChange={(e) => setRatingComment(e.target.value)} placeholder="Share your experience..." />
            </Field>
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setShowRatingModal(false)}>{t('cancel')}</Button>
              <Button onClick={handleRatingSubmit}>{t('submitRating')}</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
