import type { LocalizedName } from './auth'

export type AvailabilityId = 'today' | 'this-week' | 'selected-days' | 'unavailable'
export type DayId = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type VehicleId = 'none' | 'bicycle' | 'motorcycle' | 'scooter' | 'auto' | 'tractor' | 'car' | 'pickup' | 'other'
export type TravelDistanceId = '5' | '10' | '20' | '30-plus'

export type Skill = { id: string; category: string; name: { mr: string; hi: string; en: string } }
export type UserSkill = { skillId: string; experience: 'less-than-year' | 'one-three' | 'three-five' | 'five-plus' }
export type WorkPreferences = { dailyWage: number; availability: AvailabilityId; selectedDays: DayId[] }
export type Transportation = { vehicles: VehicleId[]; canTravel: boolean; maxDistance: TravelDistanceId }
export type TrustScoreSummary = { score: number; rating: number; reviewCount: number; completedJobs: number }
export type RatingSummary = { rating: number; reviewCount: number }

export type ProfileData = {
  userId: string
  fullName: LocalizedName
  village: string
  taluka: string
  district: string
  preferredLanguage: 'mr' | 'hi' | 'en'
  languagesKnown: string[]
  skills: UserSkill[]
  workPreferences: WorkPreferences
  transportation: Transportation
  trust: TrustScoreSummary
  rating: RatingSummary
}