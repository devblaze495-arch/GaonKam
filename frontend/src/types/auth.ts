import type { LanguageCode } from '../i18n/translations'

export type UserIntent = 'find-work' | 'post-work' | 'find-service' | 'offer-service'

export type UserProfile = {
  fullName: string
  village: string
  taluka: string
  district: string
  preferredLanguage: LanguageCode
}

export type User = {
  id: string
  phone: string
  profile?: UserProfile
  intents: UserIntent[]
}

export type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated'

export type AuthState = {
  status: AuthStatus
  onboardingCompleted: boolean
  user: User | null
}