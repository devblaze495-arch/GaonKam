import { ApplicationStatus, JobStatus } from '@prisma/client'

export interface UserLocationContext {
  village?: string | null
  taluka?: string | null
  district?: string | null
  latitude?: number | null
  longitude?: number | null
}

export function formatLocalizedText(
  fallback: string,
  mr?: string | null,
  hi?: string | null,
  en?: string | null,
) {
  return {
    mr: mr || fallback,
    hi: hi || fallback,
    en: en || fallback,
  }
}

export function calculateLocalityDistance(
  jobLoc: { village?: string | null; taluka?: string | null; district?: string | null },
  userLoc?: UserLocationContext,
): number {
  if (!userLoc) return 2.5

  const jv = (jobLoc.village || '').trim().toLowerCase()
  const jt = (jobLoc.taluka || '').trim().toLowerCase()
  const jd = (jobLoc.district || '').trim().toLowerCase()

  const uv = (userLoc.village || '').trim().toLowerCase()
  const ut = (userLoc.taluka || '').trim().toLowerCase()
  const ud = (userLoc.district || '').trim().toLowerCase()

  if (uv && jv && uv === jv) return 1.5
  if (ut && jt && ut === jt) return 5.0
  if (ud && jd && ud === jd) return 12.5
  return 25.0
}

export function isJobExpired(job: {
  status: JobStatus
  applicationDeadline?: Date | null
  workDateObj?: Date | null
}): boolean {
  if (job.status === JobStatus.EXPIRED || job.status === JobStatus.CANCELLED || job.status === JobStatus.COMPLETED) {
    return true
  }

  const now = new Date()
  if (job.applicationDeadline && new Date(job.applicationDeadline) < now) {
    return true
  }

  if (job.workDateObj) {
    const endOfDay = new Date(job.workDateObj)
    endOfDay.setHours(23, 59, 59, 999)
    if (endOfDay < now) {
      return true
    }
  }

  return false
}

export function mapJobToFrontendDto(job: any, currentUserId?: string, userLoc?: UserLocationContext) {
  const expired = isJobExpired(job)
  const computedStatus = expired ? 'expired' : (job.status ? job.status.toLowerCase().replace('_', '-') : 'open')

  const distanceKm = job.distanceKm && job.distanceKm > 0
    ? job.distanceKm
    : calculateLocalityDistance(
        { village: job.village, taluka: job.taluka, district: job.district },
        userLoc,
      )

  const village = job.village || ''
  const taluka = job.taluka || ''
  const district = job.district || ''
  const locationStr = [village, district].filter(Boolean).join(', ')

  const poster = job.postedBy || {}
  const employerLocation = [poster.village, poster.district].filter(Boolean).join(', ') || locationStr

  const requiredSkillIds = (job.requiredSkills || []).map((s: any) => s.skillId)
  if (requiredSkillIds.length === 0 && job.jobSkills) {
    job.jobSkills.forEach((js: any) => requiredSkillIds.push(js.skillId))
  }

  let applicationStatus: string | null = null
  if (currentUserId && Array.isArray(job.applications)) {
    const myApp = job.applications.find((app: any) => app.applicantId === currentUserId)
    if (myApp) {
      applicationStatus = myApp.status.toLowerCase()
    }
  }

  const categoryId = ['agriculture', 'construction', 'household', 'transport', 'skilled', 'other'].includes(
    job.categoryId,
  )
    ? job.categoryId
    : 'other'

  return {
    id: job.id,
    title: formatLocalizedText(
      job.title || 'काम',
      job.titleMr,
      job.titleHi,
      job.titleEn,
    ),
    description: formatLocalizedText(
      job.description || '',
      job.descriptionMr,
      job.descriptionHi,
      job.descriptionEn,
    ),
    categoryId,
    category: formatLocalizedText(
      job.category?.name || 'काम',
      job.category?.nameMr,
      job.category?.nameHi,
      job.category?.nameEn,
    ),
    location: formatLocalizedText(locationStr, locationStr, locationStr, locationStr),
    locationDetails: {
      village: formatLocalizedText(village, village, village, village),
      taluka: formatLocalizedText(taluka, taluka, taluka, taluka),
      district: formatLocalizedText(district, district, district, district),
    },
    distanceKm,
    distance: formatLocalizedText(
      `${distanceKm} km`,
      `${distanceKm} किमी`,
      `${distanceKm} किमी`,
      `${distanceKm} km`,
    ),
    paymentDetails: {
      amount: job.wageAmount || 500,
      type: job.wageType === 'FIXED' ? 'fixed' : 'daily',
    },
    payment: formatLocalizedText(
      `₹${job.wageAmount || 500}`,
      `₹${job.wageAmount || 500}`,
      `₹${job.wageAmount || 500}`,
      `₹${job.wageAmount || 500}`,
    ),
    dateLabel: formatLocalizedText(
      job.workDate || 'आज',
      job.workDate || 'आज',
      job.workDate || 'आज',
      job.workDate || 'Today',
    ),
    schedule: {
      date: job.workDate || new Date().toISOString().split('T')[0],
      time: job.startTime || '08:00',
    },
    postedBy: formatLocalizedText(
      poster.fullName || 'नियोक्ता',
      poster.fullName || 'नियोक्ता',
      poster.fullName || 'नियोक्ता',
      poster.fullNameEn || poster.fullName || 'Employer',
    ),
    postedAt: (job.postedAt || job.createdAt || new Date()).toISOString(),
    status: computedStatus,
    requiredSkillIds,
    workersRequired: job.workersRequired || 1,
    employer: {
      name: formatLocalizedText(
        poster.fullName || 'नियोक्ता',
        poster.fullName,
        poster.fullName,
        poster.fullNameEn || poster.fullName,
      ),
      location: formatLocalizedText(employerLocation, employerLocation, employerLocation, employerLocation),
      trustScore: poster.trustScore ?? 90,
      rating: poster.rating ?? 0.0,
      reviewCount: poster.reviewCount ?? 0,
    },
    ...(applicationStatus ? { applicationStatus } : {}),
  }
}
