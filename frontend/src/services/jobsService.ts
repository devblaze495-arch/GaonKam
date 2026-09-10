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

export const jobsService = {
  async getJobs(filters?: JobFilters): Promise<Job[]> {
    const params = new URLSearchParams()
    if (filters?.query) params.set('query', filters.query)
    if (filters?.categoryId && (filters.categoryId as string) !== 'all') params.set('categoryId', filters.categoryId)
    if (filters?.maxDistance) params.set('maxDistance', String(filters.maxDistance))
    if (filters?.sort) params.set('sort', filters.sort)
    if (filters?.profileLocation?.village) params.set('village', filters.profileLocation.village)
    if (filters?.profileLocation?.taluka) params.set('taluka', filters.profileLocation.taluka)
    if (filters?.profileLocation?.district) params.set('district', filters.profileLocation.district)

    const queryStr = params.toString()
    return apiRequest<Job[]>(`/jobs${queryStr ? `?${queryStr}` : ''}`)
  },

  async getJobById(id: string): Promise<Job | null> {
    try {
      return await apiRequest<Job>(`/jobs/${id}`)
    } catch {
      return null
    }
  },

  async listNearby(profileLocation?: ProfileLocation): Promise<Job[]> {
    const params = new URLSearchParams()
    if (profileLocation?.village) params.set('village', profileLocation.village)
    if (profileLocation?.taluka) params.set('taluka', profileLocation.taluka)
    if (profileLocation?.district) params.set('district', profileLocation.district)
    const queryStr = params.toString()
    return apiRequest<Job[]>(`/jobs/nearby${queryStr ? `?${queryStr}` : ''}`)
  },

  async createJob(input: CreateJobInput): Promise<Job> {
    const payload = {
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
      wageAmount: Number(input.paymentAmount),
      paymentAmount: Number(input.paymentAmount),
      wageType: input.paymentType || 'daily',
      paymentType: input.paymentType || 'daily',
      workersRequired: Number(input.workersRequired) || 1,
      workDate: input.workDate,
      startTime: input.startTime || '08:00',
      village: input.village,
      taluka: input.taluka || input.village,
      district: input.district,
      state: 'Maharashtra',
      requiredSkills: input.requiredSkillIds || [],
      requiredSkillIds: input.requiredSkillIds || [],
    }

    return apiRequest<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async editJob(id: string, input: Partial<CreateJobInput>): Promise<Job> {
    return apiRequest<Job>(`/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    })
  },

  async cancelJob(id: string): Promise<Job> {
    return apiRequest<Job>(`/jobs/${id}/cancel`, {
      method: 'PATCH',
    })
  },

  async getMyPostedJobs(): Promise<Job[]> {
    return apiRequest<Job[]>('/jobs/me/posted')
  },

  async getJobApplicationsForPoster(jobId: string): Promise<JobApplicationItem[]> {
    return apiRequest<JobApplicationItem[]>(`/jobs/${jobId}/applications`)
  },

  async updateApplicationStatus(jobId: string, applicationId: string, status: 'accepted' | 'rejected') {
    return apiRequest<any>(`/jobs/${jobId}/applications/${applicationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },

  async getJobAssignmentsForPoster(jobId: string): Promise<JobAssignmentItem[]> {
    return apiRequest<JobAssignmentItem[]>(`/jobs/${jobId}/assignments`)
  },

  async submitWorkCompletion(jobId: string, assignmentId: string) {
    return apiRequest<any>(`/jobs/${jobId}/assignments/${assignmentId}/complete`, {
      method: 'POST',
    })
  },

  async confirmWorkCompletion(jobId: string, assignmentId: string) {
    return apiRequest<any>(`/jobs/${jobId}/assignments/${assignmentId}/confirm`, {
      method: 'POST',
    })
  },
}
