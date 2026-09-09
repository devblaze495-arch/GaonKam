import { z } from 'zod'

export const phoneRegex = /^[6-9][0-9]{9}$/

export const requestOtpSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Enter a valid 10-digit Indian mobile number'),
})

export const verifyOtpSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Enter a valid 10-digit Indian mobile number'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be a 6-digit numeric code'),
})

export const profilePatchSchema = z.object({
  fullName: z
    .union([
      z.string().min(2, 'Name must be at least 2 letters'),
      z.object({
        original: z.string().min(2, 'Name must be at least 2 letters'),
        en: z.string().optional(),
      }),
    ])
    .optional(),
  fullNameEn: z.string().optional(),
  village: z.string().optional(),
  taluka: z.string().optional(),
  district: z.string().optional(),
  preferredLanguage: z.enum(['mr', 'hi', 'en']).optional(),
  languagesKnown: z.array(z.string()).optional(),
})

export const intentsSchema = z.object({
  intents: z
    .array(z.enum(['find-work', 'post-work', 'find-service', 'offer-service']))
    .min(1, 'Select at least one intent'),
})

export const userSkillItemSchema = z.object({
  skillId: z.string().min(1, 'Skill ID is required'),
  experience: z.enum(['less-than-year', 'one-three', 'three-five', 'five-plus']),
})

export const skillsSchema = z.object({
  skills: z.array(userSkillItemSchema),
})

export const preferencesSchema = z.object({
  dailyWage: z
    .number({ error: 'Daily wage must be a number' })
    .int()
    .min(100, 'Minimum daily wage is ₹100')
    .max(10000, 'Maximum daily wage is ₹10,000'),
  availability: z.enum(['today', 'this-week', 'selected-days', 'unavailable']),
  selectedDays: z
    .array(
      z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    )
    .optional()
    .default([]),
})

export const transportationSchema = z.object({
  vehicles: z.array(
    z.enum(['none', 'bicycle', 'motorcycle', 'scooter', 'auto', 'tractor', 'car', 'pickup', 'other']),
  ),
  canTravel: z.boolean(),
  maxDistance: z.enum(['5', '10', '20', '30-plus']),
})
