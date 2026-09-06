import { z } from 'zod'

export const objectIdSchema = z.string().uuid({ message: 'Invalid UUID format' })

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export function validateBody<T>(schema: z.ZodSchema<T>, payload: unknown) {
  return schema.parse(payload)
}

export function validateParams<T>(schema: z.ZodSchema<T>, payload: unknown) {
  return schema.parse(payload)
}
