import type { NextFunction, Response } from 'express'
import { AuthenticatedRequest } from '../middleware/auth.js'
import { ProfileService } from '../services/profileService.js'
import { successResponse } from '../utils/response.js'
import {
  intentsSchema,
  preferencesSchema,
  profilePatchSchema,
  skillsSchema,
  transportationSchema,
  userSkillItemSchema,
} from '../validators/authValidators.js'
import { z } from 'zod'

export class ProfileController {
  /**
   * GET /api/users/me/profile
   */
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await ProfileService.getProfile(req.user!.id)
      return res.json(successResponse(data, 'Profile retrieved successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * PATCH /api/users/me/profile
   */
  static async patchProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = await profilePatchSchema.parseAsync(req.body)
      const data = await ProfileService.updateProfile(req.user!.id, validated)
      return res.json(successResponse(data, 'Profile updated successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * PUT /api/users/me/intents
   */
  static async updateIntents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const payload = Array.isArray(req.body) ? { intents: req.body } : req.body
      const validated = await intentsSchema.parseAsync(payload)
      const data = await ProfileService.updateIntents(req.user!.id, validated.intents)
      return res.json(successResponse(data, 'Intents updated successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * PUT /api/users/me/skills
   */
  static async updateSkills(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      let skillsArray: Array<{ skillId: string; experience: 'less-than-year' | 'one-three' | 'three-five' | 'five-plus' }>

      if (Array.isArray(req.body)) {
        skillsArray = await z.array(userSkillItemSchema).parseAsync(req.body)
      } else {
        const validated = await skillsSchema.parseAsync(req.body)
        skillsArray = validated.skills
      }

      const data = await ProfileService.updateSkills(req.user!.id, skillsArray)
      return res.json(successResponse(data, 'Skills updated successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * PUT /api/users/me/preferences
   */
  static async updatePreferences(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = await preferencesSchema.parseAsync(req.body)
      const data = await ProfileService.updatePreferences(req.user!.id, validated)
      return res.json(successResponse(data, 'Work preferences updated successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * PUT /api/users/me/transportation
   */
  static async updateTransportation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = await transportationSchema.parseAsync(req.body)
      const data = await ProfileService.updateTransportation(req.user!.id, validated)
      return res.json(successResponse(data, 'Transportation updated successfully'))
    } catch (error) {
      return next(error)
    }
  }

  /**
   * DELETE /api/users/me
   */
  static async deleteAccount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await ProfileService.deleteAccount(req.user!.id)
      return res.json(successResponse(data, 'Account deleted successfully'))
    } catch (error) {
      return next(error)
    }
  }
}
