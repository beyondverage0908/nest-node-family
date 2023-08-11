import { Inject, Injectable, LoggerService } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import axios from 'axios';
import * as https from 'https';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import { CheerioTool } from 'src/tools/cheerio-tool';
import {
  getOriginFromUrl,
  getTopDomainFromUrl,
  removeAllSpace,
} from 'src/tools/tool';
import { requestAxiosHeaders } from 'src/config/request-headers';
import { NetWork } from 'src/entities/network';
import { createFolder, deleteFile, fileExist } from 'src/utils/file-tool';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { chromium } from 'playwright';

@Injectable()
export class LinkService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly loggerService: LoggerService,
  ) {}
  async getLinkNumber(linkUrl: string) {
    if (!linkUrl) {
      throw new Error('链接不能为空');
    }
    const cheerioTool = new CheerioTool();
    const agent = new https.Agent({ rejectUnauthorized: false });
    const httpResponse = await axios.get(linkUrl, {
      timeout: 6000,
      responseEncoding: 'utf-8',
      responseType: 'arraybuffer',
      httpsAgent: agent,
      headers: requestAxiosHeaders,
      maxRedirects: 15,
    });
    // 判断获取页面的编码格式
    let decodeType = '';
    const contentType =
      httpResponse.headers['content-type'] ||
      httpResponse.headers['Content-Type'];
    const regex = /charset=([\w-]+)/i;
    const match = contentType.match(regex);
    if (match && match[1]) {
      decodeType = match[1].toLowerCase();
    }
    let decoder = iconv.decode(httpResponse.data, decodeType || 'gbk');
    let htmlStr = decoder.toString();
    let $ = cheerio.load(htmlStr);
    if (!decodeType) {
      // 从响应头中无法获取解码方式，则从html中解析
      decodeType = cheerioTool.getHtmlCharset(htmlStr);
    }
    if (decodeType) {
      decodeType = decodeType.toLowerCase();
      decoder = iconv.decode(httpResponse.data, decodeType); // 关键步骤
      htmlStr = decoder.toString();
      $ = cheerio.load(htmlStr);
    }
    $('style').remove();
    $('script').remove();
    const urlOrigin = getOriginFromUrl(removeAllSpace(linkUrl));
    const topDomain = getTopDomainFromUrl(removeAllSpace(linkUrl));
    const alinks = [];
    $('a').each((_, ele) => {
      let link = $(ele).attr('href');
      if (!link) return;
      if (link.startsWith('../')) return;
      if (link.startsWith('http') && !link.includes(topDomain)) return;
      if (link.startsWith('http')) {
      } else if (link.startsWith('/')) {
        link = urlOrigin + link;
      } else if (link.startsWith('./')) {
        link = urlOrigin + '/' + link.replace('./', '');
      } else {
        link = urlOrigin + '/' + link;
      }
      if (!alinks.includes(link)) alinks.push(link);
    });
    return alinks;
  }
  async writeToExcel(networks: NetWork[]) {
    this.loggerService.log('writeToExcel');
    // 创建一个新的工作簿
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Websites');

    // 设置表头
    worksheet.columns = [
      { header: '网址', key: 'name', width: 30 },
      { header: 'url', key: 'url', width: 30 },
      { header: 'code', key: 'domainCode', width: 10 },
      { header: '类别', key: 'category', width: 30 },
      { header: '支持爬取', key: 'fetch', width: 10 },
      { header: '手动查看', key: 'retry', width: 10 },
      { header: '耗时', key: 'duration', width: 10 },
      { header: '文本相似度', key: 'similarity', width: 10 },
      { header: '静态Content', key: 'cheerioContentLength', width: 10 },
      { header: '静态页面a标签数', key: 'cheerioAlinkNum', width: 10 },
      { header: '动态页面a标签数', key: 'pupAlinkNum', width: 10 },
      { header: '错误信息', key: 'errormessage', width: 50 },
    ];

    // 循环写入数据
    networks.forEach((item) => {
      worksheet.addRow({
        name: item.name,
        url: item.url,
        category: item.category,
        errormessage: item.message,
      });
    });

    // 保存 Excel 文件到指定路径
    const folderPath = path.join(process.cwd(), 'output');
    createFolder(folderPath);
    const outputPath = path.join(folderPath, `test.xlsx`);
    const exist = await fileExist(outputPath);
    if (exist) {
      await deleteFile(outputPath);
    }
    await workbook.xlsx
      .writeFile(outputPath)
      .then(() => {
        console.log(`Excel file saved to "${outputPath}" successfully.`);
      })
      .catch((err) => {
        console.error('Error saving Excel file:', err);
      });
  }
  // 获取股价
  async fetchStockValue(stock: string) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(`https://quote.eastmoney.com/${stock}.html`, {
        waitUntil: 'domcontentloaded',
      });
      const selector =
        '.quote_quotenums > .zxj > span:nth-child(1) > span:nth-child(1)';
      await page.waitForSelector(selector);
      const text = await page.$eval(selector, (span) => span.textContent);
      return text;
    } catch (error) {
      throw error;
    } finally {
      await page.close();
      await context.close();
      await browser.close();
    }
  }
}
