import type { LanguageCode } from './translations'

export const categoryLabels: Record<string, Record<LanguageCode, string>> = {
  agriculture: { mr: 'शेती काम', hi: 'खेती का काम', en: 'Agriculture' },
  farm: { mr: 'शेती काम', hi: 'खेती का काम', en: 'Farming' },
  construction: { mr: 'बांधकाम', hi: 'निर्माण', en: 'Construction' },
  household: { mr: 'घरकाम', hi: 'घर का काम', en: 'Household' },
  home: { mr: 'घरकाम', hi: 'घर का काम', en: 'Home work' },
  transport: { mr: 'वाहतूक व वाहन', hi: 'परिवहन व वाहन', en: 'Transport & Driving' },
  skilled: { mr: 'कुशल काम', hi: 'कुशल काम', en: 'Skilled work' },
  repair: { mr: 'दुरुस्ती काम', hi: 'मरम्मत काम', en: 'Repair work' },
  work: { mr: 'मजुरी काम', hi: 'मजदूरी काम', en: 'General work' },
  other: { mr: 'इतर काम', hi: 'अन्य काम', en: 'Other work' },
}

export const jobStatusLabels: Record<string, Record<LanguageCode, string>> = {
  open: { mr: 'उपलब्ध', hi: 'उपलब्ध', en: 'Open' },
  OPEN: { mr: 'उपलब्ध', hi: 'उपलब्ध', en: 'Open' },
  in_progress: { mr: 'काम चालू आहे', hi: 'काम जारी है', en: 'In Progress' },
  'in-progress': { mr: 'काम चालू आहे', hi: 'काम जारी है', en: 'In Progress' },
  IN_PROGRESS: { mr: 'काम चालू आहे', hi: 'काम जारी है', en: 'In Progress' },
  completed: { mr: 'पूर्ण झाले', hi: 'पूर्ण हुआ', en: 'Completed' },
  COMPLETED: { mr: 'पूर्ण झाले', hi: 'पूर्ण हुआ', en: 'Completed' },
  expired: { mr: 'मुदत संपली', hi: 'समय समाप्त', en: 'Expired' },
  EXPIRED: { mr: 'मुदत संपली', hi: 'समय समाप्त', en: 'Expired' },
  filled: { mr: 'कामगार मिळाला', hi: 'कामगार मिल गया', en: 'Filled' },
  FILLED: { mr: 'कामगार मिळाला', hi: 'कामगार मिल गया', en: 'Filled' },
  cancelled: { mr: 'रद्द केले', hi: 'रद्द किया गया', en: 'Cancelled' },
  CANCELLED: { mr: 'रद्द केले', hi: 'रद्द किया गया', en: 'Cancelled' },
}

export const applicationStatusLabels: Record<string, Record<LanguageCode, string>> = {
  pending: { mr: 'अर्ज प्रलंबित', hi: 'आवेदन लंबित', en: 'Pending' },
  PENDING: { mr: 'अर्ज प्रलंबित', hi: 'आवेदन लंबित', en: 'Pending' },
  accepted: { mr: 'अर्ज स्वीकारला', hi: 'आवेदन स्वीकृत', en: 'Accepted' },
  ACCEPTED: { mr: 'अर्ज स्वीकारला', hi: 'आवेदन स्वीकृत', en: 'Accepted' },
  rejected: { mr: 'अर्ज नाकारला', hi: 'आवेदन अस्वीकृत', en: 'Rejected' },
  REJECTED: { mr: 'अर्ज नाकारला', hi: 'आवेदन अस्वीकृत', en: 'Rejected' },
  withdrawn: { mr: 'अर्ज मागे घेतला', hi: 'आवेदन वापस लिया', en: 'Withdrawn' },
  WITHDRAWN: { mr: 'अर्ज मागे घेतला', hi: 'आवेदन वापस लिया', en: 'Withdrawn' },
}

export const assignmentStatusLabels: Record<string, Record<LanguageCode, string>> = {
  assigned: { mr: 'काम सोपवले', hi: 'काम सौंपा गया', en: 'Assigned' },
  ASSIGNED: { mr: 'काम सोपवले', hi: 'काम सौंपा गया', en: 'Assigned' },
  in_progress: { mr: 'काम सुरू आहे', hi: 'काम चालू है', en: 'In Progress' },
  IN_PROGRESS: { mr: 'काम सुरू आहे', hi: 'काम चालू है', en: 'In Progress' },
  completed: { mr: 'काम पूर्ण', hi: 'काम पूरा', en: 'Completed' },
  COMPLETED: { mr: 'काम पूर्ण', hi: 'काम पूरा', en: 'Completed' },
  worker_confirmed: { mr: 'कामगाराने पुष्टी केली', hi: 'कामगार ने पुष्टि की', en: 'Worker Confirmed' },
  WORKER_CONFIRMED: { mr: 'कामगाराने पुष्टी केली', hi: 'कामगार ने पुष्टि की', en: 'Worker Confirmed' },
  employer_confirmed: { mr: 'मालकाने पुष्टी केली', hi: 'नियोक्ता ने पुष्टि की', en: 'Employer Confirmed' },
  EMPLOYER_CONFIRMED: { mr: 'मालकाने पुष्टी केली', hi: 'नियोक्ता ने पुष्टि की', en: 'Employer Confirmed' },
  disputed: { mr: 'तक्रार दाखल', hi: 'विवाद दर्ज', en: 'Disputed' },
  DISPUTED: { mr: 'तक्रार दाखल', hi: 'विवाद दर्ज', en: 'Disputed' },
}

