import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Card, PageHeader, Rating, StatusBadge, TrustScore } from '../components/ui/Foundation'
import { EmptyState, ErrorState, LoadingState } from '../components/states/AsyncStates'
import { useLanguage } from '../i18n/useLanguage'
import { jobsService, type JobApplicationItem, type JobAssignmentItem } from '../services/jobsService'

export function JobApplicantsPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const { t } = useLanguage()

  const [applications, setApplications] = useState<JobApplicationItem[]>([])
  const [assignments, setAssignments] = useState<JobAssignmentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!jobId) return
    loadData()
  }, [jobId])

  function loadData() {
    setIsLoading(true)
    Promise.all([
      jobsService.getJobApplicationsForPoster(jobId!),
      jobsService.getJobAssignmentsForPoster(jobId!).catch(() => []),
    ])
      .then(([apps, asgs]) => {
        setApplications(apps)
        setAssignments(asgs)
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false))
  }

  async function handleStatusChange(applicationId: string, status: 'accepted' | 'rejected') {
    try {
      await jobsService.updateApplicationStatus(jobId!, applicationId, status)
      loadData()
    } catch {
      alert('Could not update status.')
    }
  }

  async function handleConfirmCompletion(assignmentId: string) {
    try {
      await jobsService.confirmWorkCompletion(jobId!, assignmentId)
      loadData()
    } catch {
      alert('Could not confirm work completion.')
    }
  }

  if (isLoading) return <LoadingState label={t('loading')} />
  if (hasError) return <ErrorState title="Error loading applicants" retryLabel={t('back')} onRetry={loadData} />

  return (
    <section className="page-section">
      <PageHeader title={t('applicantsTitle')} backUrl="/my-jobs" />

      {assignments.length > 0 && (
        <Card style={{ marginBottom: 20 }}>
          <h3>Selected Workers ({assignments.length})</h3>
          <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            {assignments.map((asg) => (
              <div key={asg.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#f1f5f9', borderRadius: 8 }}>
                <div>
                  <strong>{asg.workerName}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Status: {asg.status}</div>
                </div>
                {asg.status === 'worker_completed' && (
                  <Button onClick={() => handleConfirmCompletion(asg.id)}>
                    {t('confirmCompletion')}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {applications.length === 0 ? (
        <EmptyState title={t('noApplicantsYet')} description="No workers have applied for this job yet." />
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {applications.map((app) => (
            <Card key={app.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3>{app.applicantName}</h3>
                  <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#64748b' }}>
                    📍 {app.applicantVillage}, {app.applicantDistrict}
                  </p>
                  <Rating value={app.rating || 4.5} />
                </div>
                <TrustScore score={app.trustScore || 85} label={t('trustScore')} />
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                {app.status === 'pending' ? (
                  <>
                    <Button onClick={() => handleStatusChange(app.id, 'accepted')}>
                      ✓ {t('acceptWorker')}
                    </Button>
                    <Button variant="secondary" onClick={() => handleStatusChange(app.id, 'rejected')}>
                      ✗ {t('rejectWorker')}
                    </Button>
                  </>
                ) : (
                  <StatusBadge label={app.status.toUpperCase()} tone={app.status === 'accepted' ? 'success' : 'danger'} />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
