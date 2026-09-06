import { useState, type ReactNode } from 'react'
import { LanguageContext } from './LanguageContext'
import type { LanguageContextValue } from './LanguageContext'
import { languageLabels, translations, type LanguageCode } from './translations'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>('mr')

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: (key) => translations[language][key],
    languageLabels,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
