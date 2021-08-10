import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export type ErrorResponse = {
  statusCode?: any;
  error?: { name: string; message: string };
  timestamp?: string;
  path?: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let responseObject: ErrorResponse = {};
    if (exception instanceof HttpException) {
      responseObject = {
        statusCode: (exception as HttpException)?.getStatus(),
        error: {
          name: (exception as HttpException)?.name,
          message: (exception as HttpException)?.message,
        },
      };
    } else {
      responseObject = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: {
          // name: 'Internal Server Error',
          // message: 'Something went wrong',
          name: (exception as HttpException)?.name,
          message: (exception as HttpException)?.message,
        },
      };
    }

    responseObject.timestamp = new Date().toISOString();
    responseObject.path = request.url;

    response.status(responseObject.statusCode).json(responseObject);
  }
}
