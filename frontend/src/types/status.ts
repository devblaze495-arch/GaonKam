import type { JobStatus } from './index'

export type StatusTone = 'success' | 'warning' | 'danger' | 'info'

export const jobStatusTone: Record<JobStatus, StatusTone> = {
  open: 'success',
  pending: 'warning',
  'in-progress': 'info',
  completed: 'success',
  cancelled: 'danger',
  expired: 'warning',
}