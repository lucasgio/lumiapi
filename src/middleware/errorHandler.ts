/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { CustomException } from '../utils/CustomException'
import { LoggerHelper } from '../utils/LoggerHelper'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomException) {
    return res.status(err.statusCode).json({
      errors: err.serializeErrors(),
    })
  }

  LoggerHelper.logError(err.message)

  res.status(500).json({
    errors: [{ message: 'Internal server error' }],
  })
}
