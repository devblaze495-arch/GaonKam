import type { NextFunction, Response } from 'express'
import { AuthenticatedRequest } from '../middleware/auth.js'
import { ServiceCatalogService } from '../services/serviceCatalogService.js'
import { successResponse } from '../utils/response.js'
import { createServiceSchema, updateServiceSchema } from '../validators/serviceValidators.js'
import { prisma } from '../utils/prisma.js'

export class ServiceCatalogController {
  /**
   * GET /api/services
   */
  static async getServices(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const category = req.query.category ? String(req.query.category) : undefined
      const location = req.query.location ? String(req.query.location) : undefined
      const availability = req.query.availability !== undefined ? String(req.query.availability) : undefined

      const data = await ServiceCatalogService.getServices({ category, location, availability })
      return res.json(successResponse(data, 'Services retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * GET /api/services/nearby
   */
  static async getNearbyServices(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      let village = req.query.village ? String(req.query.village) : undefined
      let taluka = req.query.taluka ? String(req.query.taluka) : undefined
      let district = req.query.district ? String(req.query.district) : undefined

      if (req.user?.id && (!village && !taluka && !district)) {
        const u = await prisma.user.findUnique({
          where: { id: req.user.id },
          select: { village: true, taluka: true, district: true },
        })
        if (u) {
          village = u.village || undefined
          taluka = u.taluka || undefined
          district = u.district || undefined
        }
      }

      const data = await ServiceCatalogService.getNearbyServices({ village, taluka, district })
      return res.json(successResponse(data, 'Nearby services retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * POST /api/services (Create Service)
   */
  static async createService(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = await createServiceSchema.parseAsync(req.body)
      const data = await ServiceCatalogService.createService(req.user!.id, validated)
      return res.status(201).json(successResponse(data, 'Service created successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * PATCH /api/services/:serviceId (Edit Service)
   */
  static async updateService(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const serviceId = String(req.params.serviceId)
      const validated = await updateServiceSchema.parseAsync(req.body)
      const data = await ServiceCatalogService.updateService(serviceId, req.user!.id, validated)
      return res.json(successResponse(data, 'Service updated successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * DELETE /api/services/:serviceId (Deactivate Service)
   */
  static async deleteService(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const serviceId = String(req.params.serviceId)
      const data = await ServiceCatalogService.deleteService(serviceId, req.user!.id)
      return res.json(successResponse(data, 'Service deactivated successfully'))
    } catch (error) {
      return next(error)
    }
  }
}
