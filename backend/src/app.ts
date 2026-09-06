import express from 'express'
import cors from 'cors'
import healthRoutes from './routes/healthRoutes.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ message: 'GaavKaam API is running' })
})

app.use('/api', healthRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
