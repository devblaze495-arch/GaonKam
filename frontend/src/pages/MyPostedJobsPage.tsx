import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, PageHeader, StatusBadge } from '../components/ui/Foundation'
import { EmptyState, ErrorState, LoadingState } from '../components/states/AsyncStates'
import { useLanguage } from '../i18n/useLanguage'
import { jobsService } from '../services/jobsService'
import { localizedText, type Job } from '../types'
import { jobStatusTone } from '../types/status'

export function MyPostedJobsPage() {
  const { language, t } = useLanguage()
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [filter, setFilter] = useState<'all' | 'open' | 'completed' | 'cancelled'>('all')

  useEffect(() => {
    loadPostedJobs()
  }, [])

  function loadPostedJobs() {
    setIsLoading(true)
    jobsService
      .getMyPostedJobs()
      .then(setJobs)
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false))
  }

  async function handleCancel(jobId: string) {
    if (!window.confirm('Are you sure you want to cancel this job?')) return
    try {
      await jobsService.cancelJob(jobId)
      loadPostedJobs()
    } catch {
      alert('Could not cancel job.')
    }
  }

  const filteredJobs = jobs.filter((j) => (filter === 'all' ? true : j.status === filter))

  if (isLoading) return <LoadingState label={t('loading')} />
  if (hasError) return <ErrorState title="Error loading posted jobs" retryLabel={t('cancel')} onRetry={loadPostedJobs} />

  return (
    <section className="page-section">
      <PageHeader
        title={t('myPostedJobs')}
        action={
          <Link to="/post-job">
            <Button>+ {t('postWork')}</Button>
          </Link>
        }
      />

      <div className="tab-filters">
        <button className={`tab-filter ${filter === 'all' ? 'is-active' : ''}`} onClick={() => setFilter('all')}>
          {t('allJobs')} ({jobs.length})
        </button>
        <button className={`tab-filter ${filter === 'open' ? 'is-active' : ''}`} onClick={() => setFilter('open')}>
          {t('openJobs')} ({jobs.filter((j) => j.status === 'open').length})
        </button>
        <button className={`tab-filter ${filter === 'completed' ? 'is-active' : ''}`} onClick={() => setFilter('completed')}>
          {t('completedJobs')} ({jobs.filter((j) => j.status === 'completed').length})
        </button>
      </div>

      {filteredJobs.length === 0 ? (
        <EmptyState title="No posted jobs found" description="You haven't posted any jobs under this category." />
      ) : (
        <div className="jobs-list">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="job-card">
              <div className="job-card__top">
                <StatusBadge label={job.status.toUpperCase()} tone={jobStatusTone[job.status] || 'info'} />
                <span>₹{job.paymentDetails?.amount || 600}</span>
              </div>
              <h3>{localizedText(job.title, language)}</h3>
              <p className="job-card__description">{localizedText(job.description, language)}</p>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Link to={`/my-jobs/${job.id}/applicants`}>
                  <Button variant="secondary">{t('applicantsTitle')}</Button>
                </Link>
                {job.status === 'open' && (
                  <Button variant="danger" onClick={() => handleCancel(job.id)}>
                    {t('cancel')}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
