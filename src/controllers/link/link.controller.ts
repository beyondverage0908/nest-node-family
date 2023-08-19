import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { HttpResult } from '../../../src';
import { NetWork } from '../../entities/network';
import { LinkService } from '../../services/link/link.service';

@Controller('/nest/api/link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}
  @Get()
  async getLinkInfo(@Query('url') url: string): Promise<HttpResult<any>> {
    const number = await this.linkService.getLinkNumber(url);
    return {
      code: HttpStatus.OK,
      success: true,
      message: '成功',
      data: number,
    };
  }
  @Get('/excel/test')
  async getExcelTest(@Query('num') num: number): Promise<HttpResult<number>> {
    const networks: NetWork[] = [];
    Array.from({ length: num }).forEach((val, index) => {
      const net = new NetWork(
        `第${index + 1}个`,
        `https://www.baidu.com/${index + 1}`,
      );
      net.message = '错误消息: ' + Date.now();
      networks.push(net);
    });
    await this.linkService.writeToExcel(networks);
    return {
      code: HttpStatus.OK,
      data: num,
      success: true,
      message: '成功',
    };
  }
  @Get('/stock')
  async getStockValue(
    @Query('stock') stock: string,
  ): Promise<HttpResult<string>> {
    const value = await this.linkService.fetchStockValue(stock);
    return {
      success: true,
      code: HttpStatus.OK,
      message: '成功',
      data: value,
    };
  }
}
