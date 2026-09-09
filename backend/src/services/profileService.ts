import { LanguageCode } from '@prisma/client'
import { prisma } from '../utils/prisma.js'
import {
  frontendToPrismaAvailability,
  frontendToPrismaDay,
  frontendToPrismaExperience,
  frontendToPrismaIntent,
  frontendToPrismaVehicle,
  prismaToFrontendAvailability,
  prismaToFrontendDay,
  prismaToFrontendExperience,
  prismaToFrontendVehicle,
} from '../utils/mappers.js'

const MASTER_SKILLS = [
  { id: 'farming', category: 'agriculture', name: 'Farming / Shetkaam', nameMr: 'शेती काम', nameHi: 'खेती का काम', nameEn: 'Farming' },
  { id: 'general-labor', category: 'labor', name: 'General Labor', nameMr: 'इतर मजुरी', nameHi: 'सामान्य मजदूरी', nameEn: 'General Labor' },
  { id: 'construction', category: 'construction', name: 'Construction Worker', nameMr: 'बांधकाम कामगार', nameHi: 'निर्माण मजदूर', nameEn: 'Construction Worker' },
  { id: 'masonry', category: 'construction', name: 'Masonry / Gavandi', nameMr: 'गवंडी काम', nameHi: 'राजमिस्त्री', nameEn: 'Masonry' },
  { id: 'carpentry', category: 'skilled', name: 'Carpentry / Sutar', nameMr: 'सुतारकाम', nameHi: 'बढ़ई का काम', nameEn: 'Carpentry' },
  { id: 'electrician', category: 'skilled', name: 'Electrician', nameMr: 'इलेक्ट्रिशियन', nameHi: 'इलेक्ट्रिशियन', nameEn: 'Electrician' },
  { id: 'plumbing', category: 'skilled', name: 'Plumbing', nameMr: 'प्लंबिंग', nameHi: 'प्लंबर', nameEn: 'Plumbing' },
  { id: 'painting', category: 'skilled', name: 'Painting', nameMr: 'रंगकाम', nameHi: 'पेंटिंग', nameEn: 'Painting' },
  { id: 'welding', category: 'skilled', name: 'Welding', nameMr: 'वेल्डिंग', nameHi: 'वेल्डिंग', nameEn: 'Welding' },
  { id: 'driving', category: 'transport', name: 'Driving (Driver)', nameMr: 'ड्रायव्हिंग', nameHi: 'ड्राइविंग', nameEn: 'Driving' },
  { id: 'animal-care', category: 'agriculture', name: 'Animal Care / Pashupalan', nameMr: 'पशुपोषण / काळजी', nameHi: 'पशुपालन', nameEn: 'Animal Care' },
  { id: 'household', category: 'household', name: 'Household Help', nameMr: 'घरकाम', nameHi: 'घरेलू काम', nameEn: 'Household Help' },
  { id: 'cooking', category: 'household', name: 'Cooking / Swayampak', nameMr: 'स्वयंपाक', nameHi: 'खाना बनाना', nameEn: 'Cooking' },
  { id: 'cleaning', category: 'household', name: 'Cleaning', nameMr: 'सफाई काम', nameHi: 'सफाई', nameEn: 'Cleaning' },
  { id: 'gardening', category: 'household', name: 'Gardening / Bagekaam', nameMr: 'बागायत काम', nameHi: 'बागवानी', nameEn: 'Gardening' },
  { id: 'machine-operator', category: 'skilled', name: 'Machine Operator', nameMr: 'मशीन ऑपरेटर', nameHi: 'मशीन ऑपरेटर', nameEn: 'Machine Operator' },
]

async function ensureMasterSkillsExist(skillIds: string[]) {
  const existing = await prisma.skill.findMany({
    where: { id: { in: skillIds } },
    select: { id: true },
  })
  const existingSet = new Set(existing.map((s) => s.id))
  const missingIds = skillIds.filter((id) => !existingSet.has(id))

  if (missingIds.length > 0) {
    const toCreate = MASTER_SKILLS.filter((s) => missingIds.includes(s.id))
    for (const skill of toCreate) {
      await prisma.skill.upsert({
        where: { id: skill.id },
        update: {},
        create: {
          id: skill.id,
          category: skill.category,
          name: skill.name,
          nameMr: skill.nameMr,
          nameHi: skill.nameHi,
          nameEn: skill.nameEn,
        },
      })
    }
  }
}

