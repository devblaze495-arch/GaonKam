import { nearbyJobs } from './mockData'
import type { Job, JobFilters, ProfileLocation, LocalizedText } from '../types'

export type JobsService = { getJobs: (filters?: JobFilters) => Promise<Job[]>; getJobById: (id: string) => Promise<Job | null>; listNearby: (profileLocation?: ProfileLocation) => Promise<Job[]> }

const wait = (duration = 300) => new Promise((resolve) => window.setTimeout(resolve, duration))
const locationValue = (value: string) => value.trim().toLocaleLowerCase()
const matches = (jobValue: LocalizedText, profileValue?: string) => Boolean(profileValue?.trim() && Object.values(jobValue).some((value) => locationValue(value) === locationValue(profileValue)))
const locationPriority = (job: Job, profileLocation?: ProfileLocation) => {
  const villageMatches = matches(job.locationDetails.village, profileLocation?.village)
  const talukaMatches = matches(job.locationDetails.taluka, profileLocation?.taluka)
  const districtMatches = matches(job.locationDetails.district, profileLocation?.district)
  if (!profileLocation?.village && !profileLocation?.taluka && !profileLocation?.district) return 3
  if (villageMatches && talukaMatches && districtMatches) return 0
  if (talukaMatches && districtMatches) return 1
  if (districtMatches) return 2
  return 3
}

const sortByProfileLocation = (jobs: Job[], profileLocation?: ProfileLocation) =>
  [...jobs].sort((a, b) => locationPriority(a, profileLocation) - locationPriority(b, profileLocation) || a.distanceKm - b.distanceKm)

export const jobsService: JobsService = {
  async getJobs(filters = {}) {
    await wait()
    let jobs = [...nearbyJobs]
    const query = filters.query?.trim().toLowerCase()
    if (query) jobs = jobs.filter((job) => [job.title, job.description, job.location, job.category, job.locationDetails, job.employer.name].some((value) => Object.values(value).some((text) => text.toLowerCase().includes(query))))
    if (filters.categoryId) jobs = jobs.filter((job) => job.categoryId === filters.categoryId)
    if (filters.maxDistance) jobs = jobs.filter((job) => job.distanceKm <= filters.maxDistance!)
    if (filters.minWage) jobs = jobs.filter((job) => job.paymentDetails.amount >= filters.minWage!)
    if (filters.date) jobs = jobs.filter((job) => filters.date === 'today' ? job.schedule.date === '2026-09-06' : filters.date === 'tomorrow' ? job.schedule.date === '2026-09-07' : job.schedule.date >= '2026-09-06' && job.schedule.date <= '2026-09-12')
    if (filters.sort === 'highest-wage') jobs.sort((a, b) => b.paymentDetails.amount - a.paymentDetails.amount)
    if (filters.sort === 'nearest') jobs = sortByProfileLocation(jobs, filters.profileLocation)
    if (filters.sort === 'newest') jobs.sort((a, b) => b.postedAt.localeCompare(a.postedAt))
    return jobs
  },
  async getJobById(id) { await wait(); return nearbyJobs.find((job) => job.id === id) ?? null },
  async listNearby(profileLocation) { return this.getJobs({ sort: 'nearest', profileLocation }) },
}
