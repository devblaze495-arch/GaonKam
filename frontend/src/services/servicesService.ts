import { nearbyServices } from './mockData'
import type { Service } from '../types'
import { apiRequest } from './apiClient'

export type CreateServiceInput = {
  name: { mr: string; hi?: string; en?: string } | string
  description: { mr: string; hi?: string; en?: string } | string
  categoryId?: string
  rateType: 'hourly' | 'daily' | 'fixed'
  rateAmount: number
  village: string
  taluka: string
  district: string
  phone?: string
}

export type ServicesService = {
  listNearby: (village?: string, taluka?: string, district?: string) => Promise<Service[]>
  getServices: (params?: { categoryId?: string; query?: string }) => Promise<Service[]>
  createService: (input: CreateServiceInput) => Promise<Service>
  updateService: (serviceId: string, input: Partial<CreateServiceInput>) => Promise<Service>
  deleteService: (serviceId: string) => Promise<any>
}

export const servicesService: ServicesService = {
  async listNearby(village, taluka, district) {
    try {
      const queryParams = new URLSearchParams()
      if (village) queryParams.set('village', village)
      if (taluka) queryParams.set('taluka', taluka)
      if (district) queryParams.set('district', district)

      const qs = queryParams.toString()
      const services = await apiRequest<Service[]>(`/services/nearby${qs ? `?${qs}` : ''}`)
      return services
    } catch {
      return nearbyServices
    }
  },

  async getServices(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (params.categoryId) queryParams.set('categoryId', params.categoryId)
      if (params.query) queryParams.set('query', params.query)

      const qs = queryParams.toString()
      const services = await apiRequest<Service[]>(`/services${qs ? `?${qs}` : ''}`)
      return services
    } catch {
      return nearbyServices
    }
  },

  async createService(input) {
    return apiRequest<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  async updateService(serviceId, input) {
    return apiRequest<Service>(`/services/${serviceId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    })
  },

  async deleteService(serviceId) {
    return apiRequest<any>(`/services/${serviceId}`, {
      method: 'DELETE',
    })
  },
}
