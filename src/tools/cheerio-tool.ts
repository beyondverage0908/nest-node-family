import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

@Injectable()
export class CheerioTool {
  getHtmlCharset(html: string) {
    const $ = cheerio.load(html);

    let encoding = '';
    const metaTag11 = $('meta[http-equiv="content-type"]');
    const contentAttr11 = metaTag11.attr('content');
    if (contentAttr11) {
      const regex = /charset=([\w-]+)/i;
      const match = contentAttr11.match(regex);
      if (match && match[1]) {
        encoding = match[1].toLowerCase();
      }
    }
    const metaTag12 = $('meta[http-equiv="Content-Type"]');
    const contentAttr12 = metaTag12.attr('content');
    if (contentAttr12) {
      const regex = /charset=([\w-]+)/i;
      const match = contentAttr12.match(regex);
      if (match && match[1]) {
        encoding = match[1].toLowerCase();
      }
    }
    const metaTag21 = $('meta[charset]');
    const charsetAttr = metaTag21.attr('charset');
    if (charsetAttr) {
      encoding = charsetAttr;
    }
    const metaTag22 = $('meta[charSet]');
    const charSetAttr = metaTag22.attr('charSet');
    if (charSetAttr) {
      encoding = charSetAttr;
    }
    return encoding;
  }
}
