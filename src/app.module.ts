import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AnyExceptionFilter } from './filters/any-exception.filter';
import { LinkController } from './controllers/link/link.controller';
import { LinkService } from './services/link/link.service';
import WinstonDailyLogConfig from './config/daily-log';

@Module({
  imports: [WinstonDailyLogConfig],
  controllers: [AppController, LinkController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: AnyExceptionFilter },
    LinkService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
