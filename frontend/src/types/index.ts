import type { LanguageCode } from '../i18n/translations'

export type LocalizedText = Record<LanguageCode, string>
export type JobStatus = 'open' | 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'expired' | 'filled'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'
export type JobCategoryId = 'agriculture' | 'construction' | 'household' | 'transport' | 'skilled' | 'other'
export type PaymentType = 'daily' | 'fixed'
export type JobLocation = { village: LocalizedText; taluka: LocalizedText; district: LocalizedText }
export type ProfileLocation = { village?: string; taluka?: string; district?: string }
export type JobFilters = { query?: string; categoryId?: JobCategoryId; maxDistance?: number; minWage?: number; date?: 'today' | 'tomorrow' | 'this-week'; skillId?: string; sort?: 'nearest' | 'highest-wage' | 'newest'; profileLocation?: ProfileLocation }
export type JobPayment = { amount: number; type: PaymentType }
export type JobSchedule = { date: string; time: string }
export type EmployerSummary = { name: LocalizedText; location: LocalizedText; trustScore: number; rating: number; reviewCount: number }

export type Job = {
  id: string
  title: LocalizedText
  description: LocalizedText
  category: LocalizedText
  location: LocalizedText
  distance: LocalizedText
  payment: LocalizedText
  dateLabel: LocalizedText
  postedBy: LocalizedText
  status: JobStatus
  categoryId: JobCategoryId
  requiredSkillIds: string[]
  paymentDetails: JobPayment
  schedule: JobSchedule
  employer: EmployerSummary
  locationDetails: JobLocation
  distanceKm: number
  workersRequired: number
  postedAt: string
}

export type Service = {
  id: string
  name: LocalizedText
  description: LocalizedText
  provider: LocalizedText
  location: LocalizedText
  rate: LocalizedText
  rating: number
  available: boolean
}

export function localizedText(value: LocalizedText, language: LanguageCode) {
  return value[language]
}
