import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
// import * as Sentry from '@sentry/nestjs'; // ✅ use the official SDK

@Catch(HttpException)
export class NormalizeErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const res = exception.getResponse();

    const message =
      typeof res === 'string'
        ? [res]
        : Array.isArray((res as any).message)
          ? (res as any).message
          : [(res as any).message || 'Unexpected error'];
    console.log(process.env.NODE_ENV);
    console.log('SENTRY_DSN:', process.env.SENTRY_DSN);

    const isProd = process.env.NODE_ENV === 'production';

    const errorResponse: Record<string, any> = {
      statusCode: status,
      message,
    };

    if (!isProd) {
      // 🧩 Development: include detailed info
      errorResponse.errorName = exception.name;
      errorResponse.timestamp = new Date().toISOString();
      errorResponse.stack = (exception as any).stack;
      errorResponse.path = request.url;
    } else {
      // 🧠 Production: log to monitoring service
      //   try {
      //     Sentry.captureException(exception, {
      //       extra: {
      //         url: request.url,
      //         method: request.method,
      //         body: request.body,
      //         params: request.params,
      //         query: request.query,
      //         userAgent: request.headers['user-agent'],
      //       },
      //       tags: {
      //         environment: process.env.NODE_ENV,
      //         statusCode: status,
      //       },
      //     });
      //   } catch (monitorErr) {
      //     console.error('Error reporting to Sentry:', monitorErr);
      //   }
    }

    response.status(status).json(errorResponse);
  }
}
