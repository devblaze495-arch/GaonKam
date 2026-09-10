import { useContext, useMemo } from 'react'
import { LanguageContext } from './LanguageContext'
import {
  localizeCategory,
  localizeJobStatus,
  localizeApplicationStatus,
  localizeAssignmentStatus,
  localizeWageType,
  localizeRole,
  localizeVehicle,
  localizeDay,
  formatWorkersNeeded,
  formatDistance,
  formatReviewCount,
} from './localizationHelpers'

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }

  const { language, setLanguage, t, languageLabels } = context

  return useMemo(() => ({
    language,
    setLanguage,
    t,
    languageLabels,
    localizeCategory: (cat: string | undefined) => localizeCategory(cat, language),
    localizeJobStatus: (status: string | undefined) => localizeJobStatus(status, language),
    localizeApplicationStatus: (status: string | undefined) => localizeApplicationStatus(status, language),
    localizeAssignmentStatus: (status: string | undefined) => localizeAssignmentStatus(status, language),
    localizeWageType: (wt: string | undefined) => localizeWageType(wt, language),
    localizeRole: (role: string | undefined) => localizeRole(role, language),
    localizeVehicle: (v: string | undefined) => localizeVehicle(v, language),
    localizeDay: (d: string | undefined) => localizeDay(d, language),
    formatWorkersNeeded: (count: number) => formatWorkersNeeded(count, language),
    formatDistance: (dist: number | string) => formatDistance(dist, language),
    formatReviewCount: (count: number) => formatReviewCount(count, language),
  }), [language, setLanguage, t, languageLabels])
}
