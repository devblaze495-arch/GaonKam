import type { LanguageCode } from '../i18n/translations'

export type LocalizedText = Record<LanguageCode, string>
export type JobStatus = 'open' | 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'expired'

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
