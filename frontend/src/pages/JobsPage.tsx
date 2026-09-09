import { useEffect, useState } from 'react'
import { Button, Card, SearchInput, Select } from '../components/ui/Foundation'
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
  const { language } = useLanguage()
  const jt = useJobText(language)
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [profileLocation, setProfileLocation] = useState<ProfileLocation>()
  const [filters, setFilters] = useState<JobFilters>({ sort: 'nearest' })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (!user) return
    profileService.getProfile(user).then((profile) => setProfileLocation({ village: profile.village, taluka: profile.taluka, district: profile.district })).catch(() => setProfileLocation(undefined))
  }, [user])

  useEffect(() => {
    jobsService.getJobs({ ...filters, profileLocation }).then(setJobs).catch(() => setError(true)).finally(() => setIsLoading(false))
  }, [filters, profileLocation])

  const setFilter = (next: Partial<JobFilters>) => setFilters((current) => ({ ...current, ...next }))
  const clearFilters = () => { setFilters({ sort: 'nearest' }); setShowFilters(false) }

  return (
    <section className="page-section jobs-page">
      <div className="section-heading"><div><span className="eyebrow">GaavKaam</span><h1>{jt('jobsTitle')}</h1></div><Button variant="secondary" onClick={() => setShowFilters((value) => !value)}>{jt('filters')}</Button></div>
      <SearchInput label={jt('searchJobs')} placeholder={jt('searchJobsPlaceholder')} value={filters.query ?? ''} onChange={(event) => setFilter({ query: event.target.value })} />
      <div className="jobs-toolbar"><Select aria-label={jt('sort')} value={filters.sort ?? 'nearest'} onChange={(event) => setFilter({ sort: event.target.value as JobFilters['sort'] })}><option value="nearest">{jt('nearest')}</option><option value="highest-wage">{jt('highestWage')}</option><option value="newest">{jt('newest')}</option></Select>{(filters.query || filters.categoryId || filters.maxDistance || filters.minWage) && <button className="text-button" onClick={clearFilters}>{jt('clearFilters')}</button>}</div>
      {showFilters && <FilterPanel filters={filters} setFilter={setFilter} clearFilters={clearFilters} jt={jt} language={language} />}
      {isLoading ? <LoadingState /> : error ? <ErrorState title={jt('applicationFailed')} retryLabel={jt('retry')} onRetry={() => setError(false)} /> : jobs.length ? <div className="jobs-list">{jobs.map((job) => <JobCard key={job.id} job={job} />)}</div> : <EmptyState title={filters.query ? jt('noSearchResults') : jt('noJobs')} description={jt('noResultsHint')} />}
    </section>
  )
}

function FilterPanel({ filters, setFilter, clearFilters, jt, language }: { filters: JobFilters; setFilter: (value: Partial<JobFilters>) => void; clearFilters: () => void; jt: ReturnType<typeof useJobText>; language: 'mr' | 'hi' | 'en' }) {
  return <Card className="jobs-filter-panel"><div className="filter-panel__heading"><h2>{jt('filters')}</h2><button className="text-button" onClick={clearFilters}>{jt('clearFilters')}</button></div><label className="form-field"><span>{jt('category')}</span><Select value={filters.categoryId ?? ''} onChange={(event) => setFilter({ categoryId: (event.target.value || undefined) as JobCategoryId | undefined })}><option value="">{jt('any')}</option>{jobCategories.map((category) => <option key={category.id} value={category.id}>{category.name[language]}</option>)}</Select></label><label className="form-field"><span>{jt('distance')}</span><Select value={filters.maxDistance ?? ''} onChange={(event) => setFilter({ maxDistance: event.target.value ? Number(event.target.value) : undefined })}><option value="">{jt('anyDistance')}</option><option value="5">{jt('within5')}</option><option value="10">{jt('within10')}</option><option value="20">{jt('within20')}</option></Select></label><label className="form-field"><span>{jt('wage')}</span><Select value={filters.minWage ?? ''} onChange={(event) => setFilter({ minWage: event.target.value ? Number(event.target.value) : undefined })}><option value="">{jt('any')}</option><option value="500">{jt('wage500')}</option><option value="700">{jt('wage700')}</option><option value="1000">{jt('wage1000')}</option></Select></label><label className="form-field"><span>{jt('date')}</span><Select value={filters.date ?? ''} onChange={(event) => setFilter({ date: (event.target.value || undefined) as JobFilters['date'] })}><option value="">{jt('any')}</option><option value="today">{jt('today')}</option><option value="tomorrow">{jt('tomorrow')}</option><option value="this-week">{jt('thisWeek')}</option></Select></label></Card>
}
