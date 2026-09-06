import { useEffect, useState } from 'react'
import { EmptyState, ErrorState, LoadingState } from '../components/states/AsyncStates'
import { Button, Card, Rating, SearchInput, StatusBadge } from '../components/ui/Foundation'
import { useLanguage } from '../i18n/useLanguage'
import { useAuth } from '../auth/useAuth'
import { localizedName } from '../types/auth'
import { jobsService } from '../services/jobsService'
import { servicesService } from '../services/servicesService'
import { localizedText, type Job, type Service } from '../types'

export function HomePage() {
  const { language, t } = useLanguage()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [jobs, setJobs] = useState<Job[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true
    Promise.all([jobsService.listNearby(), servicesService.listNearby()])
      .then(([nextJobs, nextServices]) => {
        if (!isMounted) return
        setJobs(nextJobs)
        setServices(nextServices)
      })
      .catch(() => {
        if (isMounted) setHasError(true)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  const visibleJobs = jobs.filter((job) => localizedText(job.title, language).includes(search) || localizedText(job.category, language).includes(search))
  const displayName = localizedName(user?.profile?.fullName, language)

  return (
    <section className="page-section">
      <div className="topbar">
        <div><span className="eyebrow">{t('location')}</span><h1>{t('welcome').replace('{name}', displayName)}</h1><p>{t('homeIntro')}</p></div>
        <button className="profile-chip" aria-label={t('profile')}><span>{language === 'en' ? 'S' : 'स'}</span><i /></button>
      </div>

      <SearchInput label={t('searchPlaceholder')} placeholder={t('searchPlaceholder')} value={search} onChange={(event) => setSearch(event.target.value)} />

      <div className="quick-actions">
        <div className="section-heading"><div><span className="eyebrow">{t('today')}</span><h2>{t('quickActions')}</h2></div></div>
        <div className="action-grid">
          <ActionTile tone="green" icon="↗" label={t('findWork')} />
          <ActionTile tone="orange" icon="+" label={t('postWork')} />
          <ActionTile tone="blue" icon="⌕" label={t('findService')} />
          <ActionTile tone="plum" icon="✦" label={t('offerService')} />
        </div>
      </div>

      <div className="section-heading"><div><span className="eyebrow">{t('location')}</span><h2>{t('nearbyWork')}</h2></div><Button variant="quiet">{t('viewAll')} <span aria-hidden="true">→</span></Button></div>
      <div className="job-list">{isLoading ? <LoadingState /> : hasError ? <ErrorState title={t('errorTitle')} retryLabel={t('retry')} onRetry={() => window.location.reload()} /> : visibleJobs.length ? visibleJobs.map((job) => <Card key={job.id} className="job-card"><div className="job-card__top"><span className="category-mark">{localizedText(job.category, language).slice(0, 2)}</span><StatusBadge label={t('open')} tone="success" /></div><h3>{localizedText(job.title, language)}</h3><p className="muted">{localizedText(job.location, language)} · {localizedText(job.distance, language)}</p><div className="job-card__meta"><strong>{localizedText(job.payment, language)} <small>{t('perDay')}</small></strong><span>{localizedText(job.dateLabel, language)}</span></div><div className="job-card__footer"><span>{t('postedBy')} {localizedText(job.postedBy, language)}</span><Button variant="secondary">{t('viewDetails')}</Button></div></Card>) : <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} />}</div>

      <div className="section-heading section-heading--services"><div><span className="eyebrow">{t('location')}</span><h2>{t('nearbyServices')}</h2></div><Button variant="quiet">{t('viewAll')} <span aria-hidden="true">→</span></Button></div>
      <div className="service-list">{isLoading ? <LoadingState /> : services.map((service) => <Card key={service.id} className="service-card"><div className="service-avatar" aria-hidden="true">{localizedText(service.name, language).slice(0, 1)}</div><div className="service-card__body"><div className="service-card__heading"><h3>{localizedText(service.name, language)}</h3><Rating value={service.rating} /></div><p>{localizedText(service.provider, language)} · {localizedText(service.location, language)}</p><strong>{localizedText(service.rate, language)}</strong></div></Card>)}</div>
    </section>
  )
}

function ActionTile({ tone, icon, label }: { tone: string; icon: string; label: string }) {
  return <button className={`action-tile action-tile--${tone}`}><span className="action-tile__icon" aria-hidden="true">{icon}</span><span>{label}</span><span className="action-tile__arrow" aria-hidden="true">↗</span></button>
}
