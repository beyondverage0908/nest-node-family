import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { chromium } from 'playwright';
import { formatDate, generateShopUrl, generateWechatUrl } from './ticket';
import * as path from 'path';
import * as fs from 'fs';
import * as dayjs from 'dayjs';
import * as archiver from 'archiver';

@Injectable()
export class BillService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  async generateBill(dates: string[]) {
    this.logger.log('开始准备生成小票图片');
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setViewportSize({
      width: 375,
      height: 667,
    });
    // 确定目录是否存在
    const dir = path.resolve(process.cwd(), 'static/tickets');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const dateTimes = dates.map((el) => formatDate(el));
    for await (const [index, date] of dateTimes.entries()) {
      const url =
        index % 2 === 1
          ? generateShopUrl({ shopTime: date })
          : generateWechatUrl({ shopTime: date });
      await page.goto(url, { waitUntil: 'load' });
      await page.screenshot({
        path: `${path.resolve(dir, dayjs(date).format('YYYY-MM-DD') + '.png')}`,
        fullPage: true,
      });
    }
    await page.close();
    await context.close();
    await browser.close();
    this.logger.log('小票生成完成');
    const zip = this.createZipArchive();
    return zip;
  }

  async createZipArchive(): Promise<archiver.Archiver> {
    const archive = archiver('zip');
    const imagesFolderPath = path.join(process.cwd(), 'static/tickets');
    // 获取目录下所有的文件名
    const images = fs.readdirSync(imagesFolderPath);
    images.forEach((image) => {
      const imagePath = path.join(imagesFolderPath, image);
      archive.append(fs.createReadStream(imagePath), { name: image });
    });
    await archive.finalize();
    return archive;
  }
}
