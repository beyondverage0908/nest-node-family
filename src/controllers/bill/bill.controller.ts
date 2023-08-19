import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { BillDownloadDto } from './bill.controller.dto';
import { BillService } from '../../services/bill/bill.service';
import { Response } from 'express';

@Controller('nest/api/bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post('download')
  async download(@Body() body: BillDownloadDto, @Res() res: Response) {
    console.log(body);
    if (!body.dates || !body.dates.length) {
      res.send({
        code: HttpStatus.FORBIDDEN,
        success: false,
        message: '日期不能为空',
      });
      return;
    }
    const zip = await this.billService.generateBill(body.dates);
    res.set('Content-Type', 'application/zip');
    res.attachment('tickets.zip');
    zip.pipe(res);
  }
}
