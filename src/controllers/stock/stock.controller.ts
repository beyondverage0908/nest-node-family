import { Controller, Get, Query } from '@nestjs/common';
import { HttpResult } from '../../../src';
import { StockService } from '../../services/stock/stock.service';

@Controller('/nest/api/stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}
  @Get('today')
  async getDayTurnover(): Promise<HttpResult<any>> {
    const result = await this.stockService.getDayTurnover();
    return {
      code: 200,
      message: result ? '成功' : '获取失败',
      success: !!result,
      data: result ?? [],
    };
  }
  @Get('lastday')
  async getLastDayTrunover(): Promise<HttpResult<any>> {
    const result = await this.stockService.getLastDayTurnover();
    return {
      code: 200,
      message: result ? '成功' : '获取失败',
      success: !!result,
      data: result ?? [],
    };
  }
  @Get('stockvalue')
  async getStockValue(
    @Query('securityCode') securityCode: string,
  ): Promise<HttpResult<any>> {
    if (!securityCode) {
      return {
        code: 201,
        message: '证券代码不能为空',
        success: false,
      };
    }
    const result = await this.stockService.getSecurityInfo(securityCode);
    if (result) {
      return {
        code: 200,
        message: '成功',
        success: true,
        data: result,
      };
    } else {
      return {
        code: 201,
        message: '当前证券代码未获取到信息',
        success: false,
        data: null,
      };
    }
  }
}
