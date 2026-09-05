import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { failure } from './api-response.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    const message = typeof exceptionResponse === 'string' ? exceptionResponse : exception instanceof Error && status >= 500 ? 'Internal server error' : ((exceptionResponse as { message?: string | string[] } | null)?.message ?? 'Request failed');
    const errors = Array.isArray(message) ? message : [];
    response.status(status).json(failure(Array.isArray(message) ? 'Validation failed' : message, errors));
    if (status >= 500) console.error({ method: request.method, path: request.url, exception });
  }
}