import { nearbyJobs } from './mockData'
import type { Job } from '../types'

export type JobsService = {
  listNearby: () => Promise<Job[]>
}

export const jobsService: JobsService = {
  async listNearby() {
    return nearbyJobs
  },
}
