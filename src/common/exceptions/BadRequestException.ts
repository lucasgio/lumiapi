import { CustomException } from '../../utils/CustomException'

export class BadRequestError extends CustomException {
  statusCode = 400

  constructor(public message: string) {
    super(message)
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors(): { message: string }[] {
    return [{ message: this.message }]
  }
}
