import { normalizeLocalizedName, type LocalizedName, type User, type UserIntent, type UserProfile } from '../types/auth'
import { apiRequest, getAuthToken, removeAuthToken, setAuthToken } from './apiClient'

const userStorageKey = 'gaavkaam.auth.user'
const onboardingStorageKey = 'gaavkaam.onboarding.completed'
const pendingPhoneStorageKey = 'gaavkaam.auth.pending-phone'

export type AuthService = {
  getCurrentUser: () => Promise<User | null>
  isOnboardingComplete: () => Promise<boolean>
  markOnboardingComplete: () => Promise<void>
  requestOtp: (phone: string) => Promise<void>
  getPendingPhone: () => string
  verifyOtp: (phone: string, otp: string) => Promise<User>
  updateProfile: (userId: string, profile: UserProfile) => Promise<User>
  updateIntents: (userId: string, intents: UserIntent[]) => Promise<User>
  logout: () => Promise<void>
}

function readUser(): User | null {
  const stored = window.localStorage.getItem(userStorageKey)
  if (!stored) return null
  try {
    const user = JSON.parse(stored) as User & { profile?: UserProfile & { fullName: LocalizedName | string } }
    if (user.profile) user.profile.fullName = normalizeLocalizedName(user.profile.fullName) ?? { original: '' }
    return user as User
  } catch {
    return null
  }
}

function saveUser(user: User): User {
  window.localStorage.setItem(userStorageKey, JSON.stringify(user))
  return user
}

function mapBackendUserToFrontend(backendUser: any): User {
  const hasProfileInfo = Boolean(
    backendUser.village || backendUser.taluka || backendUser.district || backendUser.fullName,
  )

  const profile: UserProfile | undefined = hasProfileInfo
    ? {
        fullName: normalizeLocalizedName(
          backendUser.fullName && typeof backendUser.fullName === 'object'
            ? backendUser.fullName
            : { original: backendUser.fullName || '', en: backendUser.fullNameEn || '' },
        ) ?? { original: '' },
        village: backendUser.village || '',
        taluka: backendUser.taluka || '',
        district: backendUser.district || '',
        preferredLanguage: backendUser.preferredLanguage || 'mr',
        languagesKnown: backendUser.languagesKnown || ['marathi'],
      }
    : undefined

  return {
    id: backendUser.id,
    phone: backendUser.phone || backendUser.mobile || '',
    intents: (backendUser.intents || []) as UserIntent[],
    ...(profile ? { profile } : {}),
  }
}

export const authService: AuthService = {
  async getCurrentUser() {
    const token = getAuthToken()
    if (!token) return readUser()

    try {
      const backendUser = await apiRequest<any>('/auth/me')
      const user = mapBackendUserToFrontend(backendUser)
      return saveUser(user)
    } catch {
      return readUser()
    }
  },

  async isOnboardingComplete() {
    return window.localStorage.getItem(onboardingStorageKey) === 'true'
  },

  async markOnboardingComplete() {
    window.localStorage.setItem(onboardingStorageKey, 'true')
  },

  async requestOtp(phone: string) {
    if (!/^[6-9]\d{9}$/.test(phone) && !/^\d{10}$/.test(phone)) {
      throw new Error('INVALID_PHONE')
    }

    try {
      await apiRequest('/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      })
      window.localStorage.setItem(pendingPhoneStorageKey, phone)
    } catch (err: any) {
      if (err.errorCode === 'VALIDATION_ERROR' || err.statusCode === 400) {
        throw new Error('INVALID_PHONE')
      }
      throw err
    }
  },

  getPendingPhone() {
    return window.localStorage.getItem(pendingPhoneStorageKey) ?? ''
  },

  async verifyOtp(phone: string, otp: string) {
    try {
      const response = await apiRequest<{ token: string; user: any }>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      })

      if (response.token) {
        setAuthToken(response.token)
      }

      window.localStorage.removeItem(pendingPhoneStorageKey)
      const user = mapBackendUserToFrontend(response.user)
      return saveUser(user)
    } catch (err: any) {
      if (err.errorCode === 'INVALID_OTP' || err.statusCode === 400) {
        throw new Error('INVALID_OTP')
      }
      throw err
    }
  },

  async updateProfile(userId: string, profile: UserProfile) {
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

      const currentUser = readUser() || { id: userId, phone: '', intents: [] }
      const nextUser: User = {
        ...currentUser,
        profile: {
          fullName: normalizeLocalizedName(updated.fullName) ?? profile.fullName,
          village: updated.village || profile.village,
          taluka: updated.taluka || profile.taluka,
          district: updated.district || profile.district,
          preferredLanguage: updated.preferredLanguage || profile.preferredLanguage,
          languagesKnown: updated.languagesKnown || profile.languagesKnown,
        },
      }
      return saveUser(nextUser)
    } catch (err) {
      const user = readUser()
      if (!user || user.id !== userId) throw new Error('USER_NOT_FOUND')
      return saveUser({ ...user, profile })
    }
  },

  async updateIntents(userId: string, intents: UserIntent[]) {
    try {
      await apiRequest<any>('/users/me/intents', {
        method: 'PUT',
        body: JSON.stringify({ intents }),
      })

      const currentUser = readUser() || { id: userId, phone: '', intents: [] }
      return saveUser({ ...currentUser, intents })
    } catch (err) {
      const user = readUser()
      if (!user || user.id !== userId) throw new Error('USER_NOT_FOUND')
      return saveUser({ ...user, intents })
    }
  },

  async logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' })
    } catch {
      // Ignore network failure on logout
    } finally {
      removeAuthToken()
      window.localStorage.removeItem(userStorageKey)
      window.localStorage.removeItem(pendingPhoneStorageKey)
    }
  },
}

export const authStorageKeys = {
  onboarding: onboardingStorageKey,
  user: userStorageKey,
  pendingPhone: pendingPhoneStorageKey,
}
