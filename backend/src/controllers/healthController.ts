import type { Request, Response } from 'express'

export const getHealth = (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'gaavkaam-backend',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'development',
  })
}
