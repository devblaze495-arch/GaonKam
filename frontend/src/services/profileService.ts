import { skillOptions } from '../data/profileData'
import { normalizeLocalizedName, type LocalizedName, type User, type UserProfile } from '../types/auth'
import type { AvailabilityId, ProfileData, Transportation, UserSkill, WorkPreferences } from '../types/profile'
import { apiRequest } from './apiClient'

const profileStorageKey = 'gaavkaam.profile.'

function defaultProfile(user: User): ProfileData {
  return {
    userId: user.id,
    fullName: normalizeLocalizedName(user.profile?.fullName) ?? { original: 'शुभ', en: 'Shubh' },
    village: user.profile?.village ?? '',
    taluka: user.profile?.taluka ?? '',
    district: user.profile?.district ?? '',
    preferredLanguage: user.profile?.preferredLanguage ?? 'mr',
    languagesKnown: user.profile?.languagesKnown ?? ['marathi', 'hindi'],
    skills: [{ skillId: 'farming', experience: 'five-plus' }, { skillId: 'general-labor', experience: 'three-five' }, { skillId: 'driving', experience: 'one-three' }],
    workPreferences: { dailyWage: 650, availability: 'this-week', selectedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
    transportation: { vehicles: ['motorcycle'], canTravel: true, maxDistance: '10' },
    trust: { score: 92, rating: 4.8, reviewCount: 24, completedJobs: 31 },
    rating: { rating: 4.8, reviewCount: 24 },
  }
}

function readProfile(user: User): ProfileData {
  const stored = window.localStorage.getItem(`${profileStorageKey}${user.id}`)
  if (!stored) return defaultProfile(user)
  try {
    const profile = JSON.parse(stored) as ProfileData & { fullName: LocalizedName | string }
    const fallback = defaultProfile(user)
    return {
      ...profile,
      fullName: normalizeLocalizedName(user.profile?.fullName ?? profile.fullName) ?? fallback.fullName,
      village: user.profile?.village ?? profile.village ?? fallback.village,
      taluka: user.profile?.taluka ?? profile.taluka ?? fallback.taluka,
      district: user.profile?.district ?? profile.district ?? fallback.district,
    }
  } catch {
    return defaultProfile(user)
  }
}

function saveProfile(profile: ProfileData): ProfileData {
  window.localStorage.setItem(`${profileStorageKey}${profile.userId}`, JSON.stringify(profile))
  return profile
}

function mergeProfile(profile: ProfileData): UserProfile {
  return {
    fullName: profile.fullName,
    village: profile.village,
    taluka: profile.taluka,
    district: profile.district,
    preferredLanguage: profile.preferredLanguage,
    languagesKnown: profile.languagesKnown,
  }
}

function mapBackendProfileToFrontend(backendProfile: any, user: User): ProfileData {
  const fullNameNorm =
    normalizeLocalizedName(backendProfile.fullName) ??
    normalizeLocalizedName(user.profile?.fullName) ?? { original: 'गावाकडचा कामगार' }

  return {
    userId: user.id,
    fullName: fullNameNorm,
    village: backendProfile.village ?? user.profile?.village ?? '',
    taluka: backendProfile.taluka ?? user.profile?.taluka ?? '',
    district: backendProfile.district ?? user.profile?.district ?? '',
    preferredLanguage: backendProfile.preferredLanguage ?? user.profile?.preferredLanguage ?? 'mr',
    languagesKnown: backendProfile.languagesKnown ?? user.profile?.languagesKnown ?? ['marathi'],
    skills: backendProfile.skills || [],
    workPreferences: {
      dailyWage: backendProfile.workPreferences?.dailyWage ?? 650,
      availability: backendProfile.workPreferences?.availability ?? 'this-week',
      selectedDays: backendProfile.workPreferences?.selectedDays ?? [],
    },
    transportation: {
      vehicles: backendProfile.transportation?.vehicles ?? ['motorcycle'],
      canTravel: backendProfile.transportation?.canTravel ?? true,
      maxDistance: backendProfile.transportation?.maxDistance ?? '10',
    },
    trust: {
      score: backendProfile.trust?.score ?? 90,
      rating: backendProfile.trust?.rating ?? 0.0,
      reviewCount: backendProfile.trust?.reviewCount ?? 0,
      completedJobs: backendProfile.trust?.completedJobs ?? 0,
    },
    rating: {
      rating: backendProfile.rating?.rating ?? 0.0,
      reviewCount: backendProfile.rating?.reviewCount ?? 0,
    },
  }
}

export type ProfileService = {
  getProfile: (user: User) => Promise<ProfileData>
  updateProfile: (user: User, profile: ProfileData) => Promise<{ profile: ProfileData; userProfile: UserProfile }>
  updateSkills: (user: User, skills: UserSkill[]) => Promise<ProfileData>
  updateWorkPreferences: (user: User, preferences: WorkPreferences) => Promise<ProfileData>
  updateTransportation: (user: User, transportation: Transportation) => Promise<ProfileData>
}

export const profileService: ProfileService = {
  async getProfile(user) {
    try {
      const backendProfile = await apiRequest<any>('/users/me/profile')
      const profile = mapBackendProfileToFrontend(backendProfile, user)
      saveProfile(profile)
      return profile
    } catch {
      return readProfile(user)
    }
  },

  async updateProfile(user, profile) {
    try {
      const updated = await apiRequest<any>('/users/me/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          fullName: profile.fullName,
          village: profile.village,
          taluka: profile.taluka,
          district: profile.district,
          preferredLanguage: profile.preferredLanguage,
          languagesKnown: profile.languagesKnown,
        }),
      })

      const nextProfile = mapBackendProfileToFrontend(updated, user)
      saveProfile(nextProfile)
      return { profile: nextProfile, userProfile: mergeProfile(nextProfile) }
    } catch {
      const next = saveProfile(profile)
      return { profile: next, userProfile: mergeProfile(next) }
    }
  },

  async updateSkills(user, skills) {
    try {
      await apiRequest('/users/me/skills', {
        method: 'PUT',
        body: JSON.stringify(skills),
      })
      const next = saveProfile({ ...readProfile(user), skills })
      return next
    } catch {
      const next = saveProfile({ ...readProfile(user), skills })
      return next
    }
  },

  async updateWorkPreferences(user, workPreferences) {
    try {
      await apiRequest('/users/me/preferences', {
        method: 'PUT',
        body: JSON.stringify(workPreferences),
      })
      const next = saveProfile({ ...readProfile(user), workPreferences })
      return next
    } catch {
      const next = saveProfile({ ...readProfile(user), workPreferences })
      return next
    }
  },

  async updateTransportation(user, transportation) {
    try {
      await apiRequest('/users/me/transportation', {
        method: 'PUT',
        body: JSON.stringify(transportation),
      })
      const next = saveProfile({ ...readProfile(user), transportation })
      return next
    } catch {
      const next = saveProfile({ ...readProfile(user), transportation })
      return next
    }
  },
}

export { skillOptions }
export const profileStoragePrefix = profileStorageKey
export type { AvailabilityId }
