import { useState, type ReactNode } from 'react'
import { LanguageContext } from './LanguageContext'
import type { LanguageContextValue } from './LanguageContext'
import { languageLabels, optionalNameTranslations, translations, type LanguageCode } from './translations'

const languageStorageKey = 'gaavkaam.language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const stored = window.localStorage.getItem(languageStorageKey)
    return stored === 'mr' || stored === 'hi' || stored === 'en' ? stored : 'mr'
  })

  function setLanguage(nextLanguage: LanguageCode) {
    setLanguageState(nextLanguage)
    window.localStorage.setItem(languageStorageKey, nextLanguage)
  }

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: (key: string) => {
      if (key === 'englishName' || key === 'englishNamePlaceholder') {
        return optionalNameTranslations[language][key]
      }
      return translations[language][key] || String(key)
    },
    languageLabels,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
