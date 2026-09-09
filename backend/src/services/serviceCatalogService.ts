import { Prisma } from '@prisma/client'
import { prisma } from '../utils/prisma.js'
import { seedAllMasterData } from '../utils/seedData.js'
import { formatLocalizedText, calculateLocalityDistance } from '../utils/jobMapper.js'

export class ServiceCatalogService {
  private static mapServiceToDto(service: any) {
    const providerName =
      service.providerNameMr ||
      service.providerNameHi ||
      service.providerNameEn ||
      service.provider?.fullName ||
      'स्थानिक सेवा पुरवठादार'

    const locationStr =
      service.location ||
      [service.village, service.taluka, service.district].filter(Boolean).join(', ') ||
      'स्थानिक परिसर'

    const rateStr = service.rateMr || service.rateEn || (service.dailyRate ? `₹${service.dailyRate}` : 'चर्चेनुसार')

    return {
      id: service.id,
      name: formatLocalizedText(
        service.title || service.nameEn || 'सेवा',
        service.nameMr,
        service.nameHi,
        service.nameEn,
      ),
      description: formatLocalizedText(
        service.description || '',
        service.descriptionMr,
        service.descriptionHi,
        service.descriptionEn,
      ),
      provider: formatLocalizedText(
        providerName,
        providerName,
        providerName,
        service.providerNameEn || providerName,
      ),
      location: formatLocalizedText(locationStr, locationStr, locationStr, locationStr),
      rate: formatLocalizedText(rateStr, service.rateMr, service.rateHi, service.rateEn),
      rating: service.rating ?? 0.0,
      available: service.available ?? true,
    }
  }

  static async getServices(filters: {
    category?: string
    location?: string
    availability?: boolean | string
  }) {
    await seedAllMasterData()

    const where: Prisma.ServiceWhereInput = {}

    if (filters.category) {
      where.categoryId = filters.category
    }

    if (filters.availability !== undefined) {
      const avail = String(filters.availability).toLowerCase() === 'true'
      where.available = avail
    }

    if (filters.location && filters.location.trim()) {
      const loc = filters.location.trim()
      where.OR = [
        { location: { contains: loc, mode: 'insensitive' } },
        { village: { contains: loc, mode: 'insensitive' } },
        { taluka: { contains: loc, mode: 'insensitive' } },
        { district: { contains: loc, mode: 'insensitive' } },
      ]
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        category: true,
        provider: true,
      },
      orderBy: { rating: 'desc' },
    })

    return services.map(this.mapServiceToDto)
  }

  static async getNearbyServices(userLoc: {
    village?: string | null
    taluka?: string | null
    district?: string | null
  }) {
    await seedAllMasterData()

    const services = await prisma.service.findMany({
      where: {
        available: true,
      },
      include: {
        category: true,
        provider: true,
      },
    })

    const mapped = services.map((service) => {
      const dist = calculateLocalityDistance(
        { village: service.village, taluka: service.taluka, district: service.district },
        userLoc,
      )
      return {
        ...this.mapServiceToDto(service),
        _distanceKm: dist,
      }
    })

    mapped.sort((a, b) => a._distanceKm - b._distanceKm)
    return mapped.map(({ _distanceKm, ...rest }) => rest)
  }

  /**
   * STEP 15 — Create Service (Provider)
   */
  static async createService(providerId: string, data: any) {
    const user = await prisma.user.findUnique({
      where: { id: providerId },
    })

    if (!user) {
      const err = new Error('Provider not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'USER_NOT_FOUND'
      throw err
    }

    const service = await prisma.service.create({
      data: {
        title: data.title,
        nameMr: data.title,
        nameHi: data.title,
        nameEn: data.title,
        description: data.description,
        descriptionMr: data.description,
        descriptionHi: data.description,
        descriptionEn: data.description,
        providerId,
        providerNameMr: user.fullName,
        providerNameHi: user.fullName,
        providerNameEn: user.fullNameEn || user.fullName,
        categoryId: data.categoryId,
        location: data.location || user.village || '',
        village: data.village || user.village || '',
        taluka: data.taluka || user.taluka || '',
        district: data.district || user.district || '',
        rateMr: data.rate,
        rateHi: data.rate,
        rateEn: data.rate,
        available: true,
      },
      include: {
        category: true,
        provider: true,
      },
    })

    return this.mapServiceToDto(service)
  }

  /**
   * STEP 15 — Update Service (Provider)
   */
  static async updateService(serviceId: string, providerId: string, updates: any) {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      const err = new Error('Service not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'SERVICE_NOT_FOUND'
      throw err
    }

    if (service.providerId !== providerId) {
      const err = new Error('Only the service provider can update this service')
      ;(err as any).statusCode = 403
      ;(err as any).errorCode = 'FORBIDDEN'
      throw err
    }

    const dataToUpdate: any = {}
    if (updates.title) {
      dataToUpdate.title = updates.title
      dataToUpdate.nameMr = updates.title
      dataToUpdate.nameEn = updates.title
    }
    if (updates.description) {
      dataToUpdate.description = updates.description
      dataToUpdate.descriptionMr = updates.description
      dataToUpdate.descriptionEn = updates.description
    }
    if (updates.rate) {
      dataToUpdate.rateMr = updates.rate
      dataToUpdate.rateEn = updates.rate
    }
    if (updates.location) dataToUpdate.location = updates.location

    const updated = await prisma.service.update({
      where: { id: serviceId },
      data: dataToUpdate,
      include: {
        category: true,
        provider: true,
      },
    })

    return this.mapServiceToDto(updated)
  }

  /**
   * STEP 15 — Delete / Deactivate Service (Provider)
   */
  static async deleteService(serviceId: string, providerId: string) {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      const err = new Error('Service not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'SERVICE_NOT_FOUND'
      throw err
    }

    if (service.providerId !== providerId) {
      const err = new Error('Only the service provider can delete this service')
      ;(err as any).statusCode = 403
      ;(err as any).errorCode = 'FORBIDDEN'
      throw err
    }

    // Soft deactivation
    await prisma.service.update({
      where: { id: serviceId },
      data: { available: false },
    })

    return { success: true, message: 'Service deactivated successfully' }
  }
}
