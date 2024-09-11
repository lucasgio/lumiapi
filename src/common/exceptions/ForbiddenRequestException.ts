import { CustomException } from '../../utils/CustomException'

export class ForbiddenException extends CustomException {
  statusCode = 403

  constructor() {
    super('Forbidden')
    Object.setPrototypeOf(this, ForbiddenException.prototype)
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }]
  }
}
