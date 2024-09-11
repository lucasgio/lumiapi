import { CustomException } from '../../utils/CustomException'

export class NotFoundError extends CustomException {
  statusCode = 404

  constructor() {
    super('Route not found')
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }]
  }
}
