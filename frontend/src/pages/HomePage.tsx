import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Rating } from '../components/ui/Foundation'
import { LoadingState } from '../components/states/AsyncStates'
import { useAuth } from '../auth/useAuth'
import { useLanguage } from '../i18n/useLanguage'
import { jobsService } from '../services/jobsService'
import { servicesService } from '../services/servicesService'
import { localizedText, type Job, type Service } from '../types'
import { localizedName } from '../types/auth'
import { JobCard } from '../components/jobs/JobCard'

export function HomePage() {
  const { user } = useAuth()
  const { language, t } = useLanguage()
  const [jobs, setJobs] = useState<Job[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const profileLocation = user?.profile ? { village: user.profile.village, taluka: user.profile.taluka, district: user.profile.district } : undefined
    Promise.all([jobsService.listNearby(profileLocation), servicesService.listNearby(profileLocation?.village, profileLocation?.taluka, profileLocation?.district)])
      .then(([nextJobs, nextServices]) => {
        setJobs(nextJobs.slice(0, 4))
        setServices(nextServices.slice(0, 3))
      })
      .finally(() => setIsLoading(false))
  }, [user])

  const displayName = user ? localizedName(user.profile?.fullName, language) : ''

  return (
    <div className="home-page" style={{ display: 'grid', gap: 20 }}>
      <section className="welcome-banner" style={{ background: 'linear-gradient(135deg, #1b4d3e 0%, #276752 100%)', color: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(27, 77, 62, 0.15)' }}>
        <div className="eyebrow" style={{ color: '#a7f3d0', fontSize: '0.8rem', letterSpacing: '1px' }}>{t('tagline')}</div>
        <h1 style={{ margin: '6px 0 8px', fontSize: '1.6rem', fontWeight: 800 }}>
          {displayName ? `नमस्कार, ${displayName}!` : t('headline')}
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem', maxWidth: '500px' }}>{t('subheadline')}</p>
      </section>

      <section className="quick-actions-section">
        <h2 style={{ fontSize: '1.1rem', margin: '0 0 12px', fontWeight: 700 }}>{t('quickActions')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
          <Link to="/jobs" style={{ textDecoration: 'none' }}>
            <Card style={{ padding: 14, textAlign: 'center', background: '#ecfdf5', borderColor: '#a7f3d0' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>🌾</div>
              <strong style={{ color: '#065f46', fontSize: '0.9rem' }}>{t('findWork')}</strong>
            </Card>
          </Link>

          <Link to="/post-job" style={{ textDecoration: 'none' }}>
            <Card style={{ padding: 14, textAlign: 'center', background: '#f0f9ff', borderColor: '#bae6fd' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>📢</div>
              <strong style={{ color: '#075985', fontSize: '0.9rem' }}>{t('postWork')}</strong>
            </Card>
          </Link>

          <Link to="/services" style={{ textDecoration: 'none' }}>
            <Card style={{ padding: 14, textAlign: 'center', background: '#fff7ed', borderColor: '#ffedd5' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>🛠️</div>
              <strong style={{ color: '#9a3412', fontSize: '0.9rem' }}>{t('findServices')}</strong>
            </Card>
          </Link>

          <Link to="/my-posted-jobs" style={{ textDecoration: 'none' }}>
            <Card style={{ padding: 14, textAlign: 'center', background: '#faf5ff', borderColor: '#e9d5ff' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>📋</div>
              <strong style={{ color: '#6b21a8', fontSize: '0.9rem' }}>{t('myPostedJobs')}</strong>
            </Card>
          </Link>
        </div>
      </section>

      <section className="home-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>{t('recentJobs')}</h2>
          <Link to="/jobs" style={{ textDecoration: 'none', color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
            {t('viewAll')} →
          </Link>
        </div>
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="jobs-list">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      <section className="home-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>{t('nearbyServices')}</h2>
          <Link to="/services" style={{ textDecoration: 'none', color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
            {t('viewAll')} →
          </Link>
        </div>
        {isLoading ? (
          <LoadingState />
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {services.map((service) => (
              <Card key={service.id} className="service-card">
                <div className="service-avatar" aria-hidden="true">
                  {localizedText(service.name, language).slice(0, 1)}
                </div>
                <div className="service-card__body">
                  <div className="service-card__heading">
                    <h3>{localizedText(service.name, language)}</h3>
                    <Rating value={service.rating} />
                  </div>
                  <p>{localizedText(service.provider, language)} • {localizedText(service.location, language)}</p>
                  <strong>{localizedText(service.rate, language)}</strong>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
