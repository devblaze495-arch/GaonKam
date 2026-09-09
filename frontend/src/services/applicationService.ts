import type { ApplicationStatus } from '../types'

const storageKey = 'gaavkaam.applications'
const wait = (duration = 350) => new Promise((resolve) => window.setTimeout(resolve, duration))

export type JobApplication = { jobId: string; status: ApplicationStatus; submittedAt: string }
export type ApplicationService = { applyForJob: (jobId: string) => Promise<JobApplication>; getMyApplications: () => Promise<JobApplication[]>; getApplicationStatus: (jobId: string) => Promise<JobApplication | null> }

function read() { const value = window.localStorage.getItem(storageKey); return value ? JSON.parse(value) as JobApplication[] : [] }
function save(applications: JobApplication[]) { window.localStorage.setItem(storageKey, JSON.stringify(applications)); return applications }

export const applicationService: ApplicationService = {
  async applyForJob(jobId) { await wait(); const applications = read(); const existing = applications.find((item) => item.jobId === jobId); if (existing) return existing; const application = { jobId, status: 'pending' as ApplicationStatus, submittedAt: new Date().toISOString() }; save([...applications, application]); return application },
  async getMyApplications() { await wait(150); return read() },
  async getApplicationStatus(jobId) { await wait(150); return read().find((item) => item.jobId === jobId) ?? null },
}
