import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, PlusCircle, Wrench, FileText, ArrowRight } from 'lucide-react'
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
      {/* Greeting Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>
            {displayName ? `${t('welcome')}, ${displayName}` : t('headline')}
          </h1>
          <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {t('subheadline')}
          </p>
        </div>
      </div>

      {/* Quick Action Grid */}
      <section className="action-grid">
        <Link to="/jobs" className="action-card">
          <div className="action-card__icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Briefcase size={20} />
          </div>
          <div>
            <h3 className="action-card__title">{t('findWork')}</h3>
            <p className="action-card__desc">{t('applyLocalJobs')}</p>
          </div>
        </Link>

        <Link to="/post-job" className="action-card">
          <div className="action-card__icon" style={{ backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)' }}>
            <PlusCircle size={20} />
          </div>
          <div>
            <h3 className="action-card__title">{t('postWork')}</h3>
            <p className="action-card__desc">{t('hireVillageWorkers')}</p>
          </div>
        </Link>

        <Link to="/services" className="action-card">
          <div className="action-card__icon" style={{ backgroundColor: 'var(--accent-olive-light)', color: 'var(--accent-olive)' }}>
            <Wrench size={20} />
          </div>
          <div>
            <h3 className="action-card__title">{t('findServices')}</h3>
            <p className="action-card__desc">{t('findServicesTitle')}</p>
          </div>
        </Link>

        <Link to="/my-applications" className="action-card">
          <div className="action-card__icon" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
            <FileText size={20} />
          </div>
          <div>
            <h3 className="action-card__title">{t('myApplications')}</h3>
            <p className="action-card__desc">{t('trackProgressTitle')}</p>
          </div>
        </Link>
      </section>

      {/* Tasteful Rural Banner */}
      <div className="rural-banner">
        <h2>{t('strongerVillagesTagline')}</h2>
        <p>{t('brighterTomorrowsTagline')}</p>
      </div>

      {/* Recent Jobs Section */}
      <section className="home-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>{t('recentJobs')}</h2>
          <Link to="/jobs" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}>
            {t('viewAll')} <ArrowRight size={14} />
          </Link>
        </div>
        {isLoading ? (
          <LoadingState />
        ) : jobs.length > 0 ? (
          <div className="jobs-list">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <Card style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{t('noJobsNearbyRightNow')}</p>
            <Link to="/post-job" style={{ textDecoration: 'none', display: 'inline-block', marginTop: 12 }}>
              <span className="button button--primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>{t('postWorkCta')}</span>
            </Link>
          </Card>
        )}
      </section>

      {/* Nearby Services Section */}
      <section className="home-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>{t('nearbyServices')}</h2>
          <Link to="/services" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}>
            {t('viewAll')} <ArrowRight size={14} />
          </Link>
        </div>
        {isLoading ? (
          <LoadingState />
        ) : services.length > 0 ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {services.map((service) => (
              <Card key={service.id} className="service-card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-olive-light)', color: 'var(--accent-olive)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                  {localizedText(service.name, language).slice(0, 1)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{localizedText(service.name, language)}</h3>
                    <Rating value={service.rating} />
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {localizedText(service.provider, language)} • {localizedText(service.location, language)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{t('noServicesNearbyRightNow')}</p>
            <Link to="/my-services" style={{ textDecoration: 'none', display: 'inline-block', marginTop: 12 }}>
              <span className="button button--secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>{t('offerServiceCta')}</span>
            </Link>
          </Card>
        )}
      </section>
    </div>
  )
}
