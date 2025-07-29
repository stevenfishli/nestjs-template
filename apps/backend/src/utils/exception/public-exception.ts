import { HttpException, HttpStatus } from '@nestjs/common';
import { PublicErrorCode } from './public-error-code.enum';

export class PublicException extends HttpException {
  constructor(
    public readonly errorCode: PublicErrorCode,
    public override readonly message = '',
    status: number = HttpStatus.BAD_REQUEST
  ) {
    super({ errorCode, message }, status);
  }
}
