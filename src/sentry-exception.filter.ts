import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
  } from '@nestjs/common';
  import * as Sentry from '@sentry/node';
  
  @Catch()
  export class SentryExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const context = host.switchToHttp();
      const request = context.getRequest();
      const response = context.getResponse();
  
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : 500;
  
      Sentry.captureException(exception);
  
      if (response) {
        response.status(status).json({
          statusCode: status,
          message: exception.message || 'Internal server error',
        });
      } else {
        Logger.error(exception);
      }
    }
  }
  