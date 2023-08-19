import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AnyExceptionFilter } from './filters/any-exception.filter';
import { LinkController } from './controllers/link/link.controller';
import { LinkService } from './services/link/link.service';
import { StockController } from './controllers/stock/stock.controller';
import { StockService } from './services/stock/stock.service';
import { BillController } from './controllers/bill/bill.controller';
import { BillService } from './services/bill/bill.service';
import WinstonDailyLogConfig from './config/daily-log';

@Module({
  imports: [WinstonDailyLogConfig],
  controllers: [AppController, LinkController, StockController, BillController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: AnyExceptionFilter },
    LinkService,
    StockService,
    BillService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
