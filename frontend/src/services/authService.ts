import type { User, UserIntent, UserProfile } from '../types/auth'

const userStorageKey = 'gaavkaam.auth.user'
const onboardingStorageKey = 'gaavkaam.onboarding.completed'
const pendingPhoneStorageKey = 'gaavkaam.auth.pending-phone'
const mockOtp = '123456'

// Frontend-only contract: replace these delayed mock methods with backend API calls when auth endpoints are ready.

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

const wait = (duration = 350) => new Promise((resolve) => window.setTimeout(resolve, duration))

function readUser() {
  const stored = window.localStorage.getItem(userStorageKey)
  return stored ? JSON.parse(stored) as User : null
}

function saveUser(user: User) {
  window.localStorage.setItem(userStorageKey, JSON.stringify(user))
  return user
}

export const authService: AuthService = {
  async getCurrentUser() {
    await wait(180)
    return readUser()
  },

  async isOnboardingComplete() {
    await wait(120)
    return window.localStorage.getItem(onboardingStorageKey) === 'true'
  },

  async markOnboardingComplete() {
    await wait(120)
    window.localStorage.setItem(onboardingStorageKey, 'true')
  },

  async requestOtp(phone) {
    await wait()
    if (!/^\d{10}$/.test(phone)) throw new Error('INVALID_PHONE')
    window.localStorage.setItem(pendingPhoneStorageKey, phone)
  },

  getPendingPhone() {
    return window.localStorage.getItem(pendingPhoneStorageKey) ?? ''
  },

  async verifyOtp(phone, otp) {
    await wait()
    if (otp !== mockOtp) throw new Error('INVALID_OTP')
    window.localStorage.removeItem(pendingPhoneStorageKey)
    return saveUser({ id: `mock-user-${phone}`, phone, intents: [] })
  },

  async updateProfile(userId, profile) {
    await wait()
    const user = readUser()
    if (!user || user.id !== userId) throw new Error('USER_NOT_FOUND')
    return saveUser({ ...user, profile })
  },

  async updateIntents(userId, intents) {
    await wait()
    const user = readUser()
    if (!user || user.id !== userId) throw new Error('USER_NOT_FOUND')
    return saveUser({ ...user, intents })
  },

  async logout() {
    await wait(120)
    window.localStorage.removeItem(userStorageKey)
    window.localStorage.removeItem(pendingPhoneStorageKey)
  },
}

export const authStorageKeys = { onboarding: onboardingStorageKey, user: userStorageKey, pendingPhone: pendingPhoneStorageKey }
