import { ApplicationStatus, JobStatus, Prisma } from '@prisma/client'
import { prisma } from '../utils/prisma.js'
import { mapJobToFrontendDto, UserLocationContext, isJobExpired } from '../utils/jobMapper.js'
import { ensureDemoJobsExist } from '../utils/seedJobs.js'

export class JobService {
  /**
   * Get List of Jobs with Filters, Search, Location Priority & Sorting
   */
  static async getJobs(filters: any, currentUserId?: string) {
    await ensureDemoJobsExist()

    const where: Prisma.JobWhereInput = {}

    // Status filter: only OPEN jobs (unless expired)
    where.status = JobStatus.OPEN

    // Category filter
    if (filters.categoryId) {
      where.categoryId = filters.categoryId
    }

    // Minimum Wage filter
    if (filters.minWage && Number(filters.minWage) > 0) {
      where.wageAmount = {
        gte: Number(filters.minWage),
      }
    }

    // Location parameters
    if (filters.village) where.village = { contains: filters.village, mode: 'insensitive' }
    if (filters.taluka) where.taluka = { contains: filters.taluka, mode: 'insensitive' }
    if (filters.district) where.district = { contains: filters.district, mode: 'insensitive' }

    // Keyword Search
    if (filters.query && filters.query.trim()) {
      const q = filters.query.trim()
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { titleMr: { contains: q, mode: 'insensitive' } },
        { titleHi: { contains: q, mode: 'insensitive' } },
        { titleEn: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { descriptionMr: { contains: q, mode: 'insensitive' } },
        { village: { contains: q, mode: 'insensitive' } },
        { taluka: { contains: q, mode: 'insensitive' } },
        { district: { contains: q, mode: 'insensitive' } },
        { postedBy: { fullName: { contains: q, mode: 'insensitive' } } },
        { postedBy: { fullNameEn: { contains: q, mode: 'insensitive' } } },
        { category: { name: { contains: q, mode: 'insensitive' } } },
      ]
    }

    // Date filtering
    if (filters.date) {
      const now = new Date()
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      if (filters.date === 'today') {
        const endOfDay = new Date(startOfDay)
        endOfDay.setDate(endOfDay.getDate() + 1)
        where.workDateObj = { gte: startOfDay, lt: endOfDay }
      } else if (filters.date === 'tomorrow') {
        const startTomorrow = new Date(startOfDay)
        startTomorrow.setDate(startTomorrow.getDate() + 1)
        const endTomorrow = new Date(startTomorrow)
        endTomorrow.setDate(endTomorrow.getDate() + 1)
        where.workDateObj = { gte: startTomorrow, lt: endTomorrow }
      } else if (filters.date === 'this-week') {
        const endOfWeek = new Date(startOfDay)
        endOfWeek.setDate(endOfWeek.getDate() + 7)
        where.workDateObj = { gte: startOfDay, lt: endOfWeek }
      }
    }

    // Query ordering
    let orderBy: Prisma.JobOrderByWithRelationInput[] = [{ postedAt: 'desc' }]
    if (filters.sort === 'highest-wage') {
      orderBy = [{ wageAmount: 'desc' }, { postedAt: 'desc' }]
    } else if (filters.sort === 'newest') {
      orderBy = [{ postedAt: 'desc' }]
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        category: true,
        postedBy: true,
        requiredSkills: true,
        applications: currentUserId ? { where: { applicantId: currentUserId } } : false,
      },
      orderBy,
    })

    const userLoc: UserLocationContext = {
      village: filters.village,
      taluka: filters.taluka,
      district: filters.district,
    }

    // Map jobs to DTOs & filter out expired ones
    let mappedJobs = jobs
      .map((job) => mapJobToFrontendDto(job, currentUserId, userLoc))
      .filter((j) => j.status === 'open')

    // Filter by max distance if specified
    if (filters.maxDistance && Number(filters.maxDistance) > 0) {
      const maxD = Number(filters.maxDistance)
      mappedJobs = mappedJobs.filter((j) => j.distanceKm <= maxD)
    }

    // If sorting by nearest, sort by calculated distanceKm
    if (filters.sort === 'nearest') {
      mappedJobs.sort((a, b) => a.distanceKm - b.distanceKm)
    }

    return mappedJobs
  }

  /**
   * Get Nearby Jobs prioritized by Village -> Taluka -> District
   */
  static async getNearbyJobs(userLoc: UserLocationContext, currentUserId?: string) {
    await ensureDemoJobsExist()

    const jobs = await prisma.job.findMany({
      where: {
        status: JobStatus.OPEN,
      },
      include: {
        category: true,
        postedBy: true,
        requiredSkills: true,
        applications: currentUserId ? { where: { applicantId: currentUserId } } : false,
      },
      orderBy: { postedAt: 'desc' },
    })

    const mappedJobs = jobs
      .map((job) => mapJobToFrontendDto(job, currentUserId, userLoc))
      .filter((j) => j.status === 'open')

    // Sort by locality priority
    mappedJobs.sort((a, b) => a.distanceKm - b.distanceKm)

    return mappedJobs
  }

  /**
   * Get Job Details by ID
   */
  static async getJobById(jobId: string, currentUserId?: string) {
    await ensureDemoJobsExist()

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        category: true,
        postedBy: true,
        requiredSkills: true,
        applications: true,
      },
    })

    if (!job) {
      const err = new Error('Job not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'JOB_NOT_FOUND'
      throw err
    }

    let userLoc: UserLocationContext | undefined
    if (currentUserId) {
      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { village: true, taluka: true, district: true },
      })
      if (currentUser) {
        userLoc = {
          village: currentUser.village,
          taluka: currentUser.taluka,
          district: currentUser.district,
        }
      }
    }

    return mapJobToFrontendDto(job, currentUserId, userLoc)
  }

  /**
   * Get User Application for a specific Job
   */
  static async getUserApplicationForJob(jobId: string, applicantId: string) {
    const application = await prisma.jobApplication.findUnique({
      where: {
        jobId_applicantId: {
          jobId,
          applicantId,
        },
      },
    })

    if (!application) {
      return null
    }

    return {
      id: application.id,
      jobId: application.jobId,
      status: application.status.toLowerCase(),
      submittedAt: application.submittedAt.toISOString(),
      message: application.message || undefined,
    }
  }

  /**
   * Apply for Job (Authenticated User)
   */
  static async applyForJob(jobId: string, applicantId: string, message?: string) {
    // 1. Verify user account is active
    const user = await prisma.user.findUnique({
      where: { id: applicantId },
      select: { id: true, accountStatus: true },
    })

    if (!user || user.accountStatus !== 'ACTIVE') {
      const err = new Error('User account is suspended or deactivated')
      ;(err as any).statusCode = 403
      ;(err as any).errorCode = 'ACCOUNT_INACTIVE'
      throw err
    }

    // 2. Fetch job
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        applications: true,
      },
    })

    if (!job) {
      const err = new Error('Job not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'JOB_NOT_FOUND'
      throw err
    }

    // 3. Validate job is OPEN & not expired
    if (job.status !== JobStatus.OPEN || isJobExpired(job)) {
      const err = new Error('This job is no longer accepting applications')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'JOB_NOT_OPEN'
      throw err
    }

    // 4. Validate user is NOT the job poster
    if (job.postedById === applicantId) {
      const err = new Error('You cannot apply for a job posted by yourself')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'CANNOT_APPLY_OWN_JOB'
      throw err
    }

    // 5. Validate user has not already applied
    const existingApp = job.applications.find((app) => app.applicantId === applicantId)
    if (existingApp) {
      const err = new Error('You have already applied for this job')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'ALREADY_APPLIED'
      throw err
    }

    // 6. Check worker capacity
    const acceptedCount = job.applications.filter((a) => a.status === ApplicationStatus.ACCEPTED).length
    if (acceptedCount >= job.workersRequired) {
      const err = new Error('Required worker capacity for this job has already been filled')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'JOB_FILLED'
      throw err
    }

    // 7. Create application transactionally
    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        applicantId,
        message,
        status: ApplicationStatus.PENDING,
      },
    })

    return {
      id: application.id,
      jobId: application.jobId,
      status: application.status.toLowerCase(),
      submittedAt: application.submittedAt.toISOString(),
      message: application.message || undefined,
    }
  }

  /**
   * Get All Applications for Current User
   */
  static async getUserApplications(applicantId: string) {
    const applications = await prisma.jobApplication.findMany({
      where: { applicantId },
      include: {
        job: {
          include: {
            category: true,
            postedBy: true,
            requiredSkills: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    })

    const currentUser = await prisma.user.findUnique({
      where: { id: applicantId },
      select: { village: true, taluka: true, district: true },
    })

    const userLoc: UserLocationContext = currentUser || {}

    return applications.map((app) => ({
      id: app.id,
      jobId: app.jobId,
      status: app.status.toLowerCase(),
      submittedAt: app.submittedAt.toISOString(),
      job: mapJobToFrontendDto(app.job, applicantId, userLoc),
    }))
  }
}
