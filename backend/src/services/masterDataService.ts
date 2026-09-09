import { prisma } from '../utils/prisma.js'
import { seedAllMasterData } from '../utils/seedData.js'
import { formatLocalizedText } from '../utils/jobMapper.js'

export class MasterDataService {
  /**
   * GET /api/skills
   */
  static async getSkills() {
    await seedAllMasterData()

    const skills = await prisma.skill.findMany({
      orderBy: { id: 'asc' },
    })

    return skills.map((skill) => ({
      id: skill.id,
      category: skill.category || 'general',
      name: formatLocalizedText(
        skill.name || skill.id,
        skill.nameMr,
        skill.nameHi,
        skill.nameEn,
      ),
      description: skill.description || '',
    }))
  }

  /**
   * GET /api/categories/jobs
   */
  static async getJobCategories() {
    await seedAllMasterData()

    const categories = await prisma.jobCategory.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    })

    return categories.map((cat) => ({
      id: cat.id,
      name: formatLocalizedText(
        cat.name || cat.id,
        cat.nameMr,
        cat.nameHi,
        cat.nameEn,
      ),
    }))
  }

  /**
   * GET /api/categories/services
   */
  static async getServiceCategories() {
    await seedAllMasterData()

    const categories = await prisma.serviceCategory.findMany({
      orderBy: { id: 'asc' },
    })

    return categories.map((cat) => ({
      id: cat.id,
      name: formatLocalizedText(
        cat.name,
        cat.name,
        cat.name,
        cat.name,
      ),
      description: cat.description || '',
    }))
  }
}
