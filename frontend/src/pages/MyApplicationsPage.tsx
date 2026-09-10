import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Calendar } from 'lucide-react'
import { Button, Card, StatusBadge } from '../components/ui/Foundation'
import { EmptyState, LoadingState } from '../components/states/AsyncStates'
import { useLanguage } from '../i18n/useLanguage'
import { applicationService, type JobApplication, type WorkerAssignment } from '../services/applicationService'
import { jobsService } from '../services/jobsService'

export function MyApplicationsPage() {
  const { language, t, localizeApplicationStatus, localizeAssignmentStatus } = useLanguage()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [assignments, setAssignments] = useState<WorkerAssignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all')

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
    const confirmMsg = language === 'mr' ? 'तुम्हाला हा अर्ज मागे घ्यायचा आहे का?' : language === 'hi' ? 'क्या आप यह आवेदन वापस लेना चाहते हैं?' : 'Are you sure you want to withdraw this application?'
    if (!window.confirm(confirmMsg)) return
    try {
      await applicationService.withdrawApplication(jobId)
      loadMyWork()
    } catch {
      alert(t('error'))
    }
  }

  async function handleMarkCompleted(jobId: string, assignmentId: string) {
    try {
      await jobsService.submitWorkCompletion(jobId, assignmentId)
      loadMyWork()
    } catch {
      alert(t('error'))
    }
  }

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === 'all') return true
    return app.status === statusFilter
  })

  if (isLoading) return <LoadingState label={t('loading')} />

  const tabAll = language === 'mr' ? 'सर्व' : language === 'hi' ? 'सभी' : 'All'
  const tabPending = language === 'mr' ? 'प्रलंबित' : language === 'hi' ? 'लंबित' : 'Pending'
  const tabAccepted = language === 'mr' ? 'स्वीकारलेले' : language === 'hi' ? 'स्वीकृत' : 'Accepted'
  const tabCompleted = language === 'mr' ? 'पूर्ण' : language === 'hi' ? 'पूर्ण' : 'Completed'

  const emptyTitle = language === 'mr' ? 'अद्याप कोणत्याही कामासाठी अर्ज केलेला नाही.' : language === 'hi' ? 'अभी तक किसी काम के लिए आवेदन नहीं किया है।' : "You haven't applied for any work yet."
  const emptyDesc = language === 'mr' ? 'गावातील उपलब्ध कामे पहा आणि अर्ज करा!' : language === 'hi' ? 'गाँव में उपलब्ध काम देखें और आवेदन करें!' : 'Browse nearby opportunities in your village and submit an application!'
  const withdrawText = language === 'mr' ? 'मागे घ्या' : language === 'hi' ? 'वापस लें' : 'Withdraw'
  const appliedOnPrefix = language === 'mr' ? 'अर्ज केला:' : language === 'hi' ? 'आवेदन तिथि:' : 'Applied on'

  return (
    <div className="applications-view">
      <h1 className="find-work-title" style={{ marginBottom: 16 }}>{t('myApplications')}</h1>

      {/* Filter tabs: All, Pending, Accepted, Completed */}
      <div className="category-scroll-bar" style={{ marginBottom: 18 }}>
        <button
          type="button"
          className={`category-pill ${statusFilter === 'all' ? 'is-active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          {tabAll}
        </button>
        <button
          type="button"
          className={`category-pill ${statusFilter === 'pending' ? 'is-active' : ''}`}
          onClick={() => setStatusFilter('pending')}
        >
          {tabPending}
        </button>
        <button
          type="button"
          className={`category-pill ${statusFilter === 'accepted' ? 'is-active' : ''}`}
          onClick={() => setStatusFilter('accepted')}
        >
          {tabAccepted}
        </button>
        <button
          type="button"
          className={`category-pill ${statusFilter === 'completed' ? 'is-active' : ''}`}
          onClick={() => setStatusFilter('completed')}
        >
          {tabCompleted}
        </button>
      </div>

      {/* Active Assignments if any */}
      {assignments.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 10px' }}>{t('activeAssignmentsTitle')}</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {assignments.map((asg) => (
              <Card key={asg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>{t('navJobs')} #{asg.jobId}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('applicationStatusLabel')} {localizeAssignmentStatus(asg.status)}</div>
                </div>
                {asg.status === 'assigned' && (
                  <Button onClick={() => handleMarkCompleted(asg.jobId, asg.id)} style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                    {t('markCompleted')}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Applications list */}
      {filteredApplications.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDesc}
        />
      ) : (
        <div className="jobs-list">
          {filteredApplications.map((app) => (
            <Card key={app.jobId} className="application-row-card">
              <div className="app-card-left">
                <div className="app-card-thumb" aria-hidden="true">
                  <Briefcase size={20} color="var(--primary)" />
                </div>
                <div className="app-card-info">
                  <Link to={`/jobs/${app.jobId}`} className="app-card-title">
                    {t('navJobs')} #{app.jobId}
                  </Link>
                  <div className="app-card-sub">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <Calendar size={12} /> {appliedOnPrefix} {new Date(app.submittedAt).toLocaleDateString(language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="app-card-right">
                <StatusBadge
                  label={localizeApplicationStatus(app.status)}
                  tone={app.status === 'accepted' ? 'success' : app.status === 'pending' ? 'warning' : 'danger'}
                />

                {app.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => handleWithdraw(app.jobId)}
                    className="withdraw-text-btn"
                  >
                    {withdrawText}
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
