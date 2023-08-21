import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import Baidu from './reptiles/baidu';

@Injectable()
export class AppService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  getHello(): string {
    try {
      const baidu = new Baidu();
      baidu.start();
      return '<b>Hello My World!!!</b>';
    } catch (error) {
      throw error;
    }
  }
}
