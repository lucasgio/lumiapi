import { Request, Response, Router } from 'express'

export const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Server is running',
    port: process.env.PORT,
    version: process.env.VERSION,
  })
})
