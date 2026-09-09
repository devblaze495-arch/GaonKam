import { nearbyJobs } from './mockData'
import type { Job, JobFilters, ProfileLocation } from '../types'
import { apiRequest } from './apiClient'

export type CreateJobInput = {
  title: string
  description: string
  categoryId: string
  requiredSkillIds: string[]
  paymentType: 'daily' | 'fixed'
  paymentAmount: number
  workersRequired: number
  workDate: string
  startTime: string
  village: string
  taluka: string
  district: string
}

export type JobApplicationItem = {
  id: string
  jobId: string
  applicantId: string
  applicantName: string
  applicantVillage: string
  applicantDistrict: string
  trustScore: number
  rating: number
  reviewCount: number
  skills: string[]
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  submittedAt: string
}

export type JobAssignmentItem = {
  id: string
  jobId: string
  workerId: string
  workerName: string
  status: 'assigned' | 'worker_completed' | 'completed' | 'cancelled'
  workerCompletedAt?: string
  confirmedAt?: string
}

export type JobsService = {
  getJobs: (filters?: JobFilters) => Promise<Job[]>
  getJobById: (id: string) => Promise<Job | null>
  listNearby: (profileLocation?: ProfileLocation) => Promise<Job[]>
  createJob: (input: CreateJobInput) => Promise<Job>
  editJob: (id: string, input: Partial<CreateJobInput>) => Promise<Job>
  cancelJob: (id: string) => Promise<Job>
  getMyPostedJobs: () => Promise<Job[]>
  getJobApplicationsForPoster: (jobId: string) => Promise<JobApplicationItem[]>
  updateApplicationStatus: (jobId: string, applicationId: string, status: 'accepted' | 'rejected') => Promise<any>
  getJobAssignmentsForPoster: (jobId: string) => Promise<JobAssignmentItem[]>
  submitWorkCompletion: (jobId: string, assignmentId: string) => Promise<any>
  confirmWorkCompletion: (jobId: string, assignmentId: string) => Promise<any>
  createJobRating: (jobId: string, input: { targetUserId: string; rating: number; comment?: string }) => Promise<any>
  createJobDispute: (jobId: string, input: { reason: string; description: string }) => Promise<any>
}

const locationValue = (value: string) => value.trim().toLocaleLowerCase()
const matches = (jobValue: any, profileValue?: string) =>
  Boolean(
    profileValue?.trim() &&
      Object.values(jobValue || {}).some((value) => locationValue(String(value)) === locationValue(profileValue)),
  )

const locationPriority = (job: Job, profileLocation?: ProfileLocation) => {
  const villageMatches = matches(job.locationDetails?.village, profileLocation?.village)
  const talukaMatches = matches(job.locationDetails?.taluka, profileLocation?.taluka)
  const districtMatches = matches(job.locationDetails?.district, profileLocation?.district)
  if (!profileLocation?.village && !profileLocation?.taluka && !profileLocation?.district) return 3
  if (villageMatches && talukaMatches && districtMatches) return 0
  if (talukaMatches && districtMatches) return 1
  if (districtMatches) return 2
  return 3
}

const sortByProfileLocation = (jobs: Job[], profileLocation?: ProfileLocation) =>
  [...jobs].sort(
    (a, b) =>
      locationPriority(a, profileLocation) - locationPriority(b, profileLocation) ||
      (a.distanceKm || 0) - (b.distanceKm || 0),
  )

