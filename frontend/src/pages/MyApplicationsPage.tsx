import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, PageHeader, StatusBadge } from '../components/ui/Foundation'
import { EmptyState, LoadingState } from '../components/states/AsyncStates'
import { useLanguage } from '../i18n/useLanguage'
import { applicationService, type JobApplication, type WorkerAssignment } from '../services/applicationService'
import { jobsService } from '../services/jobsService'

export function MyApplicationsPage() {
  const { t } = useLanguage()

  const [applications, setApplications] = useState<JobApplication[]>([])
  const [assignments, setAssignments] = useState<WorkerAssignment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMyWork()
  }, [])

  function loadMyWork() {
    setIsLoading(true)
    Promise.all([
      applicationService.getMyApplications(),
      applicationService.getMyAssignments().catch(() => []),
    ])
      .then(([apps, asgs]) => {
        setApplications(apps)
        setAssignments(asgs)
      })
      .finally(() => setIsLoading(false))
  }

  async function handleWithdraw(jobId: string) {
    if (!window.confirm(t('withdrawConfirm'))) return
    try {
      await applicationService.withdrawApplication(jobId)
      loadMyWork()
    } catch {
      alert('Could not withdraw application.')
    }
  }

  async function handleMarkCompleted(jobId: string, assignmentId: string) {
    try {
      await jobsService.submitWorkCompletion(jobId, assignmentId)
      loadMyWork()
    } catch {
      alert('Could not submit completion.')
    }
  }

  if (isLoading) return <LoadingState label={t('loading')} />

  return (
    <section className="page-section">
      <PageHeader title={t('myApplications')} />

      {assignments.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3>Active Assignments</h3>
          <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
            {assignments.map((asg) => (
              <Card key={asg.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>Job ID: {asg.jobId}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Status: {asg.status}</div>
                  </div>
                  {asg.status === 'assigned' && (
                    <Button onClick={() => handleMarkCompleted(asg.jobId, asg.id)}>
                      {t('markCompleted')}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {applications.length === 0 ? (
        <EmptyState title="No applications submitted" description="Browse available work in your village and apply!" />
      ) : (
        <div className="jobs-list">
          {applications.map((app) => (
            <Card key={app.jobId}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Link to={`/jobs/${app.jobId}`}>
                    <strong>Job #{app.jobId}</strong>
                  </Link>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Applied on: {new Date(app.submittedAt).toLocaleDateString()}
                  </div>
                </div>
                <StatusBadge label={app.status.toUpperCase()} tone={app.status === 'accepted' ? 'success' : app.status === 'pending' ? 'warning' : 'danger'} />
              </div>

              {app.status === 'pending' && (
                <div style={{ marginTop: 12 }}>
                  <Button variant="secondary" onClick={() => handleWithdraw(app.jobId)}>
                    {t('withdrawApplication')}
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
