import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

/**
 * 可以捕获全局的异常
 * ref: https://docs.nestjs.cn/9/exceptionfilters?id=%e6%8d%95%e8%8e%b7%e5%bc%82%e5%b8%b8
 * 1. 需要在main.ts，使用useGlobalFilters Api添加全局过滤器。或使用 APP_FILTER的Token方式，第二点
 * 2. 需要在App Module中使用 APP_FILTER的Token方式全局注入
 */
@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly loggerService: LoggerService,
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    this.loggerService.error(`${request.originalUrl} ${request.method}`);
    this.loggerService.error(exception.stack);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      success: false,
      message: exception.message,
    });
  }
}