export const wageTypeLabels: Record<string, Record<LanguageCode, string>> = {
  daily: { mr: 'प्रति दिवस (दिवसाला)', hi: 'प्रति दिन (दैनिक)', en: 'Daily wage' },
  fixed: { mr: 'ठोक रक्कम (पूर्ण काम)', hi: 'एकमुश्त (पूरा काम)', en: 'Fixed payment' },
  hourly: { mr: 'प्रति तास', hi: 'प्रति घंटा', en: 'Hourly rate' },
}

export const roleLabels: Record<string, Record<LanguageCode, string>> = {
  worker: { mr: 'कामगार', hi: 'कामगार', en: 'Worker' },
  employer: { mr: 'काम देणारे (मालक)', hi: 'काम देने वाले (नियोक्ता)', en: 'Employer' },
  both: { mr: 'दोन्ही (कामगार व काम देणारे)', hi: 'दोनों (कामगार व नियोक्ता)', en: 'Both' },
}

export const vehicleLabels: Record<string, Record<LanguageCode, string>> = {
  none: { mr: 'कोणतेही नाही', hi: 'कोई नहीं', en: 'None' },
  bicycle: { mr: 'सायकल', hi: 'साइकिल', en: 'Bicycle' },
  motorcycle: { mr: 'मोटारसायकल', hi: 'मोटरसाइकिल', en: 'Motorcycle' },
  scooter: { mr: 'स्कूटर', hi: 'स्कूटर', en: 'Scooter' },
  auto: { mr: 'रिक्षा / ऑटो', hi: 'ऑटो रिक्शा', en: 'Auto Rickshaw' },
  tractor: { mr: 'ट्रॅक्टर', hi: 'ट्रैक्टर', en: 'Tractor' },
  car: { mr: 'कार', hi: 'कार', en: 'Car' },
  pickup: { mr: 'पिकअप व्हॅन', hi: 'पिकअप वैन', en: 'Pickup van' },
  other: { mr: 'इतर वाहन', hi: 'अन्य वाहन', en: 'Other vehicle' },
}

export const dayLabels: Record<string, Record<LanguageCode, string>> = {
  monday: { mr: 'सोमवार', hi: 'सोमवार', en: 'Monday' },
  tuesday: { mr: 'मंगळवार', hi: 'मंगलवार', en: 'Tuesday' },
  wednesday: { mr: 'बुधवार', hi: 'बुधवार', en: 'Wednesday' },
  thursday: { mr: 'गुरुवार', hi: 'गुरुवार', en: 'Thursday' },
  friday: { mr: 'शुक्रवार', hi: 'शुक्रवार', en: 'Friday' },
  saturday: { mr: 'शनिवार', hi: 'शनिवार', en: 'Saturday' },
  sunday: { mr: 'रविवार', hi: 'रविवार', en: 'Sunday' },
}

export function localizeCategory(category: string | undefined, lang: LanguageCode): string {
  if (!category) return ''
  const key = category.toLowerCase().trim()
  return categoryLabels[key]?.[lang] || category
}

export function localizeJobStatus(status: string | undefined, lang: LanguageCode): string {
  if (!status) return ''
  return jobStatusLabels[status]?.[lang] || jobStatusLabels[status.toLowerCase()]?.[lang] || status
}

export function localizeApplicationStatus(status: string | undefined, lang: LanguageCode): string {
  if (!status) return ''
  return applicationStatusLabels[status]?.[lang] || applicationStatusLabels[status.toLowerCase()]?.[lang] || status
}

export function localizeAssignmentStatus(status: string | undefined, lang: LanguageCode): string {
  if (!status) return ''
  return assignmentStatusLabels[status]?.[lang] || assignmentStatusLabels[status.toLowerCase()]?.[lang] || status
}

export function localizeWageType(wageType: string | undefined, lang: LanguageCode): string {
  if (!wageType) return ''
  return wageTypeLabels[wageType.toLowerCase()]?.[lang] || wageType
}

export function localizeRole(role: string | undefined, lang: LanguageCode): string {
  if (!role) return ''
  return roleLabels[role.toLowerCase()]?.[lang] || role
}

export function localizeVehicle(vehicle: string | undefined, lang: LanguageCode): string {
  if (!vehicle) return ''
  return vehicleLabels[vehicle.toLowerCase()]?.[lang] || vehicle
}

export function localizeDay(day: string | undefined, lang: LanguageCode): string {
  if (!day) return ''
  return dayLabels[day.toLowerCase()]?.[lang] || day
}

export function formatWorkersNeeded(count: number, lang: LanguageCode): string {
  if (lang === 'mr') return `${count} कामगार आवश्यक`
  if (lang === 'hi') return `${count} कामगार चाहिए`
  return `${count} ${count === 1 ? 'worker needed' : 'workers needed'}`
}

export function formatDistance(distanceKm: number | string, lang: LanguageCode): string {
  if (lang === 'mr') return `${distanceKm} किमी अंतर`
  if (lang === 'hi') return `${distanceKm} किमी दूरी`
  return `${distanceKm} km away`
}

export function formatReviewCount(count: number, lang: LanguageCode): string {
  if (lang === 'mr') return `(${count} अभिप्राय)`
  if (lang === 'hi') return `(${count} समीक्षाएं)`
  return `(${count} reviews)`
}
