import { ApplicationStatus, AssignmentStatus, CompletionStatus, DisputeStatus, JobStatus, Prisma, WageType } from '@prisma/client'
import { prisma } from '../utils/prisma.js'
import { mapJobToFrontendDto, UserLocationContext, isJobExpired } from '../utils/jobMapper.js'
import { ensureDemoJobsExist } from '../utils/seedJobs.js'

export class JobService {
  /**
   * Recalculate User Rating and Trust Score deterministically
   */
  public static async updateUserTrustAndRating(userId: string, tx: Prisma.TransactionClient = prisma) {
    const ratings = await tx.rating.findMany({
      where: { revieweeId: userId },
      select: { rating: true },
    })

    const reviewCount = ratings.length
    const avgRating = reviewCount > 0 ? ratings.reduce((acc, r) => acc + r.rating, 0) / reviewCount : 0.0

    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { completedJobs: true },
    })

    const completedJobsCount = user?.completedJobs || 0
    
    // Base trust score = 90
    // +2 per completed job (up to +20)
    // +(avgRating - 3.0) * 5 if avgRating > 0
    let trustScore = 90 + Math.min(completedJobsCount * 2, 20)
    if (reviewCount > 0) {
      trustScore += Math.round((avgRating - 3.0) * 5)
    }
    trustScore = Math.max(50, Math.min(100, trustScore))

    await tx.user.update({
      where: { id: userId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount,
        trustScore,
      },
    })
  }

  /**
   * Get List of Jobs with Filters, Search, Location Priority & Sorting
   */
  static async getJobs(filters: any, currentUserId?: string) {
    await ensureDemoJobsExist()

    const where: Prisma.JobWhereInput = {}
    where.status = JobStatus.OPEN

    if (filters.categoryId) {
      where.categoryId = filters.categoryId
    }

    if (filters.minWage && Number(filters.minWage) > 0) {
      where.wageAmount = { gte: Number(filters.minWage) }
    }

    if (filters.village) where.village = { contains: filters.village, mode: 'insensitive' }
    if (filters.taluka) where.taluka = { contains: filters.taluka, mode: 'insensitive' }
    if (filters.district) where.district = { contains: filters.district, mode: 'insensitive' }

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

    let mappedJobs = jobs
      .map((job) => mapJobToFrontendDto(job, currentUserId, userLoc))
      .filter((j) => j.status === 'open')

    if (filters.maxDistance && Number(filters.maxDistance) > 0) {
      const maxD = Number(filters.maxDistance)
      mappedJobs = mappedJobs.filter((j) => j.distanceKm <= maxD)
    }

    if (filters.sort === 'nearest') {
      mappedJobs.sort((a, b) => a.distanceKm - b.distanceKm)
    }

    return mappedJobs
  }

  /**
   * Get Nearby Jobs
   */
  static async getNearbyJobs(userLoc: UserLocationContext, currentUserId?: string) {
    await ensureDemoJobsExist()

    const jobs = await prisma.job.findMany({
      where: { status: JobStatus.OPEN },
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
   * STEP 2 — Create Job
   */
  static async createJob(postedById: string, data: any) {
    // 1. Check user account active
    const user = await prisma.user.findUnique({
      where: { id: postedById },
      select: { id: true, accountStatus: true, village: true, taluka: true, district: true },
    })

    if (!user || user.accountStatus !== 'ACTIVE') {
      const err = new Error('User account is suspended or deactivated')
      ;(err as any).statusCode = 403
      ;(err as any).errorCode = 'ACCOUNT_INACTIVE'
      throw err
    }

    // 2. Validate category exists and is active
    const category = await prisma.jobCategory.findUnique({
      where: { id: data.categoryId },
    })

    if (!category || !category.isActive) {
      const err = new Error(`Category '${data.categoryId}' does not exist or is inactive`)
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'INVALID_CATEGORY'
      throw err
    }

    // 3. Validate required skills exist if provided
    const requiredSkills: string[] = data.requiredSkills || []
    if (requiredSkills.length > 0) {
      const existingSkills = await prisma.skill.findMany({
        where: { id: { in: requiredSkills } },
        select: { id: true },
      })
      if (existingSkills.length !== requiredSkills.length) {
        const existingIds = new Set(existingSkills.map((s) => s.id))
        const missing = requiredSkills.filter((id) => !existingIds.has(id))
        const err = new Error(`Required skill(s) not found: ${missing.join(', ')}`)
        ;(err as any).statusCode = 400
        ;(err as any).errorCode = 'INVALID_SKILL'
        throw err
      }
    }

    // Format localized title & description strings
    const titleText = typeof data.title === 'string' ? data.title : data.title.mr || data.title.en || 'कामाचे नाव'
    const titleMr = typeof data.title === 'object' ? data.title.mr : data.title
    const titleHi = typeof data.title === 'object' ? data.title.hi : data.title
    const titleEn = typeof data.title === 'object' ? data.title.en : data.title

    const descText = typeof data.description === 'string' ? data.description : data.description.mr || data.description.en || ''
    const descMr = typeof data.description === 'object' ? data.description.mr : data.description
    const descHi = typeof data.description === 'object' ? data.description.hi : data.description
    const descEn = typeof data.description === 'object' ? data.description.en : data.description

    // Parse work date
    let workDateObj: Date | undefined
    if (data.workDate) {
      const parsed = new Date(data.workDate)
      if (!isNaN(parsed.getTime())) {
        workDateObj = parsed
      }
    }

    const wageTypeEnum =
      data.wageType === 'fixed'
        ? WageType.FIXED
        : data.wageType === 'hourly'
        ? WageType.HOURLY
        : data.wageType === 'negotiable'
        ? WageType.NEGOTIABLE
        : WageType.DAILY

    const newJob = await prisma.$transaction(async (tx) => {
      const created = await tx.job.create({
        data: {
          title: titleText,
          titleMr,
          titleHi,
          titleEn,
          description: descText,
          descriptionMr: descMr,
          descriptionHi: descHi,
          descriptionEn: descEn,
          categoryId: data.categoryId,
          postedById,
          village: data.village || user.village || '',
          taluka: data.taluka || user.taluka || '',
          district: data.district || user.district || '',
          state: data.state || 'Maharashtra',
          wageAmount: data.wageAmount,
          wageType: wageTypeEnum,
          workDate: data.workDate,
          workDateObj,
          startTime: data.startTime || '08:00',
          workersRequired: data.workersRequired || 1,
          numberOfWorkers: data.workersRequired || 1,
          status: JobStatus.OPEN,
          postedAt: new Date(),
        },
      })

      if (requiredSkills.length > 0) {
        await tx.jobRequiredSkill.createMany({
          data: requiredSkills.map((skillId) => ({
            jobId: created.id,
            skillId,
          })),
        })
      }

      return created
    })

    return this.getJobById(newJob.id, postedById)
  }

  /**
   * STEP 3 — Get My Posted Jobs
   */
  static async getMyPostedJobs(postedById: string) {
    const jobs = await prisma.job.findMany({
      where: { postedById },
      include: {
        category: true,
        postedBy: true,
        requiredSkills: true,
        applications: true,
        assignments: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return jobs.map((job) => {
      const dto = mapJobToFrontendDto(job, postedById)
      return {
        ...dto,
        applicationCount: job.applications.length,
        acceptedWorkerCount: job.assignments.filter((a) => a.status === AssignmentStatus.ACCEPTED || a.status === AssignmentStatus.ASSIGNED).length,
      }
    })
  }

  /**
   * STEP 4 — Edit Job
   */
  static async editJob(jobId: string, posterId: string, updates: any) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { assignments: true },
    })

    if (!job) {
      const err = new Error('Job not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'JOB_NOT_FOUND'
      throw err
    }

    if (job.postedById !== posterId) {
      const err = new Error('Only the job poster can edit this job')
      ;(err as any).statusCode = 403
      ;(err as any).errorCode = 'FORBIDDEN'
      throw err
    }

    if (job.status === JobStatus.COMPLETED || job.status === JobStatus.CANCELLED) {
      const err = new Error(`Cannot edit a ${job.status.toLowerCase()} job`)
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'INVALID_STATUS_TRANSITION'
      throw err
    }

    // Check workersRequired against active assignments
    const activeAssignments = job.assignments.filter((a) => a.status !== AssignmentStatus.CANCELLED && a.status !== AssignmentStatus.DECLINED).length
    if (updates.workersRequired !== undefined && updates.workersRequired < activeAssignments) {
      const err = new Error(`Cannot reduce workers required below active assignment count (${activeAssignments})`)
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'INVALID_CAPACITY'
      throw err
    }

    const dataToUpdate: any = {}

    if (updates.title) {
      dataToUpdate.title = typeof updates.title === 'string' ? updates.title : updates.title.mr || updates.title.en
      if (typeof updates.title === 'object') {
        dataToUpdate.titleMr = updates.title.mr
        dataToUpdate.titleHi = updates.title.hi
        dataToUpdate.titleEn = updates.title.en
      }
    }

    if (updates.description) {
      dataToUpdate.description = typeof updates.description === 'string' ? updates.description : updates.description.mr || updates.description.en
      if (typeof updates.description === 'object') {
        dataToUpdate.descriptionMr = updates.description.mr
        dataToUpdate.descriptionHi = updates.description.hi
        dataToUpdate.descriptionEn = updates.description.en
      }
    }

    if (updates.wageAmount !== undefined) dataToUpdate.wageAmount = updates.wageAmount
    if (updates.village !== undefined) dataToUpdate.village = updates.village
    if (updates.taluka !== undefined) dataToUpdate.taluka = updates.taluka
    if (updates.district !== undefined) dataToUpdate.district = updates.district
    if (updates.workDate !== undefined) dataToUpdate.workDate = updates.workDate
    if (updates.startTime !== undefined) dataToUpdate.startTime = updates.startTime
    if (updates.workersRequired !== undefined) dataToUpdate.workersRequired = updates.workersRequired

    await prisma.job.update({
      where: { id: jobId },
      data: dataToUpdate,
    })

    return this.getJobById(jobId, posterId)
  }

  /**
   * STEP 5 — Cancel Job
   */
  static async cancelJob(jobId: string, posterId: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      const err = new Error('Job not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'JOB_NOT_FOUND'
      throw err
    }

    if (job.postedById !== posterId) {
      const err = new Error('Only the job poster can cancel this job')
      ;(err as any).statusCode = 403
      ;(err as any).errorCode = 'FORBIDDEN'
      throw err
    }

    if (job.status === JobStatus.COMPLETED) {
      const err = new Error('Cannot cancel a completed job')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'INVALID_STATUS_TRANSITION'
      throw err
    }

    if (job.status === JobStatus.CANCELLED) {
      const err = new Error('Job is already cancelled')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'ALREADY_CANCELLED'
      throw err
    }

    await prisma.$transaction(async (tx) => {
      await tx.job.update({
        where: { id: jobId },
        data: { status: JobStatus.CANCELLED },
      })

      // Update active assignments status to CANCELLED
      await tx.jobAssignment.updateMany({
        where: { jobId, status: { notIn: [AssignmentStatus.COMPLETED, AssignmentStatus.CANCELLED] } },
        data: { status: AssignmentStatus.CANCELLED, cancelledAt: new Date() },
      })
    })

    return { success: true, message: 'Job cancelled successfully' }
  }

  /**
   * STEP 6 — Get Poster's Applications for Job
   */
  static async getJobApplicationsForPoster(jobId: string, posterId: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      const err = new Error('Job not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'JOB_NOT_FOUND'
      throw err
    }

    if (job.postedById !== posterId) {
      const err = new Error('Only the job poster can view applications for this job')
      ;(err as any).statusCode = 403
      ;(err as any).errorCode = 'FORBIDDEN'
      throw err
    }

    const applications = await prisma.jobApplication.findMany({
      where: { jobId },
      include: {
        applicant: {
          include: {
            userSkills: { include: { skill: true } },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    })

    return applications.map((app) => ({
      id: app.id,
      jobId: app.jobId,
      status: app.status.toLowerCase(),
      submittedAt: app.submittedAt.toISOString(),
      message: app.message || undefined,
      applicant: {
        id: app.applicant.id,
        name: app.applicant.fullName,
        village: app.applicant.village || '',
        taluka: app.applicant.taluka || '',
        district: app.applicant.district || '',
        skills: app.applicant.userSkills.map((us) => ({
          skillId: us.skillId,
          experience: us.experience.toLowerCase().replace('_', '-'),
        })),
        trustScore: app.applicant.trustScore,
        rating: app.applicant.rating,
        reviewCount: app.applicant.reviewCount,
      },
    }))
  }

  /**
   * STEP 7 — Accept / Reject Application
   */
  static async updateApplicationStatus(
    jobId: string,
    applicationId: string,
    posterId: string,
    newStatus: 'accepted' | 'rejected',
  ) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        assignments: { where: { status: { notIn: [AssignmentStatus.CANCELLED, AssignmentStatus.DECLINED] } } },
      },
    })

    if (!job) {
      const err = new Error('Job not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'JOB_NOT_FOUND'
      throw err
    }

    if (job.postedById !== posterId) {
      const err = new Error('Only the job poster can manage applications for this job')
      ;(err as any).statusCode = 403
      ;(err as any).errorCode = 'FORBIDDEN'
      throw err
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
    })

    if (!application || application.jobId !== jobId) {
      const err = new Error('Application not found for this job')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'APPLICATION_NOT_FOUND'
      throw err
    }

    if (newStatus === 'accepted') {
      if (job.assignments.length >= job.workersRequired) {
        const err = new Error('Worker capacity for this job has already been reached')
        ;(err as any).statusCode = 400
        ;(err as any).errorCode = 'CAPACITY_REACHED'
        throw err
      }

      // Check duplicate assignment
      const existingAssignment = job.assignments.find((a) => a.workerId === application.applicantId)
      if (existingAssignment) {
        const err = new Error('Worker is already assigned to this job')
        ;(err as any).statusCode = 400
        ;(err as any).errorCode = 'ALREADY_ASSIGNED'
        throw err
      }

      await prisma.$transaction(async (tx) => {
        await tx.jobApplication.update({
          where: { id: applicationId },
          data: { status: ApplicationStatus.ACCEPTED },
        })

        await tx.jobAssignment.create({
          data: {
            jobId,
            workerId: application.applicantId,
            applicationId: application.id,
            status: AssignmentStatus.ASSIGNED,
          },
        })

        const activeCount = job.assignments.length + 1
        if (activeCount >= job.workersRequired) {
          await tx.job.update({
            where: { id: jobId },
            data: { status: JobStatus.WORKERS_SELECTED },
          })
        }
      })
    } else {
      await prisma.jobApplication.update({
        where: { id: applicationId },
        data: { status: ApplicationStatus.REJECTED },
      })
    }

    return { success: true, message: `Application ${newStatus} successfully` }
  }

  /**
   * STEP 8 — Get Poster Assignments & Worker Assignments
   */
  static async getJobAssignmentsForPoster(jobId: string, posterId: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      const err = new Error('Job not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'JOB_NOT_FOUND'
      throw err
    }

    if (job.postedById !== posterId) {
      const err = new Error('Only the job poster can view assignments for this job')
      ;(err as any).statusCode = 403
      ;(err as any).errorCode = 'FORBIDDEN'
      throw err
    }

    const assignments = await prisma.jobAssignment.findMany({
      where: { jobId },
      include: {
        worker: true,
        completion: true,
      },
      orderBy: { assignedAt: 'desc' },
    })

    return assignments.map((a) => ({
      id: a.id,
      jobId: a.jobId,
      workerId: a.workerId,
      workerName: a.worker.fullName,
      workerPhone: a.worker.mobile,
      status: a.status.toLowerCase(),
      assignedAt: a.assignedAt.toISOString(),
      completionStatus: a.completion?.status ? a.completion.status.toLowerCase() : null,
    }))
  }

  static async getWorkerAssignments(workerId: string) {
    const assignments = await prisma.jobAssignment.findMany({
      where: { workerId },
      include: {
        job: {
          include: { category: true, postedBy: true },
        },
        completion: true,
      },
      orderBy: { assignedAt: 'desc' },
    })

    return assignments.map((a) => ({
      id: a.id,
      jobId: a.jobId,
      status: a.status.toLowerCase(),
      assignedAt: a.assignedAt.toISOString(),
      job: mapJobToFrontendDto(a.job, workerId),
      completionStatus: a.completion?.status ? a.completion.status.toLowerCase() : null,
    }))
  }

  /**
   * STEP 9 — Withdraw Application
   */
  static async withdrawApplication(jobId: string, applicantId: string) {
    const application = await prisma.jobApplication.findUnique({
      where: {
        jobId_applicantId: {
          jobId,
          applicantId,
        },
      },
    })

    if (!application) {
      const err = new Error('Application not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'APPLICATION_NOT_FOUND'
      throw err
    }

    // Check if worker already has an active assignment
    const assignment = await prisma.jobAssignment.findFirst({
      where: {
        jobId,
        workerId: applicantId,
        status: { in: [AssignmentStatus.ASSIGNED, AssignmentStatus.ACCEPTED, AssignmentStatus.COMPLETED] },
      },
    })

    if (assignment) {
      const err = new Error('Cannot withdraw application after work assignment has already started or completed')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'COMPLETION_NOT_ALLOWED'
      throw err
    }

    await prisma.jobApplication.update({
      where: { id: application.id },
      data: { status: ApplicationStatus.WITHDRAWN },
    })

    return { success: true, message: 'Application withdrawn successfully' }
  }

  /**
   * STEP 10 — Work Completion (Submit & Confirm)
   */
  static async submitWorkCompletion(jobId: string, assignmentId: string, workerId: string) {
    const assignment = await prisma.jobAssignment.findUnique({
      where: { id: assignmentId },
      include: { completion: true },
    })

    if (!assignment || assignment.jobId !== jobId) {
      const err = new Error('Assignment not found for this job')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'NOT_FOUND'
      throw err
    }

    if (assignment.workerId !== workerId) {
      const err = new Error('You can only submit completion for your own assignment')
      ;(err as any).statusCode = 403
      ;(err as any).errorCode = 'FORBIDDEN'
      throw err
    }

    if (assignment.completion) {
      const err = new Error('Completion has already been submitted for this assignment')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'DUPLICATE_COMPLETION'
      throw err
    }

    await prisma.$transaction(async (tx) => {
      await tx.jobCompletion.create({
        data: {
          jobId,
          workerId,
          assignmentId,
          status: CompletionStatus.PENDING,
          workerConfirmedAt: new Date(),
        },
      })
    })

    return { success: true, message: 'Work completion submitted successfully' }
  }

  static async confirmWorkCompletion(jobId: string, assignmentId: string, posterId: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        assignments: { where: { status: { notIn: [AssignmentStatus.CANCELLED, AssignmentStatus.DECLINED] } } },
      },
    })

    if (!job) {
      const err = new Error('Job not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'JOB_NOT_FOUND'
      throw err
    }

    if (job.postedById !== posterId) {
      const err = new Error('Only the job poster can confirm work completion')
      ;(err as any).statusCode = 403
      ;(err as any).errorCode = 'FORBIDDEN'
      throw err
    }

    const assignment = await prisma.jobAssignment.findUnique({
      where: { id: assignmentId },
      include: { completion: true },
    })

    if (!assignment || assignment.jobId !== jobId) {
      const err = new Error('Assignment not found for this job')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'NOT_FOUND'
      throw err
    }

    await prisma.$transaction(async (tx) => {
      if (!assignment.completion) {
        await tx.jobCompletion.create({
          data: {
            jobId,
            workerId: assignment.workerId,
            assignmentId,
            status: CompletionStatus.CONFIRMED,
            markedById: posterId,
            posterConfirmedAt: new Date(),
            confirmedByEmployer: true,
          },
        })
      } else {
        await tx.jobCompletion.update({
          where: { id: assignment.completion.id },
          data: {
            status: CompletionStatus.CONFIRMED,
            markedById: posterId,
            posterConfirmedAt: new Date(),
            confirmedByEmployer: true,
          },
        })
      }

      await tx.jobAssignment.update({
        where: { id: assignmentId },
        data: { status: AssignmentStatus.COMPLETED },
      })

      // Increment worker completedJobs count
      await tx.user.update({
        where: { id: assignment.workerId },
        data: { completedJobs: { increment: 1 } },
      })

      // Recalculate worker trust score & rating
      await this.updateUserTrustAndRating(assignment.workerId, tx)

      // Multi-worker rule: Check if ALL required assignments for the job are completed
      const allCompletions = await tx.jobCompletion.findMany({
        where: { jobId, status: CompletionStatus.CONFIRMED },
      })

      if (allCompletions.length >= job.workersRequired) {
        await tx.job.update({
          where: { id: jobId },
          data: { status: JobStatus.COMPLETED },
        })
      } else {
        await tx.job.update({
          where: { id: jobId },
          data: { status: JobStatus.IN_PROGRESS },
        })
      }
    })

    return { success: true, message: 'Work completion confirmed successfully' }
  }

  /**
   * STEP 12 — Ratings and Reviews
   */
  static async createJobRating(jobId: string, reviewerId: string, data: { revieweeId: string; rating: number; reviewText?: string }) {
    if (reviewerId === data.revieweeId) {
      const err = new Error('You cannot rate yourself')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'RATING_NOT_ALLOWED'
      throw err
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        assignments: true,
      },
    })

    if (!job) {
      const err = new Error('Job not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'JOB_NOT_FOUND'
      throw err
    }

    // Verify reviewer and reviewee participation
    const isPosterReviewer = job.postedById === reviewerId
    const isPosterReviewee = job.postedById === data.revieweeId

    const reviewerAssignment = job.assignments.find((a) => a.workerId === reviewerId)
    const revieweeAssignment = job.assignments.find((a) => a.workerId === data.revieweeId)

    if (!isPosterReviewer && !reviewerAssignment) {
      const err = new Error('Only job participants can submit ratings')
      ;(err as any).statusCode = 403
      ;(err as any).errorCode = 'NOT_JOB_PARTICIPANT'
      throw err
    }

    if (!isPosterReviewee && !revieweeAssignment) {
      const err = new Error('Reviewee was not a participant in this job')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'NOT_JOB_PARTICIPANT'
      throw err
    }

    // Check duplicate rating
    const existingRating = await prisma.rating.findFirst({
      where: {
        jobId,
        reviewerId,
        revieweeId: data.revieweeId,
      },
    })

    if (existingRating) {
      const err = new Error('You have already rated this user for this job')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'ALREADY_RATED'
      throw err
    }

    await prisma.$transaction(async (tx) => {
      await tx.rating.create({
        data: {
          jobId,
          reviewerId,
          revieweeId: data.revieweeId,
          rating: data.rating,
          reviewText: data.reviewText,
          review: data.reviewText,
        },
      })

      await this.updateUserTrustAndRating(data.revieweeId, tx)
    })

    return { success: true, message: 'Rating submitted successfully' }
  }

  /**
   * STEP 14 — Disputes
   */
  static async createJobDispute(jobId: string, raisedById: string, data: { reason: string; description?: string; assignmentId?: string }) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { assignments: true },
    })

    if (!job) {
      const err = new Error('Job not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'JOB_NOT_FOUND'
      throw err
    }

    const isPoster = job.postedById === raisedById
    const isWorker = job.assignments.some((a) => a.workerId === raisedById)

    if (!isPoster && !isWorker) {
      const err = new Error('Only job participants can raise a dispute')
      ;(err as any).statusCode = 403
      ;(err as any).errorCode = 'NOT_JOB_PARTICIPANT'
      throw err
    }

    // Check duplicate active dispute
    const activeDispute = await prisma.dispute.findFirst({
      where: {
        jobId,
        raisedById,
        status: { in: [DisputeStatus.OPEN, DisputeStatus.UNDER_REVIEW, DisputeStatus.INVESTIGATING] },
      },
    })

    if (activeDispute) {
      const err = new Error('You already have an active dispute for this job')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'DUPLICATE_DISPUTE'
      throw err
    }

    const dispute = await prisma.dispute.create({
      data: {
        jobId,
        raisedById,
        assignmentId: data.assignmentId,
        reason: data.reason,
        description: data.description,
        status: DisputeStatus.OPEN,
      },
    })

    return {
      id: dispute.id,
      jobId: dispute.jobId,
      raisedById: dispute.raisedById,
      reason: dispute.reason,
      status: dispute.status.toLowerCase(),
      createdAt: dispute.createdAt.toISOString(),
    }
  }

  static async getAdminDisputes(adminId: string) {
    // Verify admin role
    const userRole = await prisma.userRole.findFirst({
      where: {
        userId: adminId,
        role: { name: 'ADMIN' },
      },
    })

    if (!userRole) {
      const err = new Error('Admin role required to access dispute management')
      ;(err as any).statusCode = 403
      ;(err as any).errorCode = 'FORBIDDEN'
      throw err
    }

    const disputes = await prisma.dispute.findMany({
      include: {
        job: true,
        raisedBy: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return disputes.map((d) => ({
      id: d.id,
      jobId: d.jobId,
      jobTitle: d.job.title,
      raisedBy: d.raisedBy.fullName,
      reason: d.reason,
      description: d.description || undefined,
      status: d.status.toLowerCase(),
      resolution: d.resolution || undefined,
      createdAt: d.createdAt.toISOString(),
    }))
  }

  static async updateAdminDispute(disputeId: string, adminId: string, updates: { status: string; resolution?: string }) {
    const userRole = await prisma.userRole.findFirst({
      where: {
        userId: adminId,
        role: { name: 'ADMIN' },
      },
    })

    if (!userRole) {
      const err = new Error('Admin role required')
      ;(err as any).statusCode = 403
      ;(err as any).errorCode = 'FORBIDDEN'
      throw err
    }

    const statusMap: Record<string, DisputeStatus> = {
      open: DisputeStatus.OPEN,
      under_review: DisputeStatus.UNDER_REVIEW,
      investigating: DisputeStatus.INVESTIGATING,
      resolved: DisputeStatus.RESOLVED,
      rejected: DisputeStatus.REJECTED,
      dismissed: DisputeStatus.DISMISSED,
    }

    const disputeStatus = statusMap[updates.status.toLowerCase()] || DisputeStatus.OPEN

    const updated = await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: disputeStatus,
        resolution: updates.resolution,
        resolvedById: adminId,
        resolvedAt: disputeStatus === DisputeStatus.RESOLVED ? new Date() : undefined,
      },
    })

    return {
      id: updated.id,
      status: updated.status.toLowerCase(),
      resolution: updated.resolution || undefined,
    }
  }

  /**
   * STEP 8 — User Applications Helper
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

    if (!application) return null

    return {
      id: application.id,
      jobId: application.jobId,
      status: application.status.toLowerCase(),
      submittedAt: application.submittedAt.toISOString(),
      message: application.message || undefined,
    }
  }

  static async applyForJob(jobId: string, applicantId: string, message?: string) {
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

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { applications: true },
    })

    if (!job) {
      const err = new Error('Job not found')
      ;(err as any).statusCode = 404
      ;(err as any).errorCode = 'JOB_NOT_FOUND'
      throw err
    }

    if (job.status !== JobStatus.OPEN || isJobExpired(job)) {
      const err = new Error('This job is no longer accepting applications')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'JOB_NOT_OPEN'
      throw err
    }

    if (job.postedById === applicantId) {
      const err = new Error('You cannot apply for a job posted by yourself')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'CANNOT_APPLY_OWN_JOB'
      throw err
    }

    const existingApp = job.applications.find((app) => app.applicantId === applicantId)
    if (existingApp) {
      const err = new Error('You have already applied for this job')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'ALREADY_APPLIED'
      throw err
    }

    const acceptedCount = job.applications.filter((a) => a.status === ApplicationStatus.ACCEPTED).length
    if (acceptedCount >= job.workersRequired) {
      const err = new Error('Required worker capacity for this job has already been filled')
      ;(err as any).statusCode = 400
      ;(err as any).errorCode = 'JOB_FILLED'
      throw err
    }

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
