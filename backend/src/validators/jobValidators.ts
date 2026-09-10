import { z } from 'zod'

export const getJobsQuerySchema = z.object({
  query: z.string().optional(),
  categoryId: z
    .enum(['agriculture', 'construction', 'household', 'transport', 'skilled', 'other'])
    .optional(),
  maxDistance: z.string().optional(),
  minWage: z.coerce.number().optional(),
  date: z.enum(['today', 'tomorrow', 'this-week']).optional(),
  sort: z.enum(['nearest', 'highest-wage', 'newest']).optional().default('newest'),
  village: z.string().optional(),
  taluka: z.string().optional(),
  district: z.string().optional(),
})

export const getNearbyJobsQuerySchema = z.object({
  village: z.string().optional(),
  taluka: z.string().optional(),
  district: z.string().optional(),
})

export const createApplicationSchema = z.object({
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
})

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
})

export const createJobSchema = z.object({
  title: z.union([
    z.string().min(3, 'Title must be at least 3 characters'),
    z.object({
      mr: z.string().optional(),
      hi: z.string().optional(),
      en: z.string().optional(),
    }),
  ]),
  description: z.union([
    z.string().min(5, 'Description must be at least 5 characters'),
    z.object({
      mr: z.string().optional(),
      hi: z.string().optional(),
      en: z.string().optional(),
    }),
  ]),
  categoryId: z.string().min(1, 'Category is required'),
  village: z.string().optional(),
  taluka: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional().default('Maharashtra'),
  wageAmount: z.coerce.number().min(100, 'Minimum wage amount is ₹100').optional(),
  paymentAmount: z.coerce.number().optional(),
  wageType: z.enum(['daily', 'hourly', 'fixed', 'negotiable']).optional(),
  paymentType: z.enum(['daily', 'hourly', 'fixed', 'negotiable']).optional(),
  workDate: z.string().min(1, 'Work date is required'),
  startTime: z.string().optional().default('08:00'),
  workersRequired: z.coerce.number().min(1, 'At least 1 worker is required').optional().default(1),
  requiredSkills: z.array(z.string()).optional().default([]),
  requiredSkillIds: z.array(z.string()).optional(),
}).transform((data) => ({
  ...data,
  wageAmount: data.wageAmount ?? data.paymentAmount ?? 500,
  wageType: data.wageType ?? data.paymentType ?? 'daily',
  requiredSkills: (data.requiredSkills && data.requiredSkills.length > 0) ? data.requiredSkills : (data.requiredSkillIds || []),
}))

export const editJobSchema = z.object({
  title: z
    .union([
      z.string().min(3),
      z.object({ mr: z.string().optional(), hi: z.string().optional(), en: z.string().optional() }),
    ])
    .optional(),
  description: z
    .union([
      z.string().min(5),
      z.object({ mr: z.string().optional(), hi: z.string().optional(), en: z.string().optional() }),
    ])
    .optional(),
  categoryId: z.string().optional(),
  village: z.string().optional(),
  taluka: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  wageAmount: z.number().int().min(100).optional(),
  wageType: z.enum(['daily', 'hourly', 'fixed', 'negotiable']).optional(),
  workDate: z.string().optional(),
  startTime: z.string().optional(),
  workersRequired: z.number().int().min(1).optional(),
  requiredSkills: z.array(z.string()).optional(),
})

export const createRatingSchema = z.object({
  revieweeId: z.string().min(1, 'Reviewee ID is required'),
  rating: z.number().min(1, 'Minimum rating is 1').max(5, 'Maximum rating is 5'),
  reviewText: z.string().max(1000, 'Review text cannot exceed 1000 characters').optional(),
})

export const createDisputeSchema = z.object({
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  description: z.string().optional(),
  assignmentId: z.string().optional(),
})

export const updateDisputeSchema = z.object({
  status: z.enum(['open', 'under_review', 'investigating', 'resolved', 'rejected', 'dismissed']),
  resolution: z.string().optional(),
})
