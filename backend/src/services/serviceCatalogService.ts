import { Prisma } from '@prisma/client'
import { prisma } from '../utils/prisma.js'
import { seedAllMasterData } from '../utils/seedData.js'
import { formatLocalizedText, calculateLocalityDistance } from '../utils/jobMapper.js'

export class ServiceCatalogService {
  /**
   * Helper to map Prisma Service entity to frontend DTO
   */
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

  /**
   * GET /api/services
   */
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

  /**
   * GET /api/services/nearby
   */
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

    // Sort by nearest locality distance
    mapped.sort((a, b) => a._distanceKm - b._distanceKm)

    // Remove internal sorting helper field
    return mapped.map(({ _distanceKm, ...rest }) => rest)
  }
}
