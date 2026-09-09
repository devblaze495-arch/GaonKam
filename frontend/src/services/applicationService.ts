import type { ApplicationStatus } from '../types'
import { apiRequest } from './apiClient'

const storageKey = 'gaavkaam.applications'

export type JobApplication = { jobId: string; status: ApplicationStatus; submittedAt: string }

export type WorkerAssignment = {
  id: string
  jobId: string
  status: 'assigned' | 'worker_completed' | 'completed' | 'cancelled'
  assignedAt: string
  job?: any
}

export type ApplicationService = {
  applyForJob: (jobId: string, message?: string) => Promise<JobApplication>
  getMyApplications: () => Promise<JobApplication[]>
  getApplicationStatus: (jobId: string) => Promise<JobApplication | null>
  withdrawApplication: (jobId: string) => Promise<any>
  getMyAssignments: () => Promise<WorkerAssignment[]>
}

function read(): JobApplication[] {
  const value = window.localStorage.getItem(storageKey)
  return value ? (JSON.parse(value) as JobApplication[]) : []
}

function save(applications: JobApplication[]): JobApplication[] {
  window.localStorage.setItem(storageKey, JSON.stringify(applications))
  return applications
}

export const applicationService: ApplicationService = {
  async applyForJob(jobId: string, message?: string) {
    try {
      const res = await apiRequest<any>(`/jobs/${jobId}/applications`, {
        method: 'POST',
        body: JSON.stringify({ message: message || 'Interested in this work.' }),
      })

      const application: JobApplication = {
        jobId: res.jobId || jobId,
        status: (res.status || 'pending') as ApplicationStatus,
        submittedAt: res.submittedAt || new Date().toISOString(),
      }

      const applications = read().filter((a) => a.jobId !== jobId)
      save([...applications, application])
      return application
    } catch {
      const applications = read()
      const existing = applications.find((item) => item.jobId === jobId)
      if (existing) return existing
      const application = { jobId, status: 'pending' as ApplicationStatus, submittedAt: new Date().toISOString() }
      save([...applications, application])
      return application
    }
  },

  async getMyApplications() {
    try {
      const res = await apiRequest<any[]>('/applications/me')
      const apps: JobApplication[] = res.map((app) => ({
        jobId: app.jobId,
        status: (app.status || 'pending') as ApplicationStatus,
        submittedAt: app.submittedAt || new Date().toISOString(),
      }))
      save(apps)
      return apps
    } catch {
      return read()
    }
  },

  async getApplicationStatus(jobId: string) {
    try {
      const res = await apiRequest<any>(`/jobs/${jobId}/application`)
      if (!res) return read().find((item) => item.jobId === jobId) ?? null
      return {
        jobId: res.jobId || jobId,
        status: (res.status || 'pending') as ApplicationStatus,
        submittedAt: res.submittedAt || new Date().toISOString(),
      }
    } catch {
      return read().find((item) => item.jobId === jobId) ?? null
    }
  },

  async withdrawApplication(jobId: string) {
    const res = await apiRequest<any>(`/jobs/${jobId}/application/withdraw`, {
      method: 'PATCH',
    })
    const apps = read().filter((a) => a.jobId !== jobId)
    save(apps)
    return res
  },

  async getMyAssignments() {
    return apiRequest<WorkerAssignment[]>('/assignments/me')
  },
}
