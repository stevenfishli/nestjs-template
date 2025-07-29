import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorDto } from './error.dto';
import { PublicException } from './public-exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorDto: ErrorDto = {
      message: 'Internal server error',
    };

    // PublicException handling
    if (exception instanceof PublicException) {
      status = exception.getStatus();
      errorDto = {
        message: exception.message ? exception.message : undefined,
        errorCode: exception.errorCode,
      };
      response.status(status).json(errorDto);
      return;
    }

    // Handle other exceptions
    this.logger.error(
      'Unhandled Exception',
      exception instanceof Error ? exception.stack : String(exception)
    );
    // TODO: notify developers or log to a monitoring service
    response.status(status).json(errorDto);
  }
}
