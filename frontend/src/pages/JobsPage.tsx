import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, MapPin } from 'lucide-react'
import { Card } from '../components/ui/Foundation'
import { EmptyState, ErrorState, LoadingState } from '../components/states/AsyncStates'
import { JobCard } from '../components/jobs/JobCard'
import { useAuth } from '../auth/useAuth'
import { useLanguage } from '../i18n/useLanguage'
import { useJobText } from '../i18n/jobsTranslations'
import { jobCategories } from '../data/jobData'
import { profileService } from '../services/profileService'
import { jobsService } from '../services/jobsService'
import type { Job, JobCategoryId, JobFilters, ProfileLocation } from '../types'

export function JobsPage() {
  const { language, t } = useLanguage()
  const jt = useJobText(language)
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [profileLocation, setProfileLocation] = useState<ProfileLocation>()
  const [filters, setFilters] = useState<JobFilters>({ sort: 'nearest' })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    if (!user) return
    profileService
      .getProfile(user)
      .then((profile) => setProfileLocation({ village: profile.village, taluka: profile.taluka, district: profile.district }))
      .catch(() => setProfileLocation(undefined))
  }, [user])

  useEffect(() => {
    jobsService
      .getJobs({ ...filters, categoryId: selectedCategory === 'all' ? undefined : (selectedCategory as JobCategoryId), profileLocation })
      .then(setJobs)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false))
  }, [filters, selectedCategory, profileLocation])

  const userLocationLabel = profileLocation?.village
    ? `${profileLocation.village}, ${profileLocation.district}`
    : ''

  return (
    <div className="find-work-page">
      {/* Header bar with location chip */}
      <div className="find-work-header">
        <h1 className="find-work-title">{t('navJobs')}</h1>
        {userLocationLabel && (
          <div className="header-location-badge">
            <MapPin size={13} color="var(--primary)" />
            <span>{userLocationLabel}</span>
          </div>
        )}
      </div>

      {/* Search and filter controls */}
      <div className="search-with-filter-row">
        <div className="find-work-search-box">
          <Search size={17} className="search-icon-svg" />
          <input
            type="text"
            placeholder={t('searchJobsPlaceholder') || jt('searchJobsPlaceholder')}
            value={filters.query ?? ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
            className="find-work-search-input"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`filter-toggle-button ${showFilters ? 'is-active' : ''}`}
          aria-label={t('filterJobs')}
        >
          <SlidersHorizontal size={17} />
        </button>
      </div>

      {/* Category Pills horizontal bar */}
      <div className="category-scroll-bar">
        <button
          type="button"
          className={`category-pill ${selectedCategory === 'all' ? 'is-active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          {jt('any')}
        </button>
        {jobCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`category-pill ${selectedCategory === cat.id ? 'is-active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name[language] || cat.name.en}
          </button>
        ))}
      </div>

      {/* Optional dropdown filter sheet */}
      {showFilters && (
        <Card style={{ marginBottom: 16, backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <strong style={{ fontSize: '0.9rem' }}>{t('sortAndDistance')}</strong>
            <button
              className="text-button"
              onClick={() => { setFilters({ sort: 'nearest' }); setSelectedCategory('all'); setShowFilters(false) }}
              style={{ fontSize: '0.8rem', color: 'var(--primary)' }}
            >
              {jt('clearFilters')}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('sortByLabel')}</label>
              <select
                className="form-control"
                value={filters.sort ?? 'nearest'}
                onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value as any }))}
              >
                <option value="nearest">{t('sortNearest')}</option>
                <option value="highest-wage">{t('sortHighestWage')}</option>
                <option value="newest">{t('sortNewest')}</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('distanceLabel')}</label>
              <select
                className="form-control"
                value={filters.maxDistance ?? ''}
                onChange={(e) => setFilters((p) => ({ ...p, maxDistance: e.target.value ? Number(e.target.value) : undefined }))}
              >
                <option value="">{t('anyDistance')}</option>
                <option value="5">{t('within5km')}</option>
                <option value="10">{t('within10km')}</option>
                <option value="20">{t('within20km')}</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Main Jobs Listing */}
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState title={jt('applicationFailed')} retryLabel={jt('retry')} onRetry={() => setError(false)} />
      ) : jobs.length ? (
        <div className="jobs-list">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={t('noJobsNearby')}
          description={jt('noResultsHint')}
        />
      )}
    </div>
  )
}
