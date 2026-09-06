import { nearbyServices } from './mockData'
import type { Service } from '../types'

export type ServicesService = {
  listNearby: () => Promise<Service[]>
}

export const servicesService: ServicesService = {
  async listNearby() {
    return nearbyServices
  },
}