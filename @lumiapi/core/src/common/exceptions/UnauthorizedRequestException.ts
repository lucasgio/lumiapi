import { CustomException } from '../../utils/CustomException';

export class UnauthorizedException extends CustomException {
  statusCode = 401;

  constructor() {
    super('Unauthorized');
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }];
  }
}
