import { z } from 'zod'

export const createServiceSchema = z.object({
  title: z.string().min(3, 'Service title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  categoryId: z.string().optional(),
  location: z.string().optional(),
  village: z.string().optional(),
  taluka: z.string().optional(),
  district: z.string().optional(),
  rate: z.string().min(1, 'Rate is required'),
})

export const updateServiceSchema = createServiceSchema.partial()
