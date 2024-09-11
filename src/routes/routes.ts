import { Request, Response, Router } from 'express'

export const router = Router()

/*
 * This path is for the server check, additionally
 * you can include the paths of your project
 */
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Server is running',
    port: process.env.PORT,
    version: process.env.VERSION,
  })
})
