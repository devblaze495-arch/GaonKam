import type { JobCategoryId } from '../types'

export const jobCategories: { id: JobCategoryId; name: { mr: string; hi: string; en: string } }[] = [
  { id: 'agriculture', name: { mr: 'शेती', hi: 'खेती', en: 'Agriculture' } },
  { id: 'construction', name: { mr: 'बांधकाम', hi: 'निर्माण', en: 'Construction' } },
  { id: 'household', name: { mr: 'घरकाम', hi: 'घर का काम', en: 'Household' } },
  { id: 'transport', name: { mr: 'वाहतूक', hi: 'परिवहन', en: 'Transport' } },
  { id: 'skilled', name: { mr: 'कुशल काम', hi: 'कुशल काम', en: 'Skilled work' } },
  { id: 'other', name: { mr: 'इतर', hi: 'अन्य', en: 'Other' } },
]
