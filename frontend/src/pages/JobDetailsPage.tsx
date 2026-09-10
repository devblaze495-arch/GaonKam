import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Heart, Share2, MapPin, Calendar, Clock } from 'lucide-react'
import { Card, TrustScore } from '../components/ui/Foundation'
import { ErrorState, LoadingState } from '../components/states/AsyncStates'
import { useLanguage } from '../i18n/useLanguage'
import { jobsService } from '../services/jobsService'
import { applicationService, type JobApplication } from '../services/applicationService'
import { skillOptions } from '../data/profileData'
import { localizedText, type Job } from '../types'
import { localizedName } from '../types/auth'

export function JobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { language, t, localizeCategory, localizeApplicationStatus, formatWorkersNeeded } = useLanguage()
  const [job, setJob] = useState<Job | null>(null)
  const [application, setApplication] = useState<JobApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    if (!jobId) return
    setIsLoading(true)
    Promise.all([
      jobsService.getJobById(jobId),
      applicationService.getMyApplications().then((apps) => apps.find((a) => a.jobId === jobId) || null).catch(() => null),
    ])
      .then(([nextJob, nextApp]) => {
        setJob(nextJob)
        setApplication(nextApp)
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false))
  }, [jobId])

  async function handleApply() {
    if (!job) return
    setIsApplying(true)
    try {
      const next = await applicationService.applyForJob(job.id)
      setApplication(next)
    } catch {
      alert(t('error'))
    } finally {
      setIsApplying(false)
    }
  }

  async function handleWithdraw() {
    if (!job || !window.confirm(t('confirm') + '?')) return
    try {
      await applicationService.withdrawApplication(job.id)
      setApplication(null)
    } catch {
      alert(t('error'))
    }
  }

  if (isLoading) return <LoadingState label={t('loadingJobDetails')} />
  if (error || !job) {
    return (
      <div style={{ padding: 20 }}>
        <ErrorState title={t('jobNotFound')} retryLabel={t('back')} onRetry={() => navigate('/jobs')} />
      </div>
    )
  }

  const skills = job.requiredSkillIds.map((id) => skillOptions.find((s) => s.id === id)?.name[language] || id)
  const durationText = language === 'mr' ? '१-३ दिवस' : language === 'hi' ? '१-३ दिन' : '1-3 days'
  const categoryString = typeof job.category === 'string' ? job.category : (job.category as any)?.[language] || 'agriculture'

  return (
    <div className="job-details-reference-view">
      {/* Top Hero Image Banner */}
      <div className="job-details-hero-banner">
        <div className="job-details-top-bar">
          <button type="button" onClick={() => navigate('/jobs')} className="hero-floating-icon-btn" aria-label={t('back')}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="hero-floating-icon-btn"
              aria-label={t('bookmarkJob')}
            >
              <Heart size={18} fill={isBookmarked ? '#A94F32' : 'none'} color={isBookmarked ? '#A94F32' : '#FFFFFF'} />
            </button>
            <button
              type="button"
              onClick={() => {
                if (navigator.share) navigator.share({ title: localizedText(job.title, language), url: window.location.href }).catch(() => null)
                else alert(window.location.href)
              }}
              className="hero-floating-icon-btn"
              aria-label={t('shareJob')}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="job-details-body-container">
        <div className="job-details-header-info">
          <h1 className="job-details-title">{localizedText(job.title, language)}</h1>
          <div className="job-details-loc-dist">
            <MapPin size={15} color="var(--primary)" />
            <span>{localizedText(job.location, language)} • {localizedText(job.distance, language)}</span>
          </div>

          <div className="job-details-wage-row">
            <div className="job-details-wage-amount">₹{job.paymentDetails.amount.toLocaleString('en-IN')}</div>
            <span className="job-details-wage-unit">
              / {job.paymentDetails.type === 'daily' ? (language === 'mr' ? 'दिवस' : language === 'hi' ? 'दिन' : 'day') : (language === 'mr' ? 'काम' : language === 'hi' ? 'काम' : 'job')}
            </span>
          </div>

          {/* Category & Worker tags */}
          <div className="job-details-chips-row">
            <span className="details-chip">{localizeCategory(categoryString)}</span>
            <span className="details-chip">{formatWorkersNeeded(job.workersRequired)}</span>
          </div>
        </div>

        {/* 3-Column Schedule & Details Card */}
        <Card className="job-schedule-facts-card">
          <div className="schedule-fact-item">
            <div className="fact-label-row">
              <Calendar size={13} color="var(--text-muted)" />
              <span>{t('startDateLabel')}</span>
            </div>
            <strong>{localizedText(job.dateLabel, language)}</strong>
          </div>

          <div className="schedule-fact-item" style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', padding: '0 10px' }}>
            <div className="fact-label-row">
              <Clock size={13} color="var(--text-muted)" />
              <span>{t('durationLabel')}</span>
            </div>
            <strong>{durationText}</strong>
          </div>

          <div className="schedule-fact-item">
            <div className="fact-label-row">
              <Clock size={13} color="var(--text-muted)" />
              <span>{t('timingLabel')}</span>
            </div>
            <strong>{job.schedule.time || '8:00 AM - 5:00 PM'}</strong>
          </div>
        </Card>

        {/* Description Section */}
        <div className="job-details-section">
          <h2 className="details-section-heading">{t('descriptionLabel')}</h2>
          <p className="job-details-desc-text">
            {localizedText(job.description, language)}
          </p>
        </div>

        {/* Required Skills */}
        {skills.length > 0 && (
          <div className="job-details-section">
            <h2 className="details-section-heading">{t('requiredSkillsLabel')}</h2>
            <div className="job-details-chips-row">
              {skills.map((skill, i) => (
                <span key={i} className="details-chip" style={{ backgroundColor: 'var(--accent-olive-light)', color: 'var(--accent-olive)' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Employer Overview */}
        <div className="job-details-section">
          <h2 className="details-section-heading">{t('employerLabel')}</h2>
          <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {localizedName(job.employer.name, language).slice(0, 1)}
              </div>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>{localizedName(job.employer.name, language)}</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{localizedText(job.employer.location, language)}</div>
              </div>
            </div>
            <TrustScore score={job.employer.trustScore || 85} label={t('trust')} />
          </Card>
        </div>

        {/* Primary CTA Button */}
        <div className="job-details-bottom-cta">
          {application ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
                <span>{t('applicationStatusLabel')} <strong>{localizeApplicationStatus(application.status)}</strong></span>
                {application.status === 'pending' && (
                  <button type="button" onClick={handleWithdraw} className="withdraw-text-btn">
                    {language === 'mr' ? 'मागे घ्या' : language === 'hi' ? 'वापस लें' : 'Withdraw'}
                  </button>
                )}
              </div>
            </div>
          ) : job.status === 'open' ? (
            <button
              type="button"
              disabled={isApplying}
              onClick={handleApply}
              className="welcome-cta-btn"
            >
              {isApplying ? t('loading') : t('applyForWork')}
            </button>
          ) : (
            <button type="button" disabled className="welcome-cta-btn" style={{ opacity: 0.6 }}>
              {t('applicationsClosed')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