export class ProfileService {
  /**
   * Get formatted ProfileData matching frontend ProfileData structure
   */
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userSkills: {
          include: { skill: true },
        },
      },
    })

    if (!user) {
      const err = new Error('User not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'USER_NOT_FOUND'
      throw err
    }

    return {
      fullName: {
        original: user.fullName,
        en: user.fullNameEn || '',
      },
      village: user.village || '',
      taluka: user.taluka || '',
      district: user.district || '',
      preferredLanguage: user.preferredLanguage || 'mr',
      languagesKnown: user.languagesKnown || [],
      skills: user.userSkills.map((us) => ({
        skillId: us.skillId,
        experience: prismaToFrontendExperience(us.experience),
      })),
      workPreferences: {
        dailyWage: user.dailyWage ?? 500,
        availability: prismaToFrontendAvailability(user.availability),
        selectedDays: (user.selectedDays || []).map(prismaToFrontendDay),
      },
      transportation: {
        vehicles: (user.vehicles || []).map(prismaToFrontendVehicle),
        canTravel: user.canTravel ?? true,
        maxDistance: user.maxDistance || '10',
      },
      phone: user.mobile || '',
      trust: {
        score: user.trustScore ?? 90,
        completedJobs: user.completedJobs ?? 0,
        rating: user.rating ?? 0,
        reviewCount: user.reviewCount ?? 0,
      },
      rating: {
        rating: user.rating ?? 0,
        reviewCount: user.reviewCount ?? 0,
      },
    }
  }

  /**
   * Patch User Profile
   */
  static async updateProfile(
    userId: string,
    updates: {
      fullName?: string | { original: string; en?: string }
      fullNameEn?: string
      village?: string
      taluka?: string
      district?: string
      preferredLanguage?: string
      languagesKnown?: string[]
    },
  ) {
    const dataToUpdate: any = {}

    if (updates.fullName !== undefined) {
      if (typeof updates.fullName === 'string') {
        dataToUpdate.fullName = updates.fullName
      } else if (typeof updates.fullName === 'object' && updates.fullName !== null) {
        dataToUpdate.fullName = updates.fullName.original
        if (updates.fullName.en !== undefined) {
          dataToUpdate.fullNameEn = updates.fullName.en
        }
      }
    }

    if (updates.fullNameEn !== undefined) {
      dataToUpdate.fullNameEn = updates.fullNameEn
    }
    if (updates.village !== undefined) {
      dataToUpdate.village = updates.village
    }
    if (updates.taluka !== undefined) {
      dataToUpdate.taluka = updates.taluka
    }
    if (updates.district !== undefined) {
      dataToUpdate.district = updates.district
    }
    if (updates.preferredLanguage !== undefined) {
      dataToUpdate.preferredLanguage = updates.preferredLanguage
      if (updates.preferredLanguage === 'mr') dataToUpdate.languageCode = LanguageCode.MR
      else if (updates.preferredLanguage === 'hi') dataToUpdate.languageCode = LanguageCode.HI
      else if (updates.preferredLanguage === 'en') dataToUpdate.languageCode = LanguageCode.EN
    }
    if (updates.languagesKnown !== undefined) {
      dataToUpdate.languagesKnown = updates.languagesKnown
    }

    await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    })

    return this.getProfile(userId)
  }

  /**
   * Update User Intents
   */
  static async updateIntents(userId: string, intents: string[]) {
    const prismaIntents = intents.map(frontendToPrismaIntent)

    await prisma.user.update({
      where: { id: userId },
      data: {
        intents: prismaIntents,
      },
    })

    return {
      success: true,
      intents,
    }
  }

  /**
   * Update User Skills Transactionally
   */
  static async updateSkills(
    userId: string,
    skills: Array<{ skillId: string; experience: string }>,
  ) {
    // Check duplicates
    const skillIdSet = new Set<string>()
    for (const item of skills) {
      if (skillIdSet.has(item.skillId)) {
        const err = new Error(`Duplicate skillId found: ${item.skillId}`)
        ;(err as any).statusCode = 400
        ;(err as any).errorCode = 'DUPLICATE_SKILL'
        throw err
      }
      skillIdSet.add(item.skillId)
    }

    // Ensure requested skills exist in DB
    const skillIds = Array.from(skillIdSet)
    await ensureMasterSkillsExist(skillIds)

    // Verify all exist in database
    const dbSkills = await prisma.skill.findMany({
      where: { id: { in: skillIds } },
      select: { id: true },
    })

    if (dbSkills.length !== skillIds.length) {
      const dbIds = new Set(dbSkills.map((s) => s.id))
      const invalidIds = skillIds.filter((id) => !dbIds.has(id))
      const err = new Error(`Invalid or non-existent skill ID(s): ${invalidIds.join(', ')}`)
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'INVALID_SKILL'
      throw err
    }

    // Replace user skills transactionally
    await prisma.$transaction(async (tx) => {
      await tx.userSkill.deleteMany({
        where: { userId },
      })

      if (skills.length > 0) {
        await tx.userSkill.createMany({
          data: skills.map((item) => ({
            userId,
            skillId: item.skillId,
            experience: frontendToPrismaExperience(item.experience),
          })),
        })
      }

      // Also update legacy flat skills array for compatibility
      await tx.user.update({
        where: { id: userId },
        data: {
          skills: skills.map((s) => s.skillId),
        },
      })
    })

    return {
      success: true,
      skills,
    }
  }

  /**
   * Update Work Preferences
   */
  static async updatePreferences(
    userId: string,
    prefs: {
      dailyWage: number
      availability: string
      selectedDays?: string[]
    },
  ) {
    if (prefs.dailyWage < 100 || prefs.dailyWage > 10000) {
      const err = new Error('Daily wage must be between ₹100 and ₹10,000')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'INVALID_WAGE'
      throw err
    }

    const prismaAvailability = frontendToPrismaAvailability(prefs.availability)
    const prismaSelectedDays = (prefs.selectedDays || []).map(frontendToPrismaDay)

    await prisma.user.update({
      where: { id: userId },
      data: {
        dailyWage: prefs.dailyWage,
        availability: prismaAvailability,
        selectedDays: prismaSelectedDays,
      },
    })

    return {
      success: true,
      workPreferences: {
        dailyWage: prefs.dailyWage,
        availability: prefs.availability,
        selectedDays: prefs.selectedDays || [],
      },
    }
  }

  /**
   * Update Transportation Details
   */
  static async updateTransportation(
    userId: string,
    trans: {
      vehicles: string[]
      canTravel: boolean
      maxDistance: string
    },
  ) {
    const prismaVehicles = trans.vehicles.map(frontendToPrismaVehicle)

    await prisma.user.update({
      where: { id: userId },
      data: {
        vehicles: prismaVehicles,
        canTravel: trans.canTravel,
        maxDistance: trans.maxDistance,
      },
    })

    return {
      success: true,
      transportation: {
        vehicles: trans.vehicles,
        canTravel: trans.canTravel,
        maxDistance: trans.maxDistance,
      },
    }
  }
}
