import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object') {
        message = (res as any).message || (res as any).error || message;
        error = (res as any).error || error;
      }
    } else if (exception && typeof exception === 'object') {
      // attempt to read message property
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ex: any = exception;
      if (ex.message) message = ex.message;
    }

    const payload = {
      statusCode: status,
      error,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    // log unexpected errors server-side
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      // eslint-disable-next-line no-console
      console.error('Unhandled exception:', exception);
    }

    response.status(status).json(payload);
  }
}
