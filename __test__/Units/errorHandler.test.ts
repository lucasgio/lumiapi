import { NextFunction, Request, Response } from 'express'
import { errorHandler } from '../../src/middleware/errorHandler'
import { LoggerHelper } from '../../src/utils/LoggerHelper'
import { BadRequestError } from '../../src/common/exceptions/BadRequestException'

// Mock the LoggerHelper to avoid actual logging
jest.mock('../../src/utils/LoggerHelper')

describe('errorHandler middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction
  let statusMock: jest.Mock
  let jsonMock: jest.Mock

  beforeEach(() => {
    mockRequest = {}
    jsonMock = jest.fn()
    statusMock = jest.fn(() => ({ json: jsonMock }))

    mockResponse = {
      status: statusMock,
    }

    mockNext = jest.fn()
  })

  it('should return the correct status and serialized errors for CustomException', () => {
    const customError = new BadRequestError('Test error')
    customError.statusCode = 400
    customError.serializeErrors = jest.fn(() => [{ message: 'Test error' }])

    errorHandler(customError, mockRequest as Request, mockResponse as Response, mockNext)

    expect(statusMock).toHaveBeenCalledWith(400)
    expect(jsonMock).toHaveBeenCalledWith({
      errors: [{ message: 'Test error' }],
    })
  })

  it('should log the error and return a 500 status for generic errors', () => {
    const genericError = new Error('Generic error')

    errorHandler(genericError, mockRequest as Request, mockResponse as Response, mockNext)

    expect(LoggerHelper.logError).toHaveBeenCalledWith('Generic error')

    expect(statusMock).toHaveBeenCalledWith(500)
    expect(jsonMock).toHaveBeenCalledWith({
      errors: [{ message: 'Internal server error' }],
    })
  })

  it('should handle errors with no message and return 500', () => {
    const genericError = new Error()

    errorHandler(genericError, mockRequest as Request, mockResponse as Response, mockNext)

    expect(LoggerHelper.logError).toHaveBeenCalledWith('')

    expect(statusMock).toHaveBeenCalledWith(500)
    expect(jsonMock).toHaveBeenCalledWith({
      errors: [{ message: 'Internal server error' }],
    })
  })
})
