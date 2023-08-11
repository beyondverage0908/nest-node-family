import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { HttpResult } from 'src';
import { NetWork } from 'src/entities/network';
import { LinkService } from 'src/services/link/link.service';

@Controller('link')
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
  async getxx() {
    const networks: NetWork[] = [];
    Array.from({ length: 10000 }).forEach((val, index) => {
      const net = new NetWork(
        `第${index + 1}个`,
        `https://www.baidu.com/${index + 1}`,
      );
      net.message = '错误消息: ' + Date.now();
      networks.push(net);
    });
    return this.linkService.writeToExcel(networks);
  }
}
