import { skillOptions } from '../data/profileData'
import { normalizeLocalizedName, type LocalizedName, type User, type UserProfile } from '../types/auth'
import type { AvailabilityId, ProfileData, Transportation, UserSkill, WorkPreferences } from '../types/profile'

const profileStorageKey = 'gaavkaam.profile.'

const wait = (duration = 300) => new Promise((resolve) => window.setTimeout(resolve, duration))

function defaultProfile(user: User): ProfileData {
  return {
    userId: user.id,
    fullName: normalizeLocalizedName(user.profile?.fullName) ?? { original: 'शुभ', en: 'Shubh' },
    village: user.profile?.village ?? 'Karad',
    taluka: user.profile?.taluka ?? 'Karad',
    district: user.profile?.district ?? 'Satara',
    preferredLanguage: user.profile?.preferredLanguage ?? 'mr',
    languagesKnown: user.profile?.languagesKnown ?? ['marathi', 'hindi'],
    skills: [{ skillId: 'farming', experience: 'five-plus' }, { skillId: 'general-labor', experience: 'three-five' }, { skillId: 'driving', experience: 'one-three' }],
    workPreferences: { dailyWage: 650, availability: 'this-week', selectedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
    transportation: { vehicles: ['motorcycle'], canTravel: true, maxDistance: '10' },
    trust: { score: 92, rating: 4.8, reviewCount: 24, completedJobs: 31 },
    rating: { rating: 4.8, reviewCount: 24 },
  }
}

function readProfile(user: User) {
  const stored = window.localStorage.getItem(`${profileStorageKey}${user.id}`)
  if (!stored) return defaultProfile(user)
  const profile = JSON.parse(stored) as ProfileData & { fullName: LocalizedName | string }
  return { ...profile, fullName: normalizeLocalizedName(profile.fullName) ?? defaultProfile(user).fullName }
}

function saveProfile(profile: ProfileData) {
  window.localStorage.setItem(`${profileStorageKey}${profile.userId}`, JSON.stringify(profile))
  return profile
}

function mergeProfile(profile: ProfileData): UserProfile {
  return { fullName: profile.fullName, village: profile.village, taluka: profile.taluka, district: profile.district, preferredLanguage: profile.preferredLanguage, languagesKnown: profile.languagesKnown }
}


export type ProfileService = {
  getProfile: (user: User) => Promise<ProfileData>
  updateProfile: (user: User, profile: ProfileData) => Promise<{ profile: ProfileData; userProfile: UserProfile }>
  updateSkills: (user: User, skills: UserSkill[]) => Promise<ProfileData>
  updateWorkPreferences: (user: User, preferences: WorkPreferences) => Promise<ProfileData>
  updateTransportation: (user: User, transportation: Transportation) => Promise<ProfileData>
}

export const profileService: ProfileService = {
  async getProfile(user) { await wait(180); return readProfile(user) },
  async updateProfile(_user, profile) { await wait(); const next = saveProfile(profile); return { profile: next, userProfile: mergeProfile(next) } },
  async updateSkills(user, skills) { await wait(); const next = saveProfile({ ...readProfile(user), skills }); return next },
  async updateWorkPreferences(user, workPreferences) { await wait(); const next = saveProfile({ ...readProfile(user), workPreferences }); return next },
  async updateTransportation(user, transportation) { await wait(); const next = saveProfile({ ...readProfile(user), transportation }); return next },
}

export { skillOptions }
export const profileStoragePrefix = profileStorageKey
export type { AvailabilityId }
