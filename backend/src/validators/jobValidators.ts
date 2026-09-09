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
