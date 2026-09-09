import jwt from 'jsonwebtoken'
import { RoleName } from '@prisma/client'
import { config } from '../config/env.js'
import { prisma } from '../utils/prisma.js'
import { OtpService } from './otpService.js'
import { prismaToFrontendIntent } from '../utils/mappers.js'

export class AuthService {
  /**
   * Request OTP
   */
  static async requestOtp(phone: string) {
    const result = await OtpService.generateOtp(phone)
    return {
      message: 'OTP sent successfully',
      ...(result.devOtp ? { devOtp: result.devOtp } : {}),
    }
  }

  /**
   * Verify OTP and log in / sign up user
   */
  static async verifyOtp(phone: string, otp: string) {
    const verification = await OtpService.verifyOtp(phone, otp)
    if (!verification.valid) {
      const err = new Error(verification.reason || 'Invalid OTP verification attempt')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'INVALID_OTP'
      throw err
    }

    // 1. Find or Create User
    let user = await prisma.user.findUnique({
      where: { mobile: phone },
      include: {
        roles: { include: { role: true } },
        userAvailability: true,
      },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          mobile: phone,
          fullName: 'GaavKaam User', // placeholder until user completes profile setup
          preferredLanguage: 'mr',
          languagesKnown: ['marathi'],
        },
        include: {
          roles: { include: { role: true } },
          userAvailability: true,
        },
      })
    }

    // 2. Assign USER role if necessary
    const hasUserRole = user.roles.some((ur) => ur.role.name === RoleName.USER)
    if (!hasUserRole) {
      let defaultRole = await prisma.role.findUnique({
        where: { name: RoleName.USER },
      })

      if (!defaultRole) {
        defaultRole = await prisma.role.create({
          data: {
            name: RoleName.USER,
            description: 'Standard User Role',
          },
        })
      }

      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: defaultRole.id,
        },
      })
    }

    // 3. Create UserAvailability if missing
    if (!user.userAvailability) {
      await prisma.userAvailability.create({
        data: {
          userId: user.id,
        },
      })
    }

    // Fetch refreshed user for JWT & return payload
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: { include: { role: true } },
      },
    })

    if (!fullUser) {
      throw new Error('Failed to retrieve user after login')
    }

    // 4. Generate JWT
    const token = jwt.sign(
      {
        id: fullUser.id,
        mobile: fullUser.mobile,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as jwt.SignOptions,
    )

    // 5. Format safe user data matching frontend expectations
    const safeUser = {
      id: fullUser.id,
      phone: fullUser.mobile,
      fullName: fullUser.fullName,
      fullNameEn: fullUser.fullNameEn || undefined,
      village: fullUser.village || undefined,
      taluka: fullUser.taluka || undefined,
      district: fullUser.district || undefined,
      preferredLanguage: fullUser.preferredLanguage || 'mr',
      intents: fullUser.intents.map(prismaToFrontendIntent),
      roles: fullUser.roles.map((r) => r.role.name.toLowerCase()),
      accountStatus: fullUser.accountStatus,
      createdAt: fullUser.createdAt,
    }

    return {
      token,
      user: safeUser,
    }
  }

  /**
   * Get Current User Safe Details
   */
  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } },
      },
    })

    if (!user) {
      const err = new Error('User not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'USER_NOT_FOUND'
      throw err
    }

    return {
      id: user.id,
      phone: user.mobile,
      fullName: user.fullName,
      fullNameEn: user.fullNameEn || undefined,
      village: user.village || undefined,
      taluka: user.taluka || undefined,
      district: user.district || undefined,
      preferredLanguage: user.preferredLanguage || 'mr',
      languagesKnown: user.languagesKnown,
      intents: user.intents.map(prismaToFrontendIntent),
      roles: user.roles.map((r) => r.role.name.toLowerCase()),
      accountStatus: user.accountStatus,
      trustScore: user.trustScore,
      rating: user.rating,
      reviewCount: user.reviewCount,
      completedJobs: user.completedJobs,
      createdAt: user.createdAt,
    }
  }
}
