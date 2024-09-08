import dotenv from 'dotenv'
dotenv.config()

export const app = {
  port: parseInt(process.env.PORT as string) || 3000,
  version: process.env.VERSION || 'v1',
  db: {
    host: process.env.DB_HOST,
  },
}
