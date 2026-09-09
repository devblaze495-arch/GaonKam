import type { LanguageCode } from '../i18n/translations'

export type UserIntent = 'find-work' | 'post-work' | 'find-service' | 'offer-service'
export type LocalizedName = { original: string; en?: string }
type LegacyLocalizedName = { mr?: string; hi?: string; en?: string }

export function localizedName(name: LocalizedName | LegacyLocalizedName | string | undefined, language: LanguageCode) {
  if (!name) return ''
  if (typeof name === 'string') return name
  if ('original' in name) return language === 'en' ? name.en || name.original : name.original
  return language === 'en' ? name.en || name.mr || name.hi || '' : name.mr || name.hi || name.en || ''
}

export function normalizeLocalizedName(name: LocalizedName | LegacyLocalizedName | string | undefined): LocalizedName | undefined {
  if (!name) return undefined
  if (typeof name === 'string') return { original: name }
  if ('original' in name) return name
  return { original: name.mr || name.hi || name.en || '', en: name.en }
}

export type UserProfile = {
  fullName: LocalizedName
  village: string
  taluka: string
  district: string
  preferredLanguage: LanguageCode
  languagesKnown?: string[]
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