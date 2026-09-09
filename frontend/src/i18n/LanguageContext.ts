import { createContext } from 'react'
import type { LanguageCode } from './translations'
import { languageLabels } from './translations'

export type LanguageContextValue = {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
  t: (key: any) => string
  languageLabels: typeof languageLabels
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
