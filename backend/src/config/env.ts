import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  appName: process.env.APP_NAME ?? 'GaavKaam',
  defaultLanguage: process.env.APP_DEFAULT_LANGUAGE ?? 'mr',
}