function fallbackGetJobs(filters: JobFilters = {}): Job[] {
  let jobs = [...nearbyJobs]
  const query = filters.query?.trim().toLowerCase()
  if (query)
    jobs = jobs.filter((job) =>
      [job.title, job.description, job.location, job.category, job.locationDetails, job.employer.name].some(
        (value) => Object.values(value || {}).some((text) => String(text).toLowerCase().includes(query)),
      ),
    )
  if (filters.categoryId) jobs = jobs.filter((job) => job.categoryId === filters.categoryId)
  if (filters.maxDistance) jobs = jobs.filter((job) => (job.distanceKm || 0) <= filters.maxDistance!)
  if (filters.minWage) jobs = jobs.filter((job) => job.paymentDetails.amount >= filters.minWage!)
  if (filters.date)
    jobs = jobs.filter((job) =>
      filters.date === 'today'
        ? job.schedule.date === '2026-09-06'
        : filters.date === 'tomorrow'
          ? job.schedule.date === '2026-09-07'
          : job.schedule.date >= '2026-09-06' && job.schedule.date <= '2026-09-12',
    )
  if (filters.sort === 'highest-wage') jobs.sort((a, b) => b.paymentDetails.amount - a.paymentDetails.amount)
  if (filters.sort === 'nearest') jobs = sortByProfileLocation(jobs, filters.profileLocation)
  if (filters.sort === 'newest') jobs.sort((a, b) => b.postedAt.localeCompare(a.postedAt))
  return jobs
}

export const jobsService: JobsService = {
  async getJobs(filters = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (filters.query) queryParams.set('query', filters.query)
      if (filters.categoryId) queryParams.set('categoryId', filters.categoryId)
      if (filters.maxDistance) queryParams.set('maxDistance', String(filters.maxDistance))
      if (filters.minWage) queryParams.set('minWage', String(filters.minWage))
      if (filters.date) queryParams.set('date', filters.date)
      if (filters.sort) queryParams.set('sort', filters.sort)
      if (filters.profileLocation?.village) queryParams.set('village', filters.profileLocation.village)
      if (filters.profileLocation?.taluka) queryParams.set('taluka', filters.profileLocation.taluka)
      if (filters.profileLocation?.district) queryParams.set('district', filters.profileLocation.district)

      const qs = queryParams.toString()
      const jobs = await apiRequest<Job[]>(`/jobs${qs ? `?${qs}` : ''}`)
      return jobs
    } catch {
      return fallbackGetJobs(filters)
    }
  },

  async getJobById(id) {
    try {
      const job = await apiRequest<Job>(`/jobs/${id}`)
      return job
    } catch {
      return nearbyJobs.find((job) => job.id === id) ?? null
    }
  },

  async listNearby(profileLocation) {
    try {
      const queryParams = new URLSearchParams()
      if (profileLocation?.village) queryParams.set('village', profileLocation.village)
      if (profileLocation?.taluka) queryParams.set('taluka', profileLocation.taluka)
      if (profileLocation?.district) queryParams.set('district', profileLocation.district)

      const qs = queryParams.toString()
      const jobs = await apiRequest<Job[]>(`/jobs/nearby${qs ? `?${qs}` : ''}`)
      return jobs
    } catch {
      return this.getJobs({ sort: 'nearest', profileLocation })
    }
  },

  async createJob(input) {
    return apiRequest<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  async editJob(id, input) {
    return apiRequest<Job>(`/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    })
  },

  async cancelJob(id) {
    return apiRequest<Job>(`/jobs/${id}/cancel`, {
      method: 'PATCH',
    })
  },

  async getMyPostedJobs() {
    return apiRequest<Job[]>('/jobs/me/posted')
  },

  async getJobApplicationsForPoster(jobId) {
    return apiRequest<JobApplicationItem[]>(`/jobs/${jobId}/applications`)
  },

  async updateApplicationStatus(jobId, applicationId, status) {
    return apiRequest<any>(`/jobs/${jobId}/applications/${applicationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },

  async getJobAssignmentsForPoster(jobId) {
    return apiRequest<JobAssignmentItem[]>(`/jobs/${jobId}/assignments`)
  },

  async submitWorkCompletion(jobId, assignmentId) {
    return apiRequest<any>(`/jobs/${jobId}/assignments/${assignmentId}/completion`, {
      method: 'POST',
    })
  },

  async confirmWorkCompletion(jobId, assignmentId) {
    return apiRequest<any>(`/jobs/${jobId}/assignments/${assignmentId}/completion`, {
      method: 'PATCH',
    })
  },

  async createJobRating(jobId, input) {
    return apiRequest<any>(`/jobs/${jobId}/ratings`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  async createJobDispute(jobId, input) {
    return apiRequest<any>(`/jobs/${jobId}/disputes`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },
}
